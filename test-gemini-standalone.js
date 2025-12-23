// test-gemini-standalone.js
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { generateText } = require('ai');

async function run() {
  console.log("--- STARTING GEMINI TEST ---");

  const TEST_KEY = "AIzaSyAQ6g_ALt1yFx7t9eliOQSnOfzgynUNqFA";
  console.log(`Using Key: ${TEST_KEY.substring(0, 10)}...`);

  const google = createGoogleGenerativeAI({
    apiKey: TEST_KEY,
  });

  try {
    console.log("Sending request to Google...");
    const { text } = await generateText({
      model: google('	gemini-3-flash-preview'),
      prompt: 'Say hello!',
    });

    console.log("✅ SUCCESS! Response:", text);
  } catch (error) {
    console.error("❌ FAILED!", error);
  }
}

run();
