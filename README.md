# GenCert

**Automated certificate generator powered by Google Sheets and Google Slides.**

GenCert fetches recipient data from a Google Sheet, personalizes a Google Slides template for each entry, and exports all generated certificates as a single ZIP file — no manual work required.

---

## Features

- 📊 Uses Google Sheets as a data source
- 🎨 Uses Google Slides as a certificate template
- ⚡ Batch generates personalized certificates
- 📦 Exports all certificates as a ZIP file
- 🔐 Secure Google OAuth 2.0 authentication

---

## Prerequisites

- Node.js installed
- A Google Cloud project with OAuth 2.0 credentials (Desktop App type)
- Access to the Google Sheets and Google Slides APIs enabled in your project
- Your email added as a test user in the OAuth consent screen

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Google API credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 client ID (type: **Desktop App**)
3. Download the credentials file and rename it to `credentials.json`
4. Place `credentials.json` in the root of the project
5. Add your Google account email as a test user under **OAuth consent screen**

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
SHEET_ID=your_google_sheets_id
SLIDES_TEMPLATE_ID=your_google_slides_template_id
PORT=3000
```

| Variable             | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| `SHEET_ID`           | The ID of your Google Sheet containing recipient data           |
| `SLIDES_TEMPLATE_ID` | The ID of your Google Slides template (must contain `{{NAME}}`) |
| `PORT`               | Port the server runs on (default: `3000`)                       |

---

## Running the App

Start the development server:

```bash
npx tsx src/server.ts
```

---

## Authentication

On first run, GenCert will open a browser window and prompt you to log in with Google. After granting the required permissions:

1. Copy the authorization code returned in the browser
2. Paste it into the terminal when prompted
3. A `token.json` file will be saved automatically for future sessions

---

## Generating Certificates

Once authenticated, open your browser and navigate to:

```
http://localhost:3000/generate-all
```

GenCert will:

1. Fetch recipient data from your Google Sheet
2. Create a personalized copy of the Slides template for each row
3. Package all certificates into a ZIP file for download

---

## Template Setup

Your Google Slides template must include the placeholder `{{NAME}}` wherever the recipient's name should appear. GenCert will replace this placeholder with the corresponding value from your Sheet for each certificate generated.

---

## Notes

- Ensure your Google account has **edit access** to both the Sheet and the Slides template.
- The `token.json` file stores your OAuth session — keep it private and do not commit it to version control.
- Add `token.json` and `.env` to your `.gitignore` to avoid accidentally exposing credentials.