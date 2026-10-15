import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const W = 1200
const H = 630
const BG = '#06090c'
const VOLT = '#9dff3c'
const VIOLET = '#7c5cff'
const TEXT = '#e6edf3'
const MUTED = '#8b98a7'

// Build node-graph motif: circles + connecting lines
const nodes = [
  { cx: 180, cy: 200, r: 8, fill: VOLT },
  { cx: 380, cy: 130, r: 6, fill: VIOLET },
  { cx: 580, cy: 280, r: 7, fill: VOLT },
  { cx: 760, cy: 160, r: 6, fill: VIOLET },
  { cx: 950, cy: 340, r: 8, fill: VOLT },
  { cx: 300, cy: 420, r: 5, fill: VIOLET },
  { cx: 680, cy: 450, r: 6, fill: VOLT },
  { cx: 1020, cy: 180, r: 5, fill: VIOLET },
  { cx: 140, cy: 380, r: 4, fill: MUTED },
  { cx: 860, cy: 480, r: 4, fill: MUTED },
  { cx: 480, cy: 500, r: 5, fill: VOLT },
  { cx: 1080, cy: 420, r: 4, fill: VIOLET }
]

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [2, 6], [3, 7],
  [0, 8], [5, 10], [6, 9], [4, 11], [7, 11]
]

const lines = edges.map(([a, b]) =>
  `<line x1="${nodes[a].cx}" y1="${nodes[a].cy}" x2="${nodes[b].cx}" y2="${nodes[b].cy}" stroke="${MUTED}" stroke-width="1" stroke-opacity="0.25"/>`
).join('\n  ')

const circles = nodes.map((n) =>
  `<circle cx="${n.cx}" cy="${n.cy}" r="${n.r}" fill="${n.fill}" opacity="0.7"/>`
).join('\n  ')

// Subtle glow behind center nodes
const glows = [
  `<circle cx="580" cy="280" r="120" fill="${VOLT}" opacity="0.04"/>`,
  `<circle cx="380" cy="130" r="100" fill="${VIOLET}" opacity="0.05"/>`
].join('\n  ')

// Grid pattern
const gridLines = []
for (let x = 0; x <= W; x += 60) {
  gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${MUTED}" stroke-width="0.5" stroke-opacity="0.06"/>`)
}
for (let y = 0; y <= H; y += 60) {
  gridLines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${MUTED}" stroke-width="0.5" stroke-opacity="0.06"/>`)
}

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${gridLines.join('\n  ')}
  ${glows}
  ${lines}
  ${circles}

  <!-- Wordmark -->
  <text x="100" y="310" font-family="monospace" font-size="56" font-weight="700" fill="${TEXT}" letter-spacing="-1">ARH Automation</text>
  <text x="100" y="310" font-family="monospace" font-size="56" font-weight="700" fill="${VOLT}" letter-spacing="-1" opacity="0">.</text>

  <!-- Tagline -->
  <text x="100" y="360" font-family="monospace" font-size="22" fill="${MUTED}" letter-spacing="3">AI automation architect</text>

  <!-- Accent bar -->
  <rect x="100" y="380" width="60" height="3" fill="${VOLT}" rx="1.5"/>

  <!-- Domain -->
  <text x="100" y="430" font-family="monospace" font-size="16" fill="${MUTED}" opacity="0.6">arhautomation.com</text>
</svg>`

const outPath = resolve('public', 'og.png')
await sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)

console.log(`OG image written to ${outPath}`)
