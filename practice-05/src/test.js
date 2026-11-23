import { createApiClient } from "../src/api-client.js";

const client = createApiClient({
  baseUrl: "http://127.0.0.1:5505/api",
});

async function testTimeout() {
  try {
    await client.requestJson("/debug/delay", {
      query: { ms: 150 },
      timeoutMs: 20,
    });
  } catch (error) {
    console.log("Тайм-аут:");
    console.log("kind:", error.kind);
    console.log("message:", error.message);
  }
}

async function testAbort() {
  const controller = new AbortController();

  const pending = client.requestJson("/debug/delay", {
    query: { ms: 150 },
    signal: controller.signal,
    timeoutMs: 1000,
  });

  controller.abort();

  try {
    await pending;
  } catch (error) {
    console.log("Внешняя отмена:");
    console.log("kind:", error.kind);
    console.log("message:", error.message);
  }
}

await testTimeout();
await testAbort();