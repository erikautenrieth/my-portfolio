# DNA Particle Helix — Konzept

## Vision
Die DNA besteht komplett aus tausenden kleinen leuchtenden Partikeln (Punkten), die sich beim Scrollen aus einer zufälligen Wolke zur Helix-Form zusammensetzen. Referenz: iStock-Bild mit lumineszenten Partikel-DNA-Strängen.

## Technik: THREE.Points + Custom ShaderMaterial

### Warum Points statt InstancedMesh?
- 1 Draw Call für 4200 Partikel (statt ~40+ Draw Calls aktuell)
- GL_POINT Primitives = 0 Triangles pro Partikel
- Fragment Shader erzeugt weiche leuchtende Kreise via `gl_PointCoord`
- Morph-Animation komplett im Vertex Shader (Zero CPU per frame)

### Partikel-Verteilung (4200 total)
| Element | Anzahl | Beschreibung |
|---|---|---|
| Strand A | 1400 | Partikel entlang der ersten Helix-Kurve |
| Strand B | 1400 | Partikel entlang der zweiten Helix-Kurve (Phase +2.2 rad) |
| Rungs | 400 | 12 Partikel pro Rung, linear interpoliert zwischen Strand A/B |
| Ambient Cloud | 1000 | Zufällig in Zylinder um Helix (r=4-8, h=30) |

### Scroll-Animation (Morph)
- `uProgress = 0`: Alle Partikel in zufälligen Cloud-Positionen
- `uProgress = 1`: Alle Partikel formen die DNA-Helix
- Morph passiert in den ersten 30% des Scrolls
- Gedämpft mit `THREE.MathUtils.damp` für organisches Easing

### Vertex Shader
```glsl
attribute vec3 aHelixPosition;  // Ziel: DNA-Form
attribute vec3 aCloudPosition;  // Start: zufällige Wolke
attribute float aSize;
uniform float uProgress;        // 0=cloud, 1=helix
uniform float uTime;

void main() {
  vec3 pos = mix(aCloudPosition, aHelixPosition, uProgress);
  // Subtile Oszillation wenn geformt
  pos += sin(uTime * 0.8 + aHelixPosition.y * 0.3) * (1.0 - uProgress) * 0.3;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = aSize * (200.0 / -mvPosition.z);
}
```

### Fragment Shader
```glsl
uniform vec3 uColorA;  // #22d3ee (Cyan)
uniform vec3 uColorB;  // #0e7490 (Teal)

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  float strength = pow(max(1.0 - dist * 2.0, 0.0), 2.5);
  vec3 color = mix(uColorA, uColorB, vDistFromCenter * 0.4);
  color *= 1.8;  // HDR → triggers Bloom
  gl_FragColor = vec4(color, strength);
}
```

### Farben
- Strand A Partikel: `#22d3ee` (helles Cyan, blooms stark)
- Strand B Partikel: `#0e7490` (dunkles Teal, structural)
- Rung Partikel: Gradient zwischen beiden Strand-Farben
- Ambient Cloud: `#94a3b8` bei 40% Size (blooms nicht, bleibt subtil)

### Bloom Integration
```tsx
<Bloom luminanceThreshold={0.9} intensity={1.2} mipmapBlur />
```
Partikel mit `color *= 1.8` → HDR → Bloom. Ambient-Partikel bleiben unter Threshold.

### Performance
- 2 Draw Calls total (Helix + Ambient)
- 4550 Vertices (vs aktuell ~40+ Meshes)
- Zero CPU-Arbeit pro Frame (nur 2 Uniforms updaten)
- 60fps garantiert auf jedem modernen Gerät

### Bestehende Logik beibehalten
- Camera Tracking (scroll-driven)
- Target Lock HTML Overlays (SEQ.01 etc.)
- IntersectionObserver für aktive Section
- Helix-Mathematik (helixPoint(), TURNS, HEIGHT, R, PHASE_OFFSET)
