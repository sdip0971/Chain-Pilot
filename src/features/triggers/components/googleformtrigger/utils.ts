
export const generateGoogleFormScript = (
  webhookUrl: string,
) => `
function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();

  // Build responses object
  var responses = {};
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    responses[itemResponse.getItem().getTitle()] =
      itemResponse.getResponse();
  }

  // Prepare webhook payload
  var payload = {
    formId: e.source.getId(),
    formTitle: e.source.getTitle(),
    responseId: formResponse.getId(),
    timestamp: formResponse.getTimestamp(),
    respondentEmail: formResponse.getRespondentEmail(),
    responses: responses
  };

  // Send to webhook
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  var WEBHOOK_URL = '${webhookUrl}';

  try {
    UrlFetchApp.fetch(WEBHOOK_URL, options);
  } catch (error) {
    console.error('Webhook failed:', error);
  }
}
`;
// 👉 This code makes Google Forms send form answers to your backend automatically when someone submits the form.

// That’s it. Everything else is just how.

// Step 0: The problem this code solves
// What normally happens

// Someone fills a Google Form

// Google stores the answers

// Nothing is sent to your backend

// What you WANT

// Someone submits the form

// Your backend immediately receives the answers

// Your app can react (store data, trigger workflows, AI, etc.)

// 🚫 Google Forms does not give you a webhook by default
// ✅ This script creates one manually

// Step 1: What is this function actually returning?
// export const generateGoogleFormScript = (webhookUrl: string) => `...`


// This function does NOT run inside Google.

// Instead, it:

// Runs in your app

// Returns a string

// That string is Google Apps Script code

// Think of it as:

// “Generate a copy-paste script, customized with my webhook URL”

// Example

// If you call:

// generateGoogleFormScript("https://myapp.com/webhook")


// It returns text like:

// function onFormSubmit(e) { ... }


// This text is what the user pastes into Google Apps Script.

// Step 2: The most important line
// function onFormSubmit(e) {


// This is special in Google Apps Script.

// Meaning:

// Google automatically calls this function

// Only when a form is submitted

// e = event data (answers, metadata, etc.)

// You do not call this function yourself.

// Google does.

// Step 3: Getting the form answers
// var formResponse = e.response;
// var itemResponses = formResponse.getItemResponses();

// In plain English:

// formResponse = this single submission

// itemResponses = all questions + answers

// Example internally:

// Q1: Name → "Dipanshu"
// Q2: Email → "abc@gmail.com"
// Q3: Feedback → "Nice app"


// But Google gives this in a complex object format, not JSON.

// Step 4: Converting answers into simple JSON
// var responses = {};
// for (var i = 0; i < itemResponses.length; i++) {
//   var itemResponse = itemResponses[i];
//   responses[itemResponse.getItem().getTitle()] =
//     itemResponse.getResponse();
// }

// What this does (very important)

// It converts Google’s internal format into simple key-value data.

// Before (Google format)

// Objects

// Methods

// Not usable by backend

// After (your format)
// {
//   "Name": "Dipanshu",
//   "Email": "abc@gmail.com",
//   "Feedback": "Nice app"
// }


// This is the core data you care about.

// Step 5: Adding extra useful info
// var payload = {
//   formId: e.source.getId(),
//   formTitle: e.source.getTitle(),
//   responseId: formResponse.getId(),
//   timestamp: formResponse.getTimestamp(),
//   respondentEmail: formResponse.getRespondentEmail(),
//   responses: responses
// };


// This builds one single JSON object to send to your backend.

// Why add this?

// Because answers alone are not enough.

// You also want:

// Which form?

// When was it submitted?

// Who submitted it?

// Unique response ID

// Final payload looks like:
// {
//   "formId": "abc123",
//   "formTitle": "User Feedback",
//   "responseId": "resp_456",
//   "timestamp": "2025-01-01T10:30",
//   "respondentEmail": "user@gmail.com",
//   "responses": {
//     "Name": "Dipanshu",
//     "Feedback": "Nice app"
//   }
// }

// Step 6: Preparing to send data to your backend
// var options = {
//   method: 'post',
//   contentType: 'application/json',
//   payload: JSON.stringify(payload)
// };


// This is just saying:

// “Send this data as JSON using HTTP POST”

// Same as using fetch() in JavaScript.

// Step 7: Using YOUR webhook URL
// var WEBHOOK_URL = '${webhookUrl}';


// This line is why the script is generated dynamically.

// When you generate it, this becomes:

// var WEBHOOK_URL = 'https://yourapp.com/api/webhook';


// So:

// Each user gets their own webhook

// Data goes to the correct workflow

// Step 8: Sending the request
// try {
//   UrlFetchApp.fetch(WEBHOOK_URL, options);
// } catch (error) {
//   console.error('Webhook failed:', error);
// }

// What happens here:

// Google sends an HTTP request

// Your backend receives it

// Google Form submission is not blocked

// Even if your server is down, the form still submits.

// This is safe behavior.

// Step 9: End-to-end flow (simple)
// User submits Google Form
//         ↓
// Google calls onFormSubmit
//         ↓
// Script extracts answers
//         ↓
// Script sends JSON to your backend
//         ↓
// Your app starts processing


