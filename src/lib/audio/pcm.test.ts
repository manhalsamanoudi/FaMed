import { describe, expect, it } from "vitest";
import {
  base64ToInt16,
  downsample,
  encodeWav,
  floatToInt16,
  int16ToBase64,
  int16ToFloat,
  rms,
} from "./pcm";

describe("downsample", () => {
  it("halbiert die Länge bei 32k → 16k und mittelt Nachbarwerte", () => {
    const input = new Float32Array([0, 1, 0.5, 0.5, -1, 0]);
    expect(Array.from(downsample(input, 32000, 16000))).toEqual([0.5, 0.5, -0.5]);
  });

  it("liefert für 48k → 16k ein Drittel der Samples", () => {
    expect(downsample(new Float32Array(4800), 48000, 16000).length).toBe(1600);
  });

  it("lässt gleiche Rate unverändert", () => {
    const input = new Float32Array([0.1, 0.2]);
    expect(downsample(input, 16000, 16000)).toBe(input);
  });
});

describe("Int16-Konvertierung", () => {
  it("begrenzt auf [-1, 1] und skaliert korrekt", () => {
    expect(Array.from(floatToInt16(new Float32Array([-2, -1, 0, 1, 2])))).toEqual([
      -32768, -32768, 0, 32767, 32767,
    ]);
  });

  it("übersteht den Base64-Rundweg verlustfrei", () => {
    const samples = new Int16Array([0, 1, -1, 32767, -32768, 1234]);
    expect(Array.from(base64ToInt16(int16ToBase64(samples)))).toEqual(Array.from(samples));
  });

  it("wandelt Int16 zurück in Float", () => {
    expect(int16ToFloat(new Int16Array([-32768, 0]))[0]).toBe(-1);
  });
});

describe("encodeWav", () => {
  it("schreibt einen gültigen 44-Byte-Header plus Daten", () => {
    const wav = encodeWav([new Int16Array([1, 2]), new Int16Array([3])], 16000);
    const view = new DataView(wav.buffer);
    const text = (o: number) => String.fromCharCode(...wav.subarray(o, o + 4));
    expect(text(0)).toBe("RIFF");
    expect(text(8)).toBe("WAVE");
    expect(view.getUint32(24, true)).toBe(16000);
    expect(view.getUint32(40, true)).toBe(6);
    expect(wav.length).toBe(50);
    expect(view.getInt16(48, true)).toBe(3);
  });
});

describe("rms", () => {
  it("ist 0 für Stille und 1 für Vollaussteuerung", () => {
    expect(rms(new Float32Array(10))).toBe(0);
    expect(rms(new Float32Array([1, -1]))).toBe(1);
  });
});
