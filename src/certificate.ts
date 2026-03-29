import { getResponses } from "./sheets";
import { generateCertificatePdf } from "./slides";

export async function generateCertificates() {
    const rows = await getResponses(process.env.SHEET_ID!);

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        const name = row[1];

        if (!name) continue;

        const presentationId = await generateCertificatePdf(name, process.env.SLIDES_TEMPLATE_ID!);

        console.log(`Generated for ${name}: ${presentationId}`);
    }
}