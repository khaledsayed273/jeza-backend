import type { FastifyInstance } from "fastify";
import { randomBytes } from "node:crypto";
import { unlink, stat } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { requireAdmin } from "../../plugins/guard";
import { NotFoundError, BadRequestError } from "../../shared/errors";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".xlsm",
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".txt", ".csv",
]);

function safeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase();
  const base = path.basename(original, ext)
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, "_")
    .slice(0, 80);
  const hash = randomBytes(4).toString("hex");
  return `${base}_${hash}${ext}`;
}

export function registerUploadRoutes(app: FastifyInstance) {
  app.post("/api/uploads", { preHandler: requireAdmin }, async (req, reply) => {
    const file = await req.file();
    if (!file) throw BadRequestError("لم يتم إرفاق ملف");

    const ext = path.extname(file.filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw BadRequestError(`نوع الملف غير مدعوم: ${ext}`);
    }

    const filename = safeFilename(file.filename);
    const dest = path.join(UPLOADS_DIR, filename);

    await pipeline(file.file, createWriteStream(dest));

    return reply.status(201).send({
      url: `/uploads/${filename}`,
      name: file.filename,
      ext,
    });
  });

  app.delete("/api/uploads/:filename", { preHandler: requireAdmin }, async (req, reply) => {
    const { filename } = req.params as { filename: string };

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      throw BadRequestError("اسم الملف غير صالح");
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    try {
      await stat(filePath);
    } catch {
      throw NotFoundError("الملف غير موجود");
    }

    await unlink(filePath);
    return reply.status(200).send({ ok: true });
  });
}
