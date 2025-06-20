import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testGoogleSheetsConnection() {
  console.log("🔍 Testing Google Sheets Connection...\n");

  // Check environment variables
  console.log("📋 Checking environment variables:");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  console.log(
    `GOOGLE_SHEETS_SPREADSHEET_ID: ${spreadsheetId ? "Set" : "Missing"}`
  );
  console.log(`GOOGLE_SHEETS_CLIENT_EMAIL: ${clientEmail ? "Set" : "Missing"}`);
  console.log(`GOOGLE_SHEETS_PRIVATE_KEY: ${privateKey ? "Set" : "Missing"}\n`);

  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.log(
      "Missing required environment variables. Please check your .env.local file."
    );
    return;
  }

  try {
    // Initialize Google Sheets client
    console.log("Initializing Google Sheets client...");
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    console.log("Google Sheets client initialized successfully\n");

    // Test reading from the spreadsheet
    console.log("Testing spreadsheet access...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:I1",
    });

    console.log("Successfully accessed spreadsheet!");
    console.log(
      `📊 Current headers: ${
        response.data.values ? response.data.values[0] : "No headers found"
      }\n`
    );

    // Test adding headers
    console.log("Testing header management...");
    const headers = [
      "Timestamp",
      "Full Name",
      "Email",
      "Mobile Number",
      "City",
      "Timeline",
      "Plot Ownership",
      "WhatsApp Consent",
      "Privacy Consent",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1:I1",
      valueInputOption: "RAW",
      requestBody: {
        values: [headers],
      },
    });
    console.log("Headers added successfully");

    // Test writing to the spreadsheet
    console.log("Testing write access...");
    const testData = [
      new Date().toISOString(),
      "Test User",
      "test@example.com",
      "1234567890",
      "Test City",
      "Test Timeline",
      "Test Plot",
      "Yes",
      "Yes",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:I",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [testData],
      },
    });

    console.log("Successfully wrote test data to spreadsheet!");
    console.log("Google Sheets integration is working correctly!\n");
    console.log(
      "💡 You can now submit forms and they will be saved to your spreadsheet."
    );
  } catch (error) {
    console.log("Error testing Google Sheets connection:");
    console.error(error.message);

    if (error.message.includes("permission")) {
      console.log("\n Troubleshooting tips:");
      console.log(
        "1. Make sure you've shared the spreadsheet with the service account email:"
      );
      console.log(`   ${clientEmail}`);
      console.log('2. Give the service account "Editor" permissions');
      console.log("3. Double-check the spreadsheet ID in your URL");
    }
  }
}

testGoogleSheetsConnection();
