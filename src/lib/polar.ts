import { Polar } from "@polar-sh/sdk";
let _polarClient: Polar | null = null;

export function polarClient() {
  if (_polarClient) return _polarClient;

  const apiKey = process.env.POLAR_ACCESS_TOKEN || process.env.POLAR_API_KEY;
  if (!apiKey) {
    // throw or warn depending on how you want startup to behave
    console.warn("POLAR_ACCESS_TOKEN / POLAR_API_KEY not set");
    // still construct? better to throw so the error surface is clear:
    throw new Error("POLAR_ACCESS_TOKEN / POLAR_API_KEY missing");
  }

  _polarClient = new Polar({
    apiKey,
    environment:
      process.env.NODE_ENV !== "production" ? "sandbox" : "production",
  } as any);

  return _polarClient;
}