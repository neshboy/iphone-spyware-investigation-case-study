const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const ROOT = "C:/Users/User/projects/iphone-spyware-investigation-case-study";
const MD_PATH = path.join(ROOT, "CASE_STUDY.md");
const OUT_HTML = path.join(ROOT, "build", "out", "CASE_STUDY.html");
const FIGURES_DIR = path.join(ROOT, "build", "figures");

marked.setOptions({ mangle: false, headerIds: true, gfm: true });

function stripFrontMatter(md) {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

const FIGURE_CAPTIONS = {
  "backup-architecture": "Figure 1 — Evidence-to-Finding Pipeline: what a backup-based investigation actually does, from source device to a bounded finding.",
  "manifest-mapping": "Figure 2 — Manifest.db Resolution Path: how a meaningless hashed backup filename is traced back to a real artifact.",
  "workflow-pipeline": "Figure 3 — Mobile Spyware Investigation Workflow: the nine-stage process this investigation actually followed.",
  "mvt-ioc-terminal": "Figure 4 — MVT / IOC Comparison, real terminal screenshot captured directly during a verification re-run on 2026-09-21 against a freshly created backup of the same device — not a reconstruction.",
  "domain-classification": "Figure 5 — Browser & WebKit Domain Triage: how 2,392 raw URLs were normalized, classified, and cleared against IOC data.",
  "sqlite-analysis": "Figure 6 — SQLite-Level Forensics performed beneath the parser's JSON output, directly against the raw databases.",
  "evidence-matrix": "Figure 7 — Final Evidence Matrix summarizing every investigation area and its outcome.",
};

// For the PDF build, drop the ASCII fenced-code fallback block that sits immediately above
// each FIGURE marker (kept in the .md source for GitHub readers who won't see the PNG figures)
// so it isn't duplicated right above the polished figure image. Line-based, fence-aware —
// a naive regex here can skip past an unrelated closing fence and eat real content in between.
function dropPrecedingFence(md) {
  const lines = md.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const isMarker = /^<!--\s*FIGURE:[a-z0-9-]+\s*-->$/.test(lines[i].trim());
    if (isMarker && out.length >= 2 && out[out.length - 1].trim() === "" && out[out.length - 2].trim() === "```") {
      const closeIdx = out.length - 2;
      let openIdx = -1;
      for (let j = closeIdx - 1; j >= 0; j--) {
        if (/^```/.test(out[j].trim())) {
          openIdx = j;
          break;
        }
      }
      if (openIdx !== -1) {
        out.length = openIdx; // truncate back to just before the opening fence
      }
    }
    out.push(lines[i]);
  }
  return out.join("\n");
}

function injectFigures(md) {
  md = dropPrecedingFence(md);
  return md.replace(/<!--\s*FIGURE:([a-z0-9-]+)\s*-->/g, (m, key) => {
    const imgPath = path.join(FIGURES_DIR, `${key === "backup-architecture" ? "fig1-backup-architecture" : key === "manifest-mapping" ? "fig2-manifest-mapping" : key === "workflow-pipeline" ? "fig3-workflow-pipeline" : key === "mvt-ioc-terminal" ? "fig4-mvt-terminal" : key === "domain-classification" ? "fig5-domain-classification" : key === "sqlite-analysis" ? "fig6-sqlite-analysis" : "fig7-evidence-matrix"}.png`);
    const uri = `file:///${imgPath.replace(/\\/g, "/")}`;
    const caption = FIGURE_CAPTIONS[key] || "";
    return `<figure class="report-figure"><img src="${uri}" alt="${key}"/><figcaption>${caption}</figcaption></figure>`;
  });
}

function main() {
  let md = stripFrontMatter(fs.readFileSync(MD_PATH, "utf-8"));
  md = injectFigures(md);
  const html = marked.parse(md);

  const css = `
  :root {
    --ink:#0b0b0b; --ink2:#52514e; --muted:#898781;
    --blue:#2a78d6; --aqua:#1baf7a; --violet:#4a3aa7; --orange:#eb6834; --yellow:#eda100; --red:#e34948;
    --tint:#eaf2fc; --gridline:#e1e0d9; --baseline:#c3c2b7;
  }
  @page { size: A4; margin: 20mm 18mm 22mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Calibri, Arial, sans-serif; color: var(--ink); line-height: 1.55; font-size: 10.3pt; }
  .cover { margin-top: 60mm; text-align: center; page-break-after: always; }
  .cover .kicker { font-size: 10.5pt; letter-spacing: 2.2pt; color: var(--muted); text-transform: uppercase; margin-bottom: 10pt; }
  .cover h1 { font-size: 25pt; margin: 0 0 8pt; line-height: 1.25; color: var(--ink); }
  .cover .accent-rule { width: 130pt; height: 3pt; background: linear-gradient(90deg, var(--blue), var(--aqua), var(--violet)); margin: 14pt auto 16pt auto; border-radius: 2pt; }
  .cover h2 { font-size: 12.5pt; font-weight: 400; color: var(--ink2); margin: 0 auto; max-width: 76%; }
  .cover .meta { margin-top: 46pt; font-size: 9pt; color: var(--muted); }
  h1 { font-size: 17pt; margin-top: 22pt; color: var(--ink); }
  h2 { font-size: 14pt; margin-top: 20pt; border-bottom: 1.5pt solid var(--blue); padding-bottom: 4pt; color: var(--ink); page-break-before: auto; }
  h3 { font-size: 11.5pt; margin-top: 14pt; color: var(--blue); }
  h4 { font-size: 10.3pt; margin-top: 10pt; color: var(--ink2); }
  p { margin: 6pt 0; }
  ul, ol { margin: 6pt 0; padding-left: 18pt; }
  li { margin: 2pt 0; }
  hr { border: none; border-top: 1pt solid var(--gridline); margin: 14pt 0; }
  a { color: var(--blue); text-decoration: none; }
  code { font-family: Consolas, "Courier New", monospace; font-size: 8.6pt; background: #eef1f5; padding: 0 3pt; border-radius: 2pt; }
  pre { background: #f4f4f4; border: 0.5pt solid var(--baseline); border-left: 3pt solid var(--violet); padding: 8pt 10pt; font-size: 8.3pt; overflow-wrap: break-word; white-space: pre-wrap; page-break-inside: avoid; border-radius: 3pt; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; font-size: 8.6pt; margin: 8pt 0; page-break-inside: avoid; }
  th, td { border: 0.5pt solid var(--baseline); padding: 4pt 6pt; text-align: left; vertical-align: top; }
  th { background: var(--tint); color: var(--ink); border-bottom: 1.5pt solid var(--blue); }
  blockquote { border-left: 3pt solid var(--yellow); margin: 8pt 0; padding: 6pt 10pt; color: var(--ink2); font-style: italic; background: #fdf6e6; border-radius: 0 3pt 3pt 0; page-break-inside: avoid; }
  strong { color: var(--ink); }
  figure.report-figure { margin: 14pt 0; text-align: center; page-break-inside: avoid; }
  figure.report-figure img { max-width: 100%; border: 0.5pt solid var(--gridline); border-radius: 4pt; box-shadow: 0 1pt 4pt rgba(0,0,0,.08); }
  figure.report-figure figcaption { font-size: 8pt; color: var(--muted); margin-top: 5pt; font-style: italic; max-width: 90%; margin-left: auto; margin-right: auto; }
  `;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Inside an iPhone Spyware Investigation</title>
<style>${css}</style>
</head>
<body>
<section class="cover">
  <div class="kicker">Personal Cybersecurity Case Study</div>
  <h1>Inside an iPhone Spyware Investigation<br/>How I Forensically Examined an iOS Backup<br/>for Signs of Compromise</h1>
  <div class="accent-rule"></div>
  <h2>A practical forensic walkthrough of how an iPhone backup can be examined for indicators of spyware, stalkerware, persistence, suspicious network activity, and compromise.</h2>
  <div class="meta">Report date: ${dateStr}</div>
</section>
${html}
</body>
</html>`;

  fs.mkdirSync(path.dirname(OUT_HTML), { recursive: true });
  fs.writeFileSync(OUT_HTML, fullHtml, "utf-8");
  console.log("Wrote", OUT_HTML, "(", (fullHtml.length / 1024).toFixed(1), "KB )");
}

main();
