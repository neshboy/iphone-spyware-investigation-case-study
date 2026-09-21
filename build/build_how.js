const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const { iconBadge } = require("./icons");

const ROOT = "C:/Users/User/projects/iphone-spyware-investigation-case-study";
const MD_PATH = path.join(ROOT, "HOW_WE_DID_THIS.md");
const OUT_HTML = path.join(ROOT, "build", "out", "HOW_WE_DID_THIS.html");
const FIGURE_PATH = path.join(ROOT, "build", "figures", "fig4-mvt-terminal.png").replace(/\\/g, "/");

marked.setOptions({ mangle: false, headerIds: true, gfm: true });

function section(md, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`## ${escaped}\\n([\\s\\S]*?)(?=\\n## |$)`);
  const m = md.match(re);
  if (!m) throw new Error(`section not found: ${heading}`);
  return m[1].trim();
}

const SHORT_VERSION = [
  { icon: "target", bg: "#e3ddf7", color: "#4a3aa7", title: "Goal", text: "Independently re-verify the original \u201cno spyware found\u201d conclusion against a brand-new backup of the same iPhone." },
  { icon: "shieldCheck", bg: "#bdeedb", color: "#0d6b49", title: "Result", text: "Same conclusion. Zero genuine spyware/stalkerware indicator matches across 11,481 real indicators \u2014 confirmed by inspecting the raw result data, not just a summary line." },
  { icon: "camera", bg: "#cde2fb", color: "#164a8a", title: "Evidence", text: "A real, unedited screenshot of the actual terminal output, embedded in the updated case study." },
  { icon: "clock", bg: "#f9d9c4", color: "#93401d", title: "Time", text: "A little over an hour \u2014 most of it just waiting for ~120GB to transfer over USB." },
  { icon: "warning", bg: "#fce8bf", color: "#8a6200", title: "Detours", text: "Two \u2014 a disk-space near-miss and a wrong password \u2014 both real, both fixed live." },
];

const TOOLS = [
  { icon: "phone", bg: "#cde2fb", color: "#164a8a", title: "iTunes (Windows)", text: "Created the real encrypted local backup by talking to the connected iPhone directly." },
  { icon: "link", bg: "#bdeedb", color: "#0d6b49", title: "Apple Mobile Device Service", text: "The Windows background service that lets a PC recognize and talk to an iPhone over USB." },
  { icon: "search", bg: "#e3ddf7", color: "#4a3aa7", title: "MVT \u2014 Mobile Verification Toolkit 2026.9.7", text: "Amnesty International\u2019s open-source iOS forensics toolkit. Decrypted the backup, extracted every artifact, ran the IOC comparison." },
  { icon: "shieldCheck", bg: "#cde2fb", color: "#164a8a", title: "19 STIX2 indicator collections", text: "The real \u201cknown spyware fingerprint\u201d lists MVT compared the phone\u2019s data against." },
  { icon: "terminal", bg: "#f9d9c4", color: "#93401d", title: "PowerShell + .NET", text: "Diagnosed the disk-space problem, created the NTFS junction that redirected the backup, captured the real screenshot." },
  { icon: "terminal", bg: "#bdeedb", color: "#0d6b49", title: "Python (plistlib)", text: "Read Apple\u2019s .plist metadata files directly to check backup status, encryption, and real device details." },
  { icon: "doc", bg: "#e3ddf7", color: "#4a3aa7", title: "Node.js + marked + headless Chrome", text: "Converted the Markdown report into this styled PDF." },
];

const DROPPED = [
  { icon: "cross", title: "pywinauto (GUI automation)", text: "Tried to click \u201cBack Up Now\u201d in iTunes automatically. iTunes turned out to have zero real menu items behind its custom-drawn interface \u2014 confirmed directly. We asked for two manual clicks instead; took ten seconds." },
  { icon: "cross", title: "pymobiledevice3", text: "A modern alternative to iTunes for creating backups. Install failed \u2014 needed a C++ compiler this machine doesn\u2019t have. We dropped it rather than fake success with a workaround, and used iTunes instead." },
];

const STEPS = [
  { icon: "search", bg: "#e3ddf7", color: "#4a3aa7", title: "We looked for the backup that supposedly already existed", text: "It didn\u2019t. Checked every real location \u2014 the standard Windows backup folder, a third-party tool\u2019s cache, the Recycle Bin \u2014 and searched both drives for the one file that has to exist if a backup is real. Nothing. Six leftover connection logs from the original session showed the phone connecting only to check battery info, never to actually back up." },
  { icon: "phone", bg: "#cde2fb", color: "#164a8a", title: "We connected the phone and started a real backup", text: "iTunes was already running, the phone was already trusted. We asked for two manual clicks \u2014 enable encryption, \u201cBack Up Now\u201d \u2014 since automating iTunes\u2019 interface was a dead end. The transfer began for real." },
  { icon: "warning", bg: "#fce8bf", color: "#8a6200", title: "About 40GB in, the destination drive started running out of space", text: "The phone had ~127GB of data; the drive doing the backup had ~45GB free and dropping. We cancelled cleanly, redirected the backup to a drive with 448GB free using an NTFS junction \u2014 invisible to iTunes \u2014 and restarted." },
  { icon: "server", bg: "#bdeedb", color: "#0d6b49", title: "The second attempt ran to completion", text: "About 45 minutes, ~121GB, ending with Manifest.plist \u2014 the file that only appears once a backup is genuinely finished \u2014 confirming IsEncrypted: True and 48,979 files." },
  { icon: "lock", bg: "#e3ddf7", color: "#4a3aa7", title: "The first password didn\u2019t work. The second one did", text: "We ran MVT\u2019s actual decryption against the real encrypted backup rather than taking a password at face value. The first attempt failed outright \u2014 a real cryptographic key-unwrap failure. The corrected password decrypted all 48,979 files." },
  { icon: "terminal", bg: "#cde2fb", color: "#164a8a", title: "We installed MVT and ran the real analysis", text: "Fresh install, fresh download of the same 19 real indicator collections. check-backup extracted every artifact; check-iocs compared all of it against 11,481 real indicators." },
  { icon: "shieldCheck", bg: "#bdeedb", color: "#0d6b49", title: "MVT reported \u201c1 detection\u201d \u2014 we checked what that actually meant", text: "Trusting a summary line is exactly the mistake a real report can\u2019t make. The flagged item had \"matched_indicator\": null \u2014 the same benign Lockdown-Mode-disabled note as before, not a spyware match." },
  { icon: "camera", bg: "#f9d9c4", color: "#93401d", title: "We captured a real screenshot", text: "Not a mockup, not a labeled reconstruction \u2014 an actual PowerShell window running the actual command, screenshotted directly off the screen." },
  { icon: "doc", bg: "#e3ddf7", color: "#4a3aa7", title: "We updated the case study rather than starting over", text: "Added a dedicated \u201cVerification Re-Run\u201d section, swapped in the real screenshot where a labeled reconstruction used to be, rebuilt the PDF." },
];

function renderCards(items, extraClass = "") {
  return `<div class="card-grid ${extraClass}">` + items.map(it => `
    <div class="card">
      ${iconBadge(it.icon, { size: 52, iconSize: 24, bg: it.bg, color: it.color })}
      <div class="card-body">
        <div class="card-title">${it.title}</div>
        <div class="card-text">${it.text}</div>
      </div>
    </div>`).join("") + `</div>`;
}

function renderDropped(items) {
  return `<div class="dropped-grid">` + items.map(it => `
    <div class="dropped-card">
      ${iconBadge(it.icon, { size: 40, iconSize: 18, bg: "#f0f0f0", color: "#8a8a8a" })}
      <div>
        <div class="card-title" style="color:#6b6b6b;">${it.title}</div>
        <div class="card-text">${it.text}</div>
      </div>
    </div>`).join("") + `</div>`;
}

function renderTimeline(items) {
  return `<div class="timeline">` + items.map((it, i) => `
    <div class="timeline-row">
      <div class="timeline-spine">
        ${iconBadge(it.icon, { size: 48, iconSize: 22, bg: it.bg, color: it.color })}
        ${i < items.length - 1 ? '<div class="timeline-dots"></div>' : ""}
      </div>
      <div class="timeline-content">
        <div class="timeline-step-num">STEP ${i + 1}</div>
        <div class="card-title">${it.title}</div>
        <div class="card-text">${it.text}</div>
      </div>
    </div>`).join("") + `</div>`;
}

function heroIllustration() {
  return `
  <div class="hero">
    <div class="hero-badge-wrap">${iconBadge("shieldCheck", { size: 44, iconSize: 22, bg: "#bdeedb", color: "#0d6b49" })}</div>
    <div class="hero-row">
      ${iconBadge("phone", { size: 84, iconSize: 40, bg: "#cde2fb", color: "#164a8a" })}
      <div class="hero-connector"></div>
      ${iconBadge("link", { size: 60, iconSize: 28, bg: "#e3ddf7", color: "#4a3aa7" })}
      <div class="hero-connector"></div>
      ${iconBadge("server", { size: 84, iconSize: 40, bg: "#f9d9c4", color: "#93401d" })}
    </div>
  </div>`;
}

function main() {
  const md = fs.readFileSync(MD_PATH, "utf-8");
  const whyThisExists = marked.parse(section(md, "Why this exists"));
  const notRedo = marked.parse(section(md, "What this re-run did *not* redo"));
  const lessons = marked.parse(section(md, "The honest lessons"));

  const css = `
  :root {
    --ink:#0b0b0b; --ink2:#52514e; --muted:#898781;
    --blue:#2a78d6; --aqua:#1baf7a; --violet:#4a3aa7; --orange:#eb6834; --yellow:#eda100;
    --tint:#eaf2fc; --gridline:#e1e0d9; --baseline:#c3c2b7;
  }
  @page { size: A4; margin: 18mm 16mm 20mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Calibri, Arial, sans-serif; color: var(--ink); line-height: 1.55; font-size: 10.3pt; }

  .cover { margin-top: 30mm; text-align: center; page-break-after: always; }
  .cover .kicker { font-size: 10.5pt; letter-spacing: 2.2pt; color: var(--muted); text-transform: uppercase; margin-bottom: 10pt; }
  .cover h1 { font-size: 25pt; margin: 16pt 0 8pt; line-height: 1.25; color: var(--ink); }
  .cover h2 { font-size: 12.5pt; font-weight: 400; font-style: italic; color: var(--ink2); margin: 10pt auto 0; max-width: 78%; }
  .cover .meta { margin-top: 30pt; font-size: 9pt; color: var(--muted); }

  .hero { position: relative; padding-top: 20pt; }
  .hero-row { display: flex; align-items: center; justify-content: center; gap: 0; }
  .hero-connector { width: 46pt; height: 0; border-top: 2.5pt dashed var(--gridline); margin: 0 -2pt; }
  .hero-badge-wrap { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 2; }
  .icon-badge { border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2pt 6pt rgba(0,0,0,.08); flex-shrink: 0; }

  h1 { font-size: 17pt; margin-top: 22pt; color: var(--ink); }
  h2.section-h { font-size: 15pt; margin-top: 26pt; color: var(--ink); display: flex; align-items: center; gap: 8pt; border-bottom: 2pt solid var(--aqua); padding-bottom: 6pt; }
  h2 { font-size: 14pt; margin-top: 20pt; border-bottom: 1.5pt solid var(--aqua); padding-bottom: 4pt; color: var(--ink); }
  p { margin: 6pt 0; }
  hr { border: none; border-top: 1pt solid var(--gridline); margin: 16pt 0; }
  code { font-family: Consolas, "Courier New", monospace; font-size: 8.6pt; background: #eef1f5; padding: 0 3pt; border-radius: 2pt; }
  strong { color: var(--ink); }
  em { color: var(--ink2); }

  .card-grid { display: flex; flex-direction: column; gap: 8pt; margin: 10pt 0; }
  .card { display: flex; align-items: flex-start; gap: 10pt; background: #fafbfc; border: 0.5pt solid var(--gridline); border-radius: 8pt; padding: 8pt 10pt; page-break-inside: avoid; }
  .card-title { font-weight: 700; font-size: 10pt; color: var(--ink); margin-bottom: 2pt; }
  .card-text { font-size: 9pt; color: var(--ink2); line-height: 1.45; }

  .dropped-grid { display: flex; flex-direction: column; gap: 6pt; margin: 8pt 0 4pt; }
  .dropped-card { display: flex; align-items: flex-start; gap: 8pt; background: #f5f5f4; border: 0.5pt dashed var(--baseline); border-radius: 8pt; padding: 7pt 9pt; page-break-inside: avoid; }
  .dropped-card .card-text { font-size: 8.6pt; }

  .timeline { display: flex; flex-direction: column; margin-top: 8pt; }
  .timeline-row { display: flex; gap: 12pt; page-break-inside: avoid; }
  .timeline-spine { display: flex; flex-direction: column; align-items: center; }
  .timeline-dots { flex: 1; width: 0; border-left: 2.5pt dotted var(--gridline); margin: 4pt 0; min-height: 14pt; }
  .timeline-content { flex: 1; padding-bottom: 12pt; }
  .timeline-step-num { font-size: 8pt; letter-spacing: 1pt; color: var(--muted); font-weight: 700; margin-bottom: 2pt; }

  figure.report-figure { margin: 14pt 0; text-align: center; page-break-inside: avoid; }
  figure.report-figure img { max-width: 100%; border: 0.5pt solid var(--gridline); border-radius: 4pt; box-shadow: 0 1pt 4pt rgba(0,0,0,.08); }
  figure.report-figure figcaption { font-size: 8pt; color: var(--muted); margin-top: 5pt; font-style: italic; }
  `;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>How We Did This</title>
<style>${css}</style>
</head>
<body>

<section class="cover">
  <div class="kicker">Process Report</div>
  ${heroIllustration()}
  <h1>How We Did This<br/>Redoing the iPhone Spyware Investigation for Real</h1>
  <h2>Tools, process, and what actually happened \u2014 written up as we went, not cleaned up after the fact.</h2>
  <div class="meta">${dateStr}</div>
</section>

<h1>How We Did This</h1>
${whyThisExists}

<h2 class="section-h">${iconBadge("target", { size: 30, iconSize: 15, bg: "#e3ddf7", color: "#4a3aa7" })} The short version</h2>
${renderCards(SHORT_VERSION)}

<h2 class="section-h">${iconBadge("server", { size: 30, iconSize: 15, bg: "#cde2fb", color: "#164a8a" })} Tools and technologies we actually used</h2>
${renderCards(TOOLS)}
<p style="margin-top:10pt;font-size:9pt;color:var(--ink2);"><strong>Two tools we tried and dropped</strong> \u2014 worth mentioning honestly:</p>
${renderDropped(DROPPED)}

<h2 class="section-h">${iconBadge("clock", { size: 30, iconSize: 15, bg: "#f9d9c4", color: "#93401d" })} What actually happened, in order</h2>
${renderTimeline(STEPS)}

<figure class="report-figure">
  <img src="file:///${FIGURE_PATH}" alt="real terminal screenshot"/>
  <figcaption>The actual screenshot referenced throughout this report \u2014 real terminal output from the real re-run, no reconstruction.</figcaption>
</figure>

<h2 class="section-h">${iconBadge("puzzle", { size: 30, iconSize: 15, bg: "#fadce8", color: "#a03060" })} What this re-run did <em>not</em> redo</h2>
${notRedo}

<h2 class="section-h">${iconBadge("lightbulb", { size: 30, iconSize: 15, bg: "#fce8bf", color: "#8a6200" })} The honest lessons</h2>
${lessons}

</body>
</html>`;

  fs.mkdirSync(path.dirname(OUT_HTML), { recursive: true });
  fs.writeFileSync(OUT_HTML, html, "utf-8");
  console.log("Wrote", OUT_HTML, "(", (html.length / 1024).toFixed(1), "KB )");
}

main();
