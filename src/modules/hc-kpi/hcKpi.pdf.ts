import type { FastifyInstance } from "fastify";
import PDFDocument from "pdfkit";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import * as repo from "./hcKpi.repository";

// ── Color palette ──────────────────────────────────────────────────────────
const COLORS = {
  primary: "#0E7490",
  primaryLight: "#CFFAFE",
  green: "#16A34A",
  greenLight: "#DCFCE7",
  yellow: "#CA8A04",
  yellowLight: "#FEF9C3",
  red: "#DC2626",
  redLight: "#FEE2E2",
  grey: "#6B7280",
  greyLight: "#F3F4F6",
  dark: "#111827",
  muted: "#6B7280",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  cardBg: "#FFFFFF",
  border: "#E2E8F0",
  saudization: "#16A34A",
  retention: "#2563EB",
  training: "#7C3AED",
  productivity: "#D97706",
  cost: "#DC2626",
  governance: "#0E7490",
  custom: "#7C3AED",
};

function trafficInfo(tl: string) {
  if (tl === "green") return { color: COLORS.green, bg: COLORS.greenLight, label: "محقق / Achieved" };
  if (tl === "yellow") return { color: COLORS.yellow, bg: COLORS.yellowLight, label: "جيد / Good" };
  if (tl === "red") return { color: COLORS.red, bg: COLORS.redLight, label: "يحتاج تدخل / Needs Action" };
  return { color: COLORS.grey, bg: COLORS.greyLight, label: "لم يُعبأ / Not Filled" };
}

function catColor(key: string): string {
  return (COLORS as Record<string, string>)[key] ?? COLORS.primary;
}

function drawRoundedRect(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, r: number, fillColor: string, strokeColor?: string) {
  doc.roundedRect(x, y, w, h, r);
  if (strokeColor) {
    doc.fillAndStroke(fillColor, strokeColor);
  } else {
    doc.fill(fillColor);
  }
}

function drawProgressBar(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, pct: number, color: string) {
  drawRoundedRect(doc, x, y, w, h, h / 2, COLORS.greyLight);
  const fillW = Math.min(w * (pct / 100), w);
  if (fillW > 0) {
    drawRoundedRect(doc, x, y, fillW, h, h / 2, color);
  }
}

function trField(translations: Record<string, Record<string, string>>, lang: string, field: string, fallback = ""): string {
  return translations[lang]?.[field] ?? fallback;
}

export function registerHcKpiPdfRoute(app: FastifyInstance) {
  app.get("/api/hc-kpi-pdf/:reportId", async (req, reply) => {
    const reportId = parseInt((req.params as { reportId: string }).reportId);
    if (isNaN(reportId)) {
      throw BadRequestError("Invalid report ID");
    }

    const report = await repo.getReportById(reportId);
    if (!report) {
      throw NotFoundError("Report not found");
    }

    const org = await repo.getOrganization(report.organizationId);
    const entries = await repo.listEntries(reportId);
    const HC_CATEGORIES = await repo.listKpiCategoriesForPdf();

    // Fetch translations
    const reportTr = await repo.getTranslations("hc_report", report.id);
    const orgTr = org ? await repo.getTranslations("hc_organization", org.id) : {};

    // Fetch entry translations in batch
    const entryIds = entries.map(e => e.id);
    const entryTrMap: Record<number, Record<string, Record<string, string>>> = {};
    for (const id of entryIds) {
      entryTrMap[id] = await repo.getTranslations("hc_kpi_entry", id);
    }

    // ── Generate PDF ──
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: trField(reportTr, "ar", "title", "Report"),
        Author: "مواكبة - Muwakaba",
      },
    });

    const PW = 595.28;
    const PH = 841.89;
    const MARGIN = 30;
    const CONTENT_W = PW - MARGIN * 2;

    // ════════════════════════════════════════
    // PAGE 1 — Cover & Summary
    // ════════════════════════════════════════

    doc.rect(0, 0, PW, PH).fill(COLORS.bg);

    doc.rect(0, 0, PW, 140).fill(COLORS.primary);

    doc.font("Helvetica-Bold").fontSize(18).fillColor(COLORS.white)
      .text(trField(reportTr, "en", "title", "Human Capital KPI Report"), MARGIN, 25, { width: CONTENT_W, align: "left" });

    doc.font("Helvetica").fontSize(14).fillColor("rgba(255,255,255,0.85)")
      .text(trField(reportTr, "ar", "title"), MARGIN, 52, { width: CONTENT_W, align: "right" });

    const orgNameEn = trField(orgTr, "en", "name");
    const orgNameAr = trField(orgTr, "ar", "name");
    const orgName = org ? `${orgNameEn} | ${orgNameAr}` : "";
    doc.font("Helvetica").fontSize(10).fillColor("rgba(255,255,255,0.75)")
      .text(orgName, MARGIN, 82, { width: CONTENT_W, align: "center" });

    doc.font("Helvetica").fontSize(9).fillColor("rgba(255,255,255,0.65)")
      .text(`${report.periodLabel}  |  ${report.periodStart} → ${report.periodEnd}  |  ${report.periodType === "quarterly" ? "Quarterly / ربعي" : "Monthly / شهري"}`, MARGIN, 100, { width: CONTENT_W, align: "center" });

    doc.font("Helvetica").fontSize(8).fillColor("rgba(255,255,255,0.5)")
      .text(`Generated: ${new Date().toLocaleDateString("en-SA")}`, MARGIN, 118, { width: CONTENT_W, align: "center" });

    const total = entries.length;
    const green = entries.filter(e => e.trafficLight === "green").length;
    const yellow = entries.filter(e => e.trafficLight === "yellow").length;
    const red = entries.filter(e => e.trafficLight === "red").length;
    const grey = entries.filter(e => e.trafficLight === "grey").length;
    const filledEntries = entries.filter(e => e.performanceScore);
    const avgScore = filledEntries.length
      ? filledEntries.reduce((a, b) => a + Number(b.performanceScore ?? 0), 0) / filledEntries.length
      : 0;

    const statCards = [
      { label: "Total KPIs\nإجمالي المؤشرات", value: total.toString(), color: COLORS.primary },
      { label: "Achieved\nمحقق", value: green.toString(), color: COLORS.green },
      { label: "Good\nجيد", value: yellow.toString(), color: COLORS.yellow },
      { label: "Needs Action\nيحتاج تدخل", value: red.toString(), color: COLORS.red },
      { label: "Avg Score\nمتوسط الأداء", value: `${Math.round(avgScore)}%`, color: COLORS.primary },
    ];

    const cardW = (CONTENT_W - 16) / 5;
    const cardY = 155;
    statCards.forEach((sc, i) => {
      const cx = MARGIN + i * (cardW + 4);
      drawRoundedRect(doc, cx, cardY, cardW, 60, 6, COLORS.cardBg, COLORS.border);
      doc.rect(cx, cardY, cardW, 4).fill(sc.color);
      doc.font("Helvetica-Bold").fontSize(20).fillColor(sc.color)
        .text(sc.value, cx, cardY + 12, { width: cardW, align: "center" });
      doc.font("Helvetica").fontSize(7).fillColor(COLORS.muted)
        .text(sc.label, cx, cardY + 36, { width: cardW, align: "center" });
    });

    const barY = 230;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.dark)
      .text("Overall Performance Score / مستوى الأداء العام", MARGIN, barY);
    drawProgressBar(doc, MARGIN, barY + 14, CONTENT_W, 12, avgScore, avgScore >= 75 ? COLORS.green : avgScore >= 50 ? COLORS.yellow : COLORS.red);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(avgScore >= 75 ? COLORS.green : avgScore >= 50 ? COLORS.yellow : COLORS.red)
      .text(`${Math.round(avgScore)}%`, MARGIN + CONTENT_W - 30, barY + 11);

    const catY = 270;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.dark)
      .text("Performance by Category / الأداء حسب المحور", MARGIN, catY);

    let cy = catY + 16;
    HC_CATEGORIES.forEach(cat => {
      const catEntries = entries.filter(e => e.category === cat.key);
      if (!catEntries.length) return;
      const catFilled = catEntries.filter(e => e.performanceScore);
      const catAvg = catFilled.length
        ? catFilled.reduce((a, b) => a + Number(b.performanceScore ?? 0), 0) / catFilled.length
        : 0;
      const cc = catColor(cat.key);

      doc.font("Helvetica-Bold").fontSize(8).fillColor(cc)
        .text(`${cat.en} / ${cat.ar}`, MARGIN, cy, { width: 180 });
      drawProgressBar(doc, MARGIN + 185, cy, CONTENT_W - 220, 8, catAvg, cc);
      doc.font("Helvetica-Bold").fontSize(8).fillColor(cc)
        .text(`${Math.round(catAvg)}%`, MARGIN + CONTENT_W - 28, cy - 1);

      cy += 18;
    });

    const legendY = cy + 10;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.dark)
      .text("Status Legend / مفتاح الحالة", MARGIN, legendY);
    const legends = [
      { color: COLORS.green, label: "Achieved / محقق (≥100%)" },
      { color: COLORS.yellow, label: "Good / جيد (75–99%)" },
      { color: COLORS.red, label: "Needs Action / يحتاج تدخل (<75%)" },
      { color: COLORS.grey, label: "Not Filled / لم يُعبأ" },
    ];
    legends.forEach((lg, i) => {
      const lx = MARGIN + i * 140;
      doc.circle(lx + 5, legendY + 20, 4).fill(lg.color);
      doc.font("Helvetica").fontSize(7).fillColor(COLORS.dark)
        .text(lg.label, lx + 13, legendY + 14, { width: 130 });
    });

    // ════════════════════════════════════════
    // PAGES 2+ — KPI Detail Cards
    // ════════════════════════════════════════

    const grouped = HC_CATEGORIES.map(cat => ({
      ...cat,
      entries: entries.filter(e => e.category === cat.key),
    })).filter(g => g.entries.length > 0);

    const customEntries = entries.filter(e => !HC_CATEGORIES.find(c => c.key === e.category));
    if (customEntries.length) {
      grouped.push({ key: "custom", ar: "مؤشرات مخصصة", en: "Custom Indicators", color: COLORS.custom, entries: customEntries });
    }

    for (const group of grouped) {
      doc.addPage();
      doc.rect(0, 0, PW, PH).fill(COLORS.bg);

      doc.rect(0, 0, PW, 50).fill(catColor(group.key));
      doc.font("Helvetica-Bold").fontSize(16).fillColor(COLORS.white)
        .text(group.en, MARGIN, 10, { width: CONTENT_W, align: "left" });
      doc.font("Helvetica").fontSize(12).fillColor("rgba(255,255,255,0.8)")
        .text(group.ar, MARGIN, 30, { width: CONTENT_W, align: "right" });

      let ey = 65;
      const CARD_H = 110;
      const CARD_GAP = 8;

      for (const entry of group.entries) {
        if (ey + CARD_H > PH - 30) {
          doc.addPage();
          doc.rect(0, 0, PW, PH).fill(COLORS.bg);
          doc.rect(0, 0, PW, 30).fill(catColor(group.key));
          doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.white)
            .text(`${group.en} (cont.)`, MARGIN, 10, { width: CONTENT_W });
          ey = 40;
        }

        const tc = trafficInfo(entry.trafficLight ?? "grey");
        const score = entry.performanceScore ? Math.round(Number(entry.performanceScore)) : null;
        const currentVal = entry.currentValue ? `${entry.currentValue} ${entry.unit ?? ""}` : entry.currentValueText ?? "—";
        const targetVal = entry.targetValue ? `${entry.targetValue} ${entry.unit ?? ""}` : "—";

        const entryTr = entryTrMap[entry.id] ?? {};
        const entryNameEn = trField(entryTr, "en", "name");
        const entryNameAr = trField(entryTr, "ar", "name", entry.indicatorKey);

        drawRoundedRect(doc, MARGIN, ey, CONTENT_W, CARD_H, 6, COLORS.cardBg, COLORS.border);

        doc.rect(MARGIN, ey, 4, CARD_H).fill(catColor(group.key));

        doc.circle(MARGIN + 22, ey + 18, 8).fill(tc.color);

        doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.dark)
          .text(entryNameEn || entryNameAr, MARGIN + 36, ey + 8, { width: CONTENT_W - 120 });

        doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted)
          .text(entryNameAr, MARGIN + 36, ey + 23, { width: CONTENT_W - 120 });

        drawRoundedRect(doc, MARGIN + CONTENT_W - 90, ey + 8, 82, 18, 4, tc.bg);
        doc.font("Helvetica-Bold").fontSize(7).fillColor(tc.color)
          .text(tc.label, MARGIN + CONTENT_W - 90, ey + 13, { width: 82, align: "center" });

        if (score !== null) {
          doc.font("Helvetica-Bold").fontSize(18).fillColor(tc.color)
            .text(`${score}%`, MARGIN + CONTENT_W - 90, ey + 30, { width: 82, align: "center" });
        }

        const gridY = ey + 44;
        const colW = (CONTENT_W - 12) / 4;
        const gridItems = [
          { label: "Current / الحالي", value: currentVal },
          { label: "Target / الهدف", value: targetVal },
          { label: "Target Date / تاريخ الهدف", value: entry.targetDate || "—" },
          { label: "Benchmark / المعيار", value: entry.benchmark ? entry.benchmark.substring(0, 35) + (entry.benchmark.length > 35 ? "..." : "") : "—" },
        ];

        gridItems.forEach((gi, i) => {
          const gx = MARGIN + 4 + i * (colW + 4);
          drawRoundedRect(doc, gx, gridY, colW, 32, 4, COLORS.bg);
          doc.font("Helvetica").fontSize(6.5).fillColor(COLORS.muted)
            .text(gi.label, gx + 4, gridY + 3, { width: colW - 8 });
          doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.dark)
            .text(gi.value, gx + 4, gridY + 14, { width: colW - 8, ellipsis: true });
        });

        if (entry.initiative) {
          const initY = gridY + 38;
          doc.font("Helvetica").fontSize(7).fillColor(COLORS.muted)
            .text("Initiative / المبادرة:", MARGIN + 8, initY);
          doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.dark)
            .text(entry.initiative.substring(0, 100) + (entry.initiative.length > 100 ? "..." : ""), MARGIN + 8, initY + 10, { width: CONTENT_W - 16 });
        }

        if (score !== null) {
          const pbY = ey + CARD_H - 10;
          drawProgressBar(doc, MARGIN + 4, pbY, CONTENT_W - 8, 5, score, tc.color);
        }

        ey += CARD_H + CARD_GAP;
      }
    }

    // ════════════════════════════════════════
    // LAST PAGE — Footer / Branding
    // ════════════════════════════════════════
    doc.addPage();
    doc.rect(0, 0, PW, PH).fill(COLORS.primary);

    doc.font("Helvetica-Bold").fontSize(24).fillColor(COLORS.white)
      .text("مواكبة للموارد البشرية", 0, PH / 2 - 60, { width: PW, align: "center" });
    doc.font("Helvetica").fontSize(14).fillColor("rgba(255,255,255,0.8)")
      .text("Muwakaba Human Resources Platform", 0, PH / 2 - 30, { width: PW, align: "center" });
    doc.font("Helvetica").fontSize(10).fillColor("rgba(255,255,255,0.6)")
      .text("Human Capital Effectiveness KPI Report", 0, PH / 2, { width: PW, align: "center" });
    doc.font("Helvetica").fontSize(9).fillColor("rgba(255,255,255,0.5)")
      .text(`Report: ${trField(reportTr, "ar", "title")}  |  ${report.periodLabel}`, 0, PH / 2 + 25, { width: PW, align: "center" });
    doc.font("Helvetica").fontSize(8).fillColor("rgba(255,255,255,0.4)")
      .text(`Generated on ${new Date().toLocaleDateString("en-SA")} | Confidential`, 0, PH / 2 + 45, { width: PW, align: "center" });

    doc.end();

    const chunks: Buffer[] = [];
    for await (const chunk of doc) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    reply.type("application/pdf");
    reply.header("Content-Disposition", `attachment; filename="hc-kpi-report-${reportId}.pdf"`);
    return reply.send(pdfBuffer);
  });
}
