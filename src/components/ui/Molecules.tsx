"use client";

import { motion } from "motion/react";

// Neural network graph icons — stylized like scientific hologram diagrams.
// Each graph is a unique topology with layered depth, glowing connections,
// and asymmetric structure to avoid the "boring grid" look.

function NeuralGraph1() {
  return (
    <g>
      {/* Edges — drawn first, behind nodes */}
      <path d="M18,20 Q40,10 62,24" stroke="url(#g1-cyan)" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M18,20 Q40,35 62,44" stroke="url(#g1-cyan)" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M18,62 Q40,55 62,44" stroke="url(#g1-em)" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M18,62 Q40,70 62,68" stroke="url(#g1-em)" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M62,24 Q85,20 108,36" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M62,44 Q85,38 108,36" stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M62,44 Q85,52 108,52" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M62,68 Q85,62 108,52" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M108,36 Q120,40 130,44" stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M108,52 Q120,48 130,44" stroke="#34d399" strokeWidth="1.2" fill="none" opacity="0.6" />
      {/* Gradients */}
      <defs>
        <linearGradient id="g1-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id="g1-em" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>
      {/* Nodes — outer glow ring + solid core */}
      <circle cx={18} cy={20} r={7} fill="#22d3ee" opacity={0.12} />
      <circle cx={18} cy={20} r={4} fill="#22d3ee" />
      <circle cx={18} cy={62} r={7} fill="#34d399" opacity={0.12} />
      <circle cx={18} cy={62} r={4} fill="#34d399" />
      <circle cx={62} cy={24} r={5.5} fill="#22d3ee" opacity={0.1} />
      <circle cx={62} cy={24} r={3} fill="#22d3ee" />
      <circle cx={62} cy={44} r={7} fill="#ffffff" opacity={0.08} />
      <circle cx={62} cy={44} r={3.5} fill="#ffffff" opacity={0.9} />
      <circle cx={62} cy={68} r={5.5} fill="#34d399" opacity={0.1} />
      <circle cx={62} cy={68} r={3} fill="#34d399" />
      <circle cx={108} cy={36} r={5.5} fill="#22d3ee" opacity={0.1} />
      <circle cx={108} cy={36} r={3} fill="#22d3ee" />
      <circle cx={108} cy={52} r={5.5} fill="#34d399" opacity={0.1} />
      <circle cx={108} cy={52} r={3} fill="#34d399" />
      <circle cx={130} cy={44} r={8} fill="#ffffff" opacity={0.06} />
      <circle cx={130} cy={44} r={4.5} fill="#ffffff" opacity={0.85} />
    </g>
  );
}

function NeuralGraph2() {
  return (
    <g>
      <defs>
        <linearGradient id="g2-mix" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      {/* Diamond topology — 1-3-4-2 */}
      <path d="M20,44 C30,30 40,22 58,18" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M20,44 C35,42 45,40 58,40" stroke="url(#g2-mix)" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M20,44 C30,56 40,62 58,66" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M58,18 C72,20 82,24 94,28" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M58,18 C72,26 80,32 94,44" stroke="#22d3ee" strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M58,40 C72,36 82,32 94,28" stroke="#22d3ee" strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M58,40 C72,44 82,48 94,56" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M58,66 C72,60 82,54 94,56" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M58,66 C72,58 80,52 94,44" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M94,28 C105,32 112,36 122,38" stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M94,44 C106,42 112,40 122,38" stroke="url(#g2-mix)" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M94,56 C105,52 112,46 122,52" stroke="#34d399" strokeWidth="1.2" fill="none" opacity="0.55" />
      {/* Nodes */}
      <circle cx={20} cy={44} r={8} fill="#22d3ee" opacity={0.1} />
      <circle cx={20} cy={44} r={5} fill="#22d3ee" />
      <circle cx={58} cy={18} r={5} fill="#22d3ee" opacity={0.1} />
      <circle cx={58} cy={18} r={3} fill="#22d3ee" />
      <circle cx={58} cy={40} r={6} fill="#ffffff" opacity={0.07} />
      <circle cx={58} cy={40} r={3.5} fill="#ffffff" opacity={0.85} />
      <circle cx={58} cy={66} r={5} fill="#34d399" opacity={0.1} />
      <circle cx={58} cy={66} r={3} fill="#34d399" />
      <circle cx={94} cy={28} r={5} fill="#22d3ee" opacity={0.1} />
      <circle cx={94} cy={28} r={3} fill="#22d3ee" />
      <circle cx={94} cy={44} r={5.5} fill="#ffffff" opacity={0.07} />
      <circle cx={94} cy={44} r={3} fill="#ffffff" opacity={0.7} />
      <circle cx={94} cy={56} r={5} fill="#34d399" opacity={0.1} />
      <circle cx={94} cy={56} r={3} fill="#34d399" />
      <circle cx={122} cy={38} r={7} fill="#22d3ee" opacity={0.08} />
      <circle cx={122} cy={38} r={4} fill="#22d3ee" />
      <circle cx={122} cy={52} r={7} fill="#34d399" opacity={0.08} />
      <circle cx={122} cy={52} r={4} fill="#34d399" />
    </g>
  );
}

function NeuralGraph3() {
  return (
    <g>
      {/* Asymmetric skip-connection graph — like a transformer attention head */}
      <path d="M16,28 C30,20 42,16 60,16" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M16,28 C34,34 46,38 60,42" stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M16,60 C34,54 46,48 60,42" stroke="#34d399" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M16,60 C30,66 42,70 60,70" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M60,16 C78,20 90,28 106,36" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M60,42 C78,38 88,36 106,36" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M60,42 C78,48 88,52 106,54" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M60,70 C78,66 90,58 106,54" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Skip connection (residual) */}
      <path d="M16,28 C50,8 90,12 106,36" stroke="#67e8f9" strokeWidth="0.7" fill="none" opacity="0.3" strokeDasharray="3,3" />
      <path d="M16,60 C50,80 90,74 106,54" stroke="#6ee7b7" strokeWidth="0.7" fill="none" opacity="0.3" strokeDasharray="3,3" />
      {/* Nodes */}
      <circle cx={16} cy={28} r={7} fill="#22d3ee" opacity={0.12} />
      <circle cx={16} cy={28} r={4.5} fill="#22d3ee" />
      <circle cx={16} cy={60} r={7} fill="#34d399" opacity={0.12} />
      <circle cx={16} cy={60} r={4.5} fill="#34d399" />
      <circle cx={60} cy={16} r={5} fill="#22d3ee" opacity={0.1} />
      <circle cx={60} cy={16} r={2.8} fill="#22d3ee" />
      <circle cx={60} cy={42} r={7} fill="#ffffff" opacity={0.07} />
      <circle cx={60} cy={42} r={4} fill="#ffffff" opacity={0.9} />
      <circle cx={60} cy={70} r={5} fill="#34d399" opacity={0.1} />
      <circle cx={60} cy={70} r={2.8} fill="#34d399" />
      <circle cx={106} cy={36} r={7} fill="#22d3ee" opacity={0.08} />
      <circle cx={106} cy={36} r={4} fill="#22d3ee" />
      <circle cx={106} cy={54} r={7} fill="#34d399" opacity={0.08} />
      <circle cx={106} cy={54} r={4} fill="#34d399" />
    </g>
  );
}

function NeuralGraph4() {
  return (
    <g>
      {/* Radial/hub topology — central attention node */}
      <path d="M68,44 C50,30 36,24 22,22" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M68,44 C50,36 36,36 22,40" stroke="#22d3ee" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M68,44 C50,52 36,56 22,60" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M68,44 C50,58 36,66 22,72" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M68,44 C84,32 98,24 114,20" stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M68,44 C84,44 100,44 118,44" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M68,44 C84,56 98,64 114,68" stroke="#34d399" strokeWidth="1.2" fill="none" opacity="0.55" />
      {/* Nodes */}
      <circle cx={22} cy={22} r={5} fill="#22d3ee" opacity={0.1} />
      <circle cx={22} cy={22} r={3} fill="#22d3ee" />
      <circle cx={22} cy={40} r={4.5} fill="#22d3ee" opacity={0.08} />
      <circle cx={22} cy={40} r={2.5} fill="#22d3ee" opacity={0.8} />
      <circle cx={22} cy={60} r={4.5} fill="#34d399" opacity={0.08} />
      <circle cx={22} cy={60} r={2.5} fill="#34d399" opacity={0.8} />
      <circle cx={22} cy={72} r={5} fill="#34d399" opacity={0.1} />
      <circle cx={22} cy={72} r={3} fill="#34d399" />
      {/* Central hub */}
      <circle cx={68} cy={44} r={10} fill="#ffffff" opacity={0.05} />
      <circle cx={68} cy={44} r={6} fill="#ffffff" opacity={0.08} />
      <circle cx={68} cy={44} r={4} fill="#ffffff" opacity={0.9} />
      {/* Output */}
      <circle cx={114} cy={20} r={6} fill="#22d3ee" opacity={0.1} />
      <circle cx={114} cy={20} r={3.5} fill="#22d3ee" />
      <circle cx={118} cy={44} r={5} fill="#ffffff" opacity={0.06} />
      <circle cx={118} cy={44} r={3} fill="#ffffff" opacity={0.7} />
      <circle cx={114} cy={68} r={6} fill="#34d399" opacity={0.1} />
      <circle cx={114} cy={68} r={3.5} fill="#34d399" />
    </g>
  );
}

function NeuralGraph5() {
  return (
    <g>
      {/* Deep narrow network — 2-2-3-2-1 with curved paths */}
      <defs>
        <linearGradient id="g5-mix" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <path d="M14,30 C24,28 32,24 42,22" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M14,30 C24,38 32,44 42,50" stroke="url(#g5-mix)" strokeWidth="0.9" fill="none" opacity="0.4" />
      <path d="M14,58 C24,52 32,48 42,50" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M14,58 C24,62 32,66 42,72" stroke="#34d399" strokeWidth="0.9" fill="none" opacity="0.4" />
      <path d="M42,22 C52,22 60,20 70,18" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M42,22 C52,30 60,36 70,40" stroke="#22d3ee" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M42,50 C52,44 60,42 70,40" stroke="url(#g5-mix)" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M42,50 C52,56 60,60 70,62" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M42,72 C52,68 60,64 70,62" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M70,18 C80,22 90,28 100,32" stroke="#22d3ee" strokeWidth="1.1" fill="none" opacity="0.5" />
      <path d="M70,40 C80,38 90,36 100,32" stroke="#22d3ee" strokeWidth="0.9" fill="none" opacity="0.4" />
      <path d="M70,40 C80,44 90,48 100,54" stroke="#34d399" strokeWidth="0.9" fill="none" opacity="0.4" />
      <path d="M70,62 C80,58 90,56 100,54" stroke="#34d399" strokeWidth="1.1" fill="none" opacity="0.5" />
      <path d="M100,32 C110,36 118,40 126,44" stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d="M100,54 C110,50 118,46 126,44" stroke="#34d399" strokeWidth="1.2" fill="none" opacity="0.55" />
      {/* Nodes */}
      <circle cx={14} cy={30} r={6} fill="#22d3ee" opacity={0.1} />
      <circle cx={14} cy={30} r={3.5} fill="#22d3ee" />
      <circle cx={14} cy={58} r={6} fill="#34d399" opacity={0.1} />
      <circle cx={14} cy={58} r={3.5} fill="#34d399" />
      <circle cx={42} cy={22} r={5} fill="#22d3ee" opacity={0.08} />
      <circle cx={42} cy={22} r={2.8} fill="#22d3ee" />
      <circle cx={42} cy={50} r={6} fill="#ffffff" opacity={0.06} />
      <circle cx={42} cy={50} r={3} fill="#ffffff" opacity={0.8} />
      <circle cx={42} cy={72} r={5} fill="#34d399" opacity={0.08} />
      <circle cx={42} cy={72} r={2.8} fill="#34d399" />
      <circle cx={70} cy={18} r={4.5} fill="#22d3ee" opacity={0.08} />
      <circle cx={70} cy={18} r={2.5} fill="#22d3ee" />
      <circle cx={70} cy={40} r={6} fill="#ffffff" opacity={0.06} />
      <circle cx={70} cy={40} r={3.2} fill="#ffffff" opacity={0.85} />
      <circle cx={70} cy={62} r={4.5} fill="#34d399" opacity={0.08} />
      <circle cx={70} cy={62} r={2.5} fill="#34d399" />
      <circle cx={100} cy={32} r={5} fill="#22d3ee" opacity={0.08} />
      <circle cx={100} cy={32} r={3} fill="#22d3ee" />
      <circle cx={100} cy={54} r={5} fill="#34d399" opacity={0.08} />
      <circle cx={100} cy={54} r={3} fill="#34d399" />
      <circle cx={126} cy={44} r={8} fill="#ffffff" opacity={0.05} />
      <circle cx={126} cy={44} r={5} fill="#ffffff" opacity={0.9} />
    </g>
  );
}

const GRAPHS = [NeuralGraph1, NeuralGraph2, NeuralGraph3, NeuralGraph4, NeuralGraph5];

export function MoleculeMark({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const Graph = GRAPHS[index % GRAPHS.length];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      aria-hidden
      className={className}
    >
      <svg
        width="72"
        height="56"
        viewBox="0 0 140 90"
        className="shrink-0"
      >
        <Graph />
      </svg>
    </motion.div>
  );
}
