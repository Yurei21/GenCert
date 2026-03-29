import { slides, drive } from "./google";

export async function generateCertificatePdf(name: string, templateId: string) {
  const copy = await drive.files.copy({
    fileId: templateId,
    requestBody: {
      name: `TEMP - ${name}`,
    },
  });

  const presentationId = copy.data.id!;

  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests: [
        {
          replaceAllText: {
            containsText: {
              text: "{{NAME}}",
              matchCase: true,
            },
            replaceText: name,
          },
        },
      ],
    },
  });

  // 3. Export as PDF
  const pdf = await drive.files.export(
    {
      fileId: presentationId,
      mimeType: "application/pdf",
    },
    { responseType: "arraybuffer" },
  );

  // 4. Delete temp file (IMPORTANT)
  await drive.files.delete({
    fileId: presentationId,
  });

  return Buffer.from(pdf.data as ArrayBuffer);
}
