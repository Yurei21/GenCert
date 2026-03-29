import { sheets } from "./google";

export async function getNames(spreadsheetId: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Form Responses 1!A:Z",
  });

  const rows = res.data.values || [];

  const names = rows
    .slice(1)
    .map((row) => row[4]) 
    .filter(Boolean);

  return names;
}
