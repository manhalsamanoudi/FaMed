import { describe, expect, it } from "vitest";
import { isRetryableModelError, parseModelList } from "./env";

describe("parseModelList", () => {
  it("trennt, trimmt und entfernt Leereinträge", () => {
    expect(parseModelList(" a, b ,,c ")).toEqual(["a", "b", "c"]);
  });
});

describe("isRetryableModelError", () => {
  it("erkennt Überlastung, Zeitüberschreitung und Ratenlimit", () => {
    expect(isRetryableModelError({ status: 503 })).toBe(true);
    expect(isRetryableModelError({ status: 504 })).toBe(true);
    expect(isRetryableModelError({ status: 429 })).toBe(true);
    expect(
      isRetryableModelError(new Error('{"error":{"code":503,"message":"high demand"}}')),
    ).toBe(true);
    expect(isRetryableModelError(new Error("DEADLINE_EXCEEDED"))).toBe(true);
  });

  it("wiederholt nicht bei ungültigem Key oder falscher Anfrage", () => {
    expect(isRetryableModelError({ status: 400 })).toBe(false);
    expect(isRetryableModelError(new Error("API_KEY_INVALID"))).toBe(false);
  });
});
