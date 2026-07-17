"use client";

import { motion } from "motion/react";

// Real DNA molecules as simplified skeletal formulas (like scientific
// hologram diagrams): the four bases + the deoxyribose sugar.

function Atom({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={label.length > 1 ? 13 : 9} fill="#020617" />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-mono, monospace)"
        className="fill-sky-300"
      >
        {label}
      </text>
    </g>
  );
}

const ring = "stroke-current fill-none";

// Pyrimidine ring (thymine / cytosine): hexagon centered (62,70), r=30
const HEX = "88,55 88,85 62,100 36,85 36,55 62,40";
// Purine (adenine / guanine): hexagon + fused five-ring on the right
const PENTA = "88,55 88,85 116,94 133,70 116,46";

function Thymine() {
  return (
    <g strokeWidth="1.3">
      <polygon points={HEX} className={ring} />
      <line x1="41" y1="59" x2="41" y2="81" className={ring} />
      <line x1="62" y1="40" x2="62" y2="18" className={ring} />
      <line x1="58" y1="40" x2="58" y2="22" className={ring} />
      <line x1="88" y1="85" x2="108" y2="97" className={ring} />
      <line x1="86" y1="89" x2="104" y2="100" className={ring} />
      <line x1="62" y1="100" x2="62" y2="122" className={ring} />
      <Atom x={36} y={55} label="N" />
      <Atom x={88} y={55} label="NH" />
      <Atom x={62} y={14} label="O" />
      <Atom x={110} y={99} label="O" />
      <Atom x={62} y={126} label="CH₃" />
    </g>
  );
}

function Cytosine() {
  return (
    <g strokeWidth="1.3">
      <polygon points={HEX} className={ring} />
      <line x1="84" y1="59" x2="84" y2="81" className={ring} />
      <line x1="43" y1="52" x2="60" y2="43" className={ring} />
      <line x1="62" y1="40" x2="62" y2="18" className={ring} />
      <line x1="36" y1="85" x2="16" y2="97" className={ring} />
      <line x1="38" y1="89" x2="20" y2="100" className={ring} />
      <Atom x={36} y={55} label="N" />
      <Atom x={62} y={100} label="N" />
      <Atom x={62} y={14} label="NH₂" />
      <Atom x={14} y={100} label="O" />
    </g>
  );
}

function Adenine() {
  return (
    <g strokeWidth="1.3">
      <polygon points={HEX} className={ring} />
      <polygon points={PENTA} className={ring} />
      <line x1="41" y1="59" x2="41" y2="81" className={ring} />
      <line x1="92" y1="90" x2="112" y2="97" className={ring} />
      <line x1="62" y1="40" x2="62" y2="18" className={ring} />
      <Atom x={36} y={55} label="N" />
      <Atom x={36} y={85} label="N" />
      <Atom x={116} y={46} label="N" />
      <Atom x={116} y={94} label="NH" />
      <Atom x={62} y={14} label="NH₂" />
    </g>
  );
}

function Guanine() {
  return (
    <g strokeWidth="1.3">
      <polygon points={HEX} className={ring} />
      <polygon points={PENTA} className={ring} />
      <line x1="92" y1="50" x2="112" y2="43" className={ring} />
      <line x1="62" y1="40" x2="62" y2="18" className={ring} />
      <line x1="58" y1="40" x2="58" y2="22" className={ring} />
      <line x1="36" y1="85" x2="16" y2="97" className={ring} />
      <Atom x={36} y={55} label="NH" />
      <Atom x={36} y={85} label="C" />
      <Atom x={14} y={100} label="NH₂" />
      <Atom x={62} y={14} label="O" />
      <Atom x={116} y={46} label="N" />
      <Atom x={116} y={94} label="NH" />
    </g>
  );
}

function Deoxyribose() {
  return (
    <g strokeWidth="1.3">
      <polygon points="70,38 98,58 88,90 52,90 42,58" className={ring} />
      <line x1="42" y1="58" x2="18" y2="44" className={ring} />
      <line x1="52" y1="90" x2="52" y2="112" className={ring} />
      <line x1="88" y1="90" x2="88" y2="112" className={ring} />
      <Atom x={70} y={38} label="O" />
      <Atom x={14} y={40} label="CH₂OH" />
      <Atom x={52} y={116} label="OH" />
      <Atom x={88} y={116} label="H" />
    </g>
  );
}

const MOLECULES = [
  { name: "adenine", formula: "C₅H₅N₅", Structure: Adenine },
  { name: "thymine", formula: "C₅H₆N₂O₂", Structure: Thymine },
  { name: "guanine", formula: "C₅H₅N₅O", Structure: Guanine },
  { name: "cytosine", formula: "C₄H₅N₃O", Structure: Cytosine },
  { name: "deoxyribose", formula: "C₅H₁₀O₄", Structure: Deoxyribose },
];

// Compact molecule shown beside section headings (unnamed, decorative).
export function MoleculeMark({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const { Structure } = MOLECULES[index % MOLECULES.length];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      aria-hidden
      className={`text-sky-400/70 ${className}`}
    >
      <svg
        width="72"
        height="62"
        viewBox="-16 0 182 150"
        className="shrink-0 drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]"
      >
        <Structure />
      </svg>
    </motion.div>
  );
}
