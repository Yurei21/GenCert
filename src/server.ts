import dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import { generateCertificatePdf } from "./slides";
import { getNames } from "./sheets";
import archiver from "archiver";
import { PassThrough } from "stream";

const fastify = Fastify({ logger: true });

fastify.get("/", async () => {
  return { status: "ok" };
});

fastify.get("/generate", async (request, reply) => {
  try {
    const name = "John Doe"; // test value

    const pdfBuffer = await generateCertificatePdf(
      name,
      process.env.SLIDES_TEMPLATE_ID!,
    );

    reply
      .header("Content-Type", "application/pdf")
      .header(
        "Content-Disposition",
        `attachment; filename="certificate-${name}.pdf"`,
      )
      .send(pdfBuffer);
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: String(err) });
  }
});

fastify.get("/generate-all", async (request, reply) => {
  try {
    const names = await getNames(process.env.SHEET_ID!);

    reply
      .header("Content-Type", "application/zip")
      .header("Content-Disposition", `attachment; filename="certificates.zip"`);

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const stream = new PassThrough();

    archive.pipe(stream);
    stream.pipe(reply.raw);

    for (const name of names) {
      const pdfBuffer = await generateCertificatePdf(
        name,
        process.env.SLIDES_TEMPLATE_ID!,
      );

      archive.append(pdfBuffer, {
        name: `certificate-${name}.pdf`,
      });
    }

    await archive.finalize();
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: String(err) });
  }
});

const start = async () => {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
