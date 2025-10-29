This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables

Before running the application, you need to set up the following environment variables in a `.env.local` file:

```bash
# Google Sheets Integration (Required)
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### Setting up Google Sheets Integration

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

#### Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

#### Step 3: Generate Service Account Key

1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format and click "Create"
5. Download the JSON file

#### Step 4: Create and Share Google Spreadsheet

1. Create a new Google Spreadsheet
2. Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
3. Share the spreadsheet with the service account email (found in the JSON file as `client_email`)
4. Give the service account "Editor" permissions

#### Step 5: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables from your JSON file:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_from_url
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email_from_json
GOOGLE_SHEETS_PRIVATE_KEY="your_private_key_from_json_with_newlines"
```

### Troubleshooting Google Sheets Integration

If you're getting permission errors, check the following:

#### Common Issues:

1. **"Permission denied" error:**

   - Ensure you've shared the spreadsheet with the service account email
   - The service account email should have "Editor" permissions
   - Double-check the email address from the JSON file (`client_email` field)

2. **"Spreadsheet not found" error:**

   - Verify the spreadsheet ID in your URL
   - Make sure the spreadsheet exists and is accessible

3. **"Authentication failed" error:**
   - Check that your private key is correctly formatted in `.env.local`
   - Ensure the private key includes the full content with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Make sure newlines are preserved (use quotes around the entire key)

#### Testing Your Setup:

1. **Use the built-in test script:**

   ```bash
   npm run test-sheets
   ```

   This will check your environment variables and test the Google Sheets connection.

2. **Manual verification:**

   - Check if environment variables are loaded:
     ```bash
     echo $GOOGLE_SHEETS_SPREADSHEET_ID
     ```
   - Verify service account permissions:
     - Open your Google Spreadsheet
     - Click "Share" button
     - Confirm the service account email is listed with "Editor" access

3. **Test the actual form:**
   - Visit `/contact` page
   - Fill out and submit the form
   - On successful submission, you'll be redirected to `/thank-you` page
   - Check the browser console for detailed error messages if there are issues

**Note:** The form will only work with proper Google Sheets configuration. Submissions will fail if the integration is not set up correctly.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```bash
node scripts/initialize-user-roles.mjs sunbrix.co@gmail.com
```

```bash
node scripts/make-user-admin.mjs sunbrix.co@gmail.com
```

```bash
node scripts/download-project-images.mjs
```
