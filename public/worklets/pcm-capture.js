// AudioWorklet: sammelt Mikrofon-Samples und schickt sie in Blöcken (~100 ms)
// an den Haupt-Thread. Resampling auf 16 kHz passiert dort (src/lib/audio/pcm.ts).
class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.blockSize = Math.round(sampleRate / 10);
    this.buffer = new Float32Array(this.blockSize);
    this.filled = 0;
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;
    let i = 0;
    while (i < channel.length) {
      const n = Math.min(channel.length - i, this.blockSize - this.filled);
      this.buffer.set(channel.subarray(i, i + n), this.filled);
      this.filled += n;
      i += n;
      if (this.filled === this.blockSize) {
        this.port.postMessage(this.buffer.slice(0));
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor("pcm-capture", PcmCaptureProcessor);
