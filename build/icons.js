// Small hand-drawn line-icon set, Feather/Lucide-ish stroke style, no external assets.
// Each icon is a raw <svg> inner-path string; wrap with iconBadge() for a colored circle badge.

const ICONS = {
  phone: `<rect x="8" y="2" width="16" height="28" rx="3.5"/><line x1="8" y1="6" x2="24" y2="6"/><line x1="8" y1="24" x2="24" y2="24"/><circle cx="16" cy="27" r="0.8" fill="currentColor" stroke="none"/><line x1="13" y1="4" x2="19" y2="4"/>`,
  server: `<rect x="4" y="4" width="24" height="9" rx="2"/><rect x="4" y="17" width="24" height="9" rx="2"/><circle cx="9" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="8.5" r="1" fill="currentColor" stroke="none"/><line x1="18" y1="8.5" x2="24" y2="8.5"/><circle cx="9" cy="21.5" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="21.5" r="1" fill="currentColor" stroke="none"/><line x1="18" y1="21.5" x2="24" y2="21.5"/>`,
  link: `<path d="M13 19 C 9 19, 6 16, 6 12 C 6 8, 9 5, 13 5 L 16 5" stroke-linecap="round"/><path d="M19 13 C 23 13, 26 16, 26 20 C 26 24, 23 27, 19 27 L 16 27" stroke-linecap="round"/><circle cx="13" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="20" r="1" fill="currentColor" stroke="none"/>`,
  lock: `<rect x="7" y="14" width="18" height="14" rx="2.5"/><path d="M11 14 V 10 a 5 5 0 0 1 10 0 v 4"/><circle cx="16" cy="20" r="1.6" fill="currentColor" stroke="none"/><line x1="16" y1="21.5" x2="16" y2="24"/>`,
  search: `<circle cx="14" cy="14" r="9"/><line x1="20.5" y1="20.5" x2="27" y2="27" stroke-linecap="round"/>`,
  shieldCheck: `<path d="M16 3 L27 7 V15 C27 23 22 27 16 29 C10 27 5 23 5 15 V7 Z"/><path d="M11 16 L15 20 L22 12" stroke-linecap="round" stroke-linejoin="round"/>`,
  warning: `<path d="M16 5 L29 27 H3 Z" stroke-linejoin="round"/><line x1="16" y1="13" x2="16" y2="19" stroke-linecap="round"/><circle cx="16" cy="23" r="1" fill="currentColor" stroke="none"/>`,
  camera: `<rect x="3" y="10" width="26" height="17" rx="2.5"/><path d="M11 10 L13 6 H19 L21 10"/><circle cx="16" cy="18.5" r="5.5"/><circle cx="24" cy="14" r="0.9" fill="currentColor" stroke="none"/>`,
  terminal: `<rect x="3" y="5" width="26" height="22" rx="2.5"/><path d="M9 13 L14 17 L9 21" stroke-linecap="round" stroke-linejoin="round"/><line x1="17" y1="21" x2="23" y2="21" stroke-linecap="round"/>`,
  clock: `<circle cx="16" cy="16" r="12.5"/><line x1="16" y1="16" x2="16" y2="9" stroke-linecap="round"/><line x1="16" y1="16" x2="21" y2="19" stroke-linecap="round"/>`,
  target: `<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="7"/><circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none"/>`,
  lightbulb: `<path d="M16 4 a8 8 0 0 1 5 14.3 c-1 .8 -1.6 2 -1.6 3.2 v1 h-6.8 v-1 c0-1.2-.6-2.4-1.6-3.2 A8 8 0 0 1 16 4 Z"/><line x1="12.5" y1="26" x2="19.5" y2="26" stroke-linecap="round"/><line x1="13.3" y1="29" x2="18.7" y2="29" stroke-linecap="round"/>`,
  cross: `<circle cx="16" cy="16" r="12.5"/><line x1="11.5" y1="11.5" x2="20.5" y2="20.5" stroke-linecap="round"/><line x1="20.5" y1="11.5" x2="11.5" y2="20.5" stroke-linecap="round"/>`,
  doc: `<path d="M9 4 H19 L23 8 V27 H9 Z" stroke-linejoin="round"/><path d="M19 4 V8 H23"/><line x1="12" y1="14" x2="20" y2="14"/><line x1="12" y1="18" x2="20" y2="18"/><line x1="12" y1="22" x2="17" y2="22"/>`,
  puzzle: `<path d="M12 5 h6 v3.2 a2.2 2.2 0 1 0 0 4.4 V16 H23 a2.2 2.2 0 1 1 0 4.4 V24 h-6 a2.2 2.2 0 1 0 -4.4 0 H9 V18 a2.2 2.2 0 1 1 0 -4.4 V9 h3 Z" stroke-linejoin="round"/>`,
};

function icon(name, size = 20, color = "currentColor") {
  const inner = ICONS[name] || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="${color}" stroke-width="1.8">${inner}</svg>`;
}

function iconBadge(name, { size = 56, iconSize = 26, bg = "#eaf2fc", color = "#2a78d6" } = {}) {
  return `<div class="icon-badge" style="width:${size}px;height:${size}px;background:${bg};color:${color};">${icon(name, iconSize, color)}</div>`;
}

module.exports = { icon, iconBadge, ICONS };
