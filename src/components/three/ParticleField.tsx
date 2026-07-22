"use client";

const STAR_COUNT = 200;

// Generated once at module load (client-only), keeps render pure.
function buildStarPositions() {
  const array = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < array.length; i++) array[i] = (Math.random() - 0.5) * 55;
  return array;
}

const STAR_POSITIONS = buildStarPositions();

export function ParticleField() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#94a3b8"
        size={0.04}
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </points>
  );
}
