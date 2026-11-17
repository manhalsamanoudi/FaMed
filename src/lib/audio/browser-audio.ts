"use client";

import {
  INPUT_SAMPLE_RATE,
  OUTPUT_SAMPLE_RATE,
  downsample,
  floatToInt16,
  int16ToFloat,
  rms,
} from "./pcm";

export type MicChunk = { pcm16k: Int16Array; level: number };

/** Mikrofon → 16-kHz-PCM-Blöcke (~100 ms). */
export class MicCapture {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private node: AudioWorkletNode | null = null;

  constructor(private readonly onChunk: (chunk: MicChunk) => void) {}

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    this.ctx = new AudioContext();
    await this.ctx.audioWorklet.addModule("/worklets/pcm-capture.js");
    const source = this.ctx.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(this.ctx, "pcm-capture");
    const fromRate = this.ctx.sampleRate;
    this.node.port.onmessage = (e: MessageEvent<Float32Array>) => {
      const level = rms(e.data);
      const pcm16k = floatToInt16(downsample(e.data, fromRate, INPUT_SAMPLE_RATE));
      this.onChunk({ pcm16k, level });
    };
    source.connect(this.node);
  }

  async stop(): Promise<void> {
    this.node?.port.close();
    this.node?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    await this.ctx?.close().catch(() => undefined);
    this.node = null;
    this.stream = null;
    this.ctx = null;
  }
}

/** Spielt 24-kHz-PCM-Blöcke lückenlos nacheinander ab; kann sofort gestoppt werden (Barge-in). */
export class PcmPlayer {
  private ctx: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();

  /** Muss nach einer Nutzeraktion (Klick) aufgerufen werden, sonst blockiert der Browser die Wiedergabe. */
  async init(): Promise<void> {
    this.ctx = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
    await this.ctx.resume();
  }

  get isPlaying(): boolean {
    return this.sources.size > 0;
  }

  enqueue(samples: Int16Array): void {
    if (!this.ctx || samples.length === 0) return;
    const buffer = this.ctx.createBuffer(1, samples.length, OUTPUT_SAMPLE_RATE);
    buffer.copyToChannel(int16ToFloat(samples) as Float32Array<ArrayBuffer>, 0);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.ctx.destination);
    const startAt = Math.max(this.ctx.currentTime, this.nextStartTime);
    src.start(startAt);
    this.nextStartTime = startAt + buffer.duration;
    this.sources.add(src);
    src.onended = () => this.sources.delete(src);
  }

  /** Bricht die laufende Ausgabe sofort ab. */
  flush(): void {
    for (const s of this.sources) {
      try {
        s.stop();
      } catch {
        // bereits beendet
      }
    }
    this.sources.clear();
    this.nextStartTime = 0;
  }

  async close(): Promise<void> {
    this.flush();
    await this.ctx?.close().catch(() => undefined);
    this.ctx = null;
  }
}
