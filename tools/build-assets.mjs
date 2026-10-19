// Builds the SVGs of the profile README into ../assets. The SVGs carry their own fonts (a subset of each, as a data URI) and their own
// images, because GitHub shows an SVG inside <img>, where nothing can be loaded from outside.
//   npm install && npm run build
import subsetFont from "subset-font";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname;
const src = (name) => readFileSync(join(here, "src", name));
const out = join(here, "..", "assets");
mkdirSync(out, { recursive: true });

const PAPER = "#ecebe4";
const INK = "#0d0d0d";
const ACCENT = "#ff4b1f";

const font = async (file, text, family, weight = "100 900", stretch) => {
  const bytes = await subsetFont(src(file), text, { targetFormat: "woff2" });
  const stretchRule = stretch ? `font-stretch: ${stretch};` : "";
  return `@font-face { font-family: '${family}'; font-weight: ${weight}; ${stretchRule} src: url(data:font/woff2;base64,${bytes.toString("base64")}) format('woff2'); }`;
};
const image = (file) => `data:image/webp;base64,${src(file).toString("base64")}`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const svg = (w, h, title, desc, style, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">\n<title id="t">${esc(title)}</title>\n<desc id="d">${esc(desc)}</desc>\n<style>\n${style}\n@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }\n</style>\n${body}\n</svg>\n`;

const ascii = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]_abcdefghijklmnopqrstuvwxyz{}|~·→↓—–×";

// ── header ───────────────────────────────────────────────────────────────────────────────
{
  const archivo = await font("archivo-latin.woff2", "HENRYQUEL", "Archivo", "900", "62% 125%");
  const mono = await font("jetbrains-mono-latin.woff2", ascii, "JB", "500");
  const style = `${archivo}
${mono}
.mono { font: 500 15px/1 JB, ui-monospace, monospace; letter-spacing: 0.08em; fill: ${INK}; text-transform: uppercase; }
.name { font-family: Archivo, Arial Black, sans-serif; font-weight: 900; font-size: 250px; letter-spacing: -0.035em; fill: ${INK}; font-stretch: 62%; font-variation-settings: "wdth" 62; animation: widen 7s cubic-bezier(.65,0,.35,1) infinite alternate; }
.disc { transform-box: fill-box; transform-origin: center; animation: grow 7s cubic-bezier(.65,0,.35,1) infinite alternate; }
.fig { transform-box: fill-box; transform-origin: center; animation: jump 7s ease-in-out infinite alternate; }
@keyframes widen { to { font-stretch: 108%; font-variation-settings: "wdth" 108; } }
@keyframes grow { from { transform: scale(0.62); } to { transform: scale(1); } }
@keyframes jump { 0% { transform: translateY(6px) rotate(-3deg); } 50% { transform: translateY(-22px) rotate(0deg); } 100% { transform: translateY(2px) rotate(3deg); } }`;
  const body = `<rect width="1200" height="640" fill="${PAPER}"/>
<circle class="disc" cx="905" cy="330" r="215" fill="${ACCENT}"/>
<image class="fig" href="${image("Jumping.webp")}" x="650" y="62" width="511" height="520"/>
<text class="name" x="30" y="330">HENRY</text>
<text class="name" x="30" y="535">QUEL</text>
<text class="mono" x="36" y="46">Full-stack</text><text class="mono" x="36" y="68">developer</text>
<text class="mono" x="1164" y="46" text-anchor="end">Guatemala City</text><text class="mono" x="1164" y="68" text-anchor="end">Open to remote</text>
<text class="mono" x="36" y="612">github.com/HenryD11703</text><text class="mono" x="1164" y="612" text-anchor="end">2026</text>`;
  writeFileSync(join(out, "header.svg"), svg(1200, 640, "Henry Quel, full-stack developer", "Henry Quel, full-stack developer in Guatemala City, open to remote work. An illustration of a person jumping in front of an orange disc.", style, body));
}

// ── the program: `const henry = {…}` runs line by line ──────────────────────────────────────
{
  const k = (t) => ["k", t], s = (t) => ["s", t], c = (t) => ["c", t], p = (t) => ["p", t];
  const lines = [
    { parts: [k("const"), p(" henry = {")] },
    { parts: [p("  role:   "), s('"Full-stack developer"'), p(",")], res: "→ ok" },
    { parts: [p("  based:  "), s('"Guatemala City · remote"'), p(",")], res: "→ ok" },
    { parts: [p("  stack:  ["), s('"TypeScript"'), p(", "), s('"React"'), p(", "), s('".NET"'), p(", "), s('"WebAssembly"'), p("],")], res: "→ 4 items" },
    { parts: [p("  built:  ["), s('"OakLand"'), p(", "), s('"JobHuntly"'), p(", "), s('"BugLab"'), p(", "), s('"Rung"'), p(", "), s('"Forge"'), p("],")], res: "→ 5 items" },
    { parts: [p("  openTo: "), s('"Remote roles and contract work"'), p(",")], res: "→ true" },
    { parts: [p("};")] },
    { parts: [c("// scroll, and read what it built ↓")], caret: true },
  ];
  const W = 1200, pitch = 46, top = 108, H = top + lines.length * pitch + 30;
  const LOOP = 18; // seconds
  const start = 6, gap = 4.2; // percent of the loop
  let anim = "";
  const rows = lines
    .map((l, i) => {
      const a = start + i * gap;
      anim += `@keyframes r${i} { 0%, ${a}% { opacity: 0; } ${a + 1.2}%, 93% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes f${i} { 0%, ${a}% { opacity: 0; } ${a + 0.6}% { opacity: 1; } ${a + 7}%, 100% { opacity: 0; } }
@keyframes v${i} { 0%, ${a + 1.2}% { opacity: 0; } ${a + 2.6}%, 93% { opacity: 1; } 97%, 100% { opacity: 0; } }
`;
      const y = top + i * pitch;
      const tspans = l.parts.map(([cls, t]) => `<tspan class="${cls}">${esc(t)}</tspan>`).join("");
      return `<rect class="flash" style="animation-name: f${i}" x="60" y="${y - 29}" width="1048" height="${pitch}"/>
<text class="ln" style="animation-name: r${i}" x="136" y="${y}" text-anchor="end">${i + 1}</text>
<text class="code" style="animation-name: r${i}" x="160" y="${y}" xml:space="preserve">${tspans}${l.caret ? '<tspan class="caret"> █</tspan>' : ""}</text>${l.res ? `\n<text class="res" style="animation-name: v${i}" x="1076" y="${y}" text-anchor="end">${esc(l.res)}</text>` : ""}`;
    })
    .join("\n");
  const mono = await font("jetbrains-mono-latin.woff2", ascii, "JB", "400 700");
  const style = `${mono}
text { font-family: JB, ui-monospace, monospace; font-size: 21px; white-space: pre; }
.code { fill: #f2f0e8; } .ln { fill: #9a968b; font-size: 17px; } .k { fill: #ff8a66; } .s { fill: #9fd9b4; } .c { fill: #a8a49a; } .p { fill: #f2f0e8; }
.res { fill: ${ACCENT}; font-weight: 500; }
.code, .ln, .res { animation-duration: ${LOOP}s; animation-iteration-count: infinite; animation-timing-function: linear; }
.flash { fill: ${ACCENT}; fill-opacity: 0.28; opacity: 0; animation: ${LOOP}s linear infinite; }
.caret { fill: ${ACCENT}; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
${anim}`;
  const body = `<rect width="${W}" height="${H + 30}" fill="${PAPER}"/>
<rect x="76" y="46" width="1048" height="${H - 36}" fill="${ACCENT}"/>
<rect x="60" y="30" width="1048" height="${H - 36}" fill="${INK}"/>
${rows}`;
  const desc = lines.map((l) => l.parts.map(([, t]) => t).join("")).join("\n");
  writeFileSync(join(out, "program.svg"), svg(W, H + 30, "const henry", `A code block that runs line by line:\n${desc}`, style, body));
}

// ── one card per project ─────────────────────────────────────────────────────────────────
{
  const cards = [
    { file: "oakland", title: "OAKLAND", n: "01", rot: -1.2 },
    { file: "jobhuntly", title: "JOBHUNTLY", n: "02", rot: 1 },
    { file: "buglab", title: "BUGLAB", n: "03", rot: -0.8 },
    { file: "rung", title: "RUNG", n: "04", rot: 1.2 },
  ];
  const archivo = await font("archivo-latin.woff2", "OAKLANDJOBHUNTLYBUGRC", "Archivo", "900", "62% 125%");
  const mono = await font("jetbrains-mono-latin.woff2", "0123456789/ ", "JB", "500");
  for (const card of cards) {
    const style = `${archivo}
${mono}
.title { font-family: Archivo, Arial Black, sans-serif; font-weight: 900; font-size: 54px; letter-spacing: -0.035em; fill: ${PAPER}; font-stretch: 70%; font-variation-settings: "wdth" 70; }
.num { font: 500 18px JB, ui-monospace, monospace; fill: ${ACCENT}; }`;
    const body = `<rect width="600" height="430" fill="${INK}"/>
<g transform="rotate(${card.rot} 300 190)">
<rect x="62" y="42" width="496" height="310" fill="${ACCENT}"/>
<svg x="50" y="30" width="496" height="310" viewBox="0 0 496 310"><rect width="496" height="310" fill="#000" stroke="${PAPER}" stroke-width="4"/><image href="${image(`${card.file}.webp`)}" x="2" y="2" width="492" height="306" preserveAspectRatio="xMidYMin slice"/></svg>
</g>
<text class="title" x="48" y="402">${card.title}</text>
<text class="num" x="552" y="402" text-anchor="end">${card.n} / 04</text>`;
    writeFileSync(join(out, `card-${card.file}.svg`), svg(600, 430, card.title, `A screenshot of ${card.title}, one of the projects of Henry Quel.`, style, body));
  }
}
console.log("assets written to", out);
