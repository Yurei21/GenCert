import { google } from "googleapis";
import fs from "fs";
import open from "open";
import path from "path";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/spreadsheets",
];

const TOKEN_PATH = path.join(process.cwd(), "token.json");

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync("oauth.json", "utf-8"));

  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, "utf-8");
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

    console.log('Authorize this app:', authUrl);
    await open(authUrl);

    const readline = await import('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const code: string = await new Promise((resolve) => 
        rl.question('Enter code: ', resolve)
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    return oAuth2Client
}

const auth = await authorize();

export const sheets = google.sheets({ version: "v4", auth });
export const slides = google.slides({ version: "v1", auth });
export const drive = google.drive({ version: "v3", auth });
