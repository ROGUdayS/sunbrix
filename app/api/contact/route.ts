import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// Initialize Google Sheets API
async function getGoogleSheetsClient() {
  // Check if we have the required environment variables
  if (
    !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
    !process.env.GOOGLE_SHEETS_PRIVATE_KEY
  ) {
    throw new Error("Missing required Google Sheets credentials");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function POST(request: NextRequest) {
  try {
    console.log("Contact form submission received");
    const body = await request.json();
    console.log("Form data:", {
      ...body,
      mobileNumber: body.mobileNumber ? "[REDACTED]" : undefined,
    });

    const {
      fullName,
      email,
      mobileNumber,
      city,
      timeline,
      plotOwnership,
      whatsappConsent,
      privacyConsent,
    } = body;

    // Validate required fields
    if (!fullName || !email || !mobileNumber) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if Google Sheets is properly configured
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const hasGoogleSheetsConfig =
      spreadsheetId &&
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
      process.env.GOOGLE_SHEETS_PRIVATE_KEY;

    if (!hasGoogleSheetsConfig) {
      console.log("Google Sheets not configured");
      console.log("Missing environment variables:");
      if (!spreadsheetId) console.log("- GOOGLE_SHEETS_SPREADSHEET_ID");
      if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL)
        console.log("- GOOGLE_SHEETS_CLIENT_EMAIL");
      if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY)
        console.log("- GOOGLE_SHEETS_PRIVATE_KEY");

      return NextResponse.json(
        {
          error:
            "Google Sheets integration not configured. Please set up the required environment variables.",
        },
        { status: 500 }
      );
    }

    // Get Google Sheets client
    console.log("Initializing Google Sheets client...");
    const sheets = await getGoogleSheetsClient();
    console.log("Google Sheets client initialized successfully");

    // Prepare the row data
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      fullName,
      email,
      mobileNumber,
      city,
      timeline,
      plotOwnership,
      whatsappConsent ? "Yes" : "No",
      privacyConsent ? "Yes" : "No",
    ];

    // Ensure headers are present in the spreadsheet
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

    try {
      const headerResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A1:I1",
      });

      const existingHeaders = headerResponse.data.values?.[0];
      const headersMatch =
        existingHeaders &&
        existingHeaders.length === headers.length &&
        existingHeaders.every((header, index) => header === headers[index]);

      if (!headersMatch) {
        console.log("Adding/updating headers in spreadsheet...");
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: "Sheet1!A1:I1",
          valueInputOption: "RAW",
          requestBody: {
            values: [headers],
          },
        });
        console.log("Headers added successfully");
      }
    } catch (error) {
      console.error("Error managing headers:", error);
      // Try to add headers anyway
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: "Sheet1!A1:I1",
          valueInputOption: "RAW",
          requestBody: {
            values: [headers],
          },
        });
        console.log("Headers added successfully (fallback)");
      } catch (headerError) {
        console.error("Failed to add headers:", headerError);
      }
    }

    // Append the form data to the sheet
    console.log("Appending data to Google Sheets...");
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:I",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [rowData],
        },
      });

      console.log("Data successfully appended to Google Sheets");
      return NextResponse.json(
        { message: "Form submitted successfully" },
        { status: 200 }
      );
    } catch (sheetsError) {
      console.error("Google Sheets error:", sheetsError);
      console.log("Form submission data (failed to save to sheets):", {
        timestamp: new Date().toISOString(),
        fullName,
        email,
        mobileNumber: "[REDACTED]",
        city,
        timeline,
        plotOwnership,
        whatsappConsent: whatsappConsent ? "Yes" : "No",
        privacyConsent: privacyConsent ? "Yes" : "No",
      });

      // Return error instead of success when Google Sheets fails
      let errorMessage = "Failed to save to Google Sheets";
      if (sheetsError instanceof Error) {
        if (sheetsError.message.includes("permission")) {
          errorMessage =
            "Google Sheets permission denied. Please ensure the service account has access to the spreadsheet.";
        } else if (sheetsError.message.includes("not found")) {
          errorMessage =
            "Google Spreadsheet not found. Please check the spreadsheet ID.";
        } else {
          errorMessage = `Google Sheets error: ${sheetsError.message}`;
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error) {
    console.error("Error submitting form:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to submit form";
    if (error instanceof Error) {
      if (error.message.includes("credentials")) {
        errorMessage =
          "Google Sheets authentication failed. Please check your credentials.";
      } else if (error.message.includes("Spreadsheet ID")) {
        errorMessage =
          "Google Sheets configuration error. Please check your spreadsheet ID.";
      } else {
        errorMessage = `Submission failed: ${error.message}`;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
