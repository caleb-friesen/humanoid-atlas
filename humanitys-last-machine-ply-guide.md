# Using PLY Models from Humanity's Last Machine

A detailed technical breakdown of how [humanityslastmachine.com](https://www.humanityslastmachine.com/) renders its floating, rotating stippled 3D objects — and how to download and reuse them in your own projects.

---

## Table of Contents

1. [What the Effect Actually Is](#what-the-effect-actually-is)
2. [The PLY File Format Used](#the-ply-file-format-used)
3. [Complete Model Inventory](#complete-model-inventory)
4. [How to Download the Models](#how-to-download-the-models)
5. [How the Site Renders Them](#how-the-site-renders-them)
6. [How to Use Them in Your Own Site](#how-to-use-them-in-your-own-site)
7. [Complete Working Example](#complete-working-example)
8. [Rendering Options & Customization](#rendering-options--customization)
9. [Performance Considerations](#performance-considerations)

---

## What the Effect Actually Is

The site displays robotics hardware components (motors, bearings, batteries, actuators, etc.) as floating, slowly rotating objects rendered in a **stippled/engraving aesthetic** — thousands of tiny black dots forming the shape of each object against a paper-textured background.

This is NOT:
- A CSS effect or SVG
- A video or animated GIF
- A standard 3D mesh with textures

It IS:
- **3D Gaussian Splat PLY files** loaded with Three.js's `PLYLoader`
- Rendered as **point clouds** using Three.js `Points` + `PointsMaterial`
- The Gaussian Splat properties (scale, rotation, opacity) are **deliberately ignored** — only vertex positions are used
- This "misuse" of Gaussian Splat data as raw point clouds is what creates the distinctive stippled look
- Each dot you see on screen = one vertex/gaussian from the PLY file

---

## The PLY File Format Used

Each model uses the **binary little-endian PLY format** with 17 float properties per vertex. Here is the actual header from one of the files:

```
ply
format binary_little_endian 1.0
element vertex 19556
property float x
property float y
property float z
property float nx
property float ny
property float nz
property float f_dc_0
property float f_dc_1
property float f_dc_2
property float opacity
property float scale_0
property float scale_1
property float scale_2
property float rot_0
property float rot_1
property float rot_2
property float rot_3
end_header
<binary data>
```

### Property breakdown

| Property | Purpose | Used by the site? |
|----------|---------|-------------------|
| `x, y, z` | 3D position of each point | **Yes** — this is all that's needed for the stippled look |
| `nx, ny, nz` | Surface normals | No |
| `f_dc_0, f_dc_1, f_dc_2` | Spherical harmonics DC band (encodes color) | No — all points rendered as uniform black |
| `opacity` | Gaussian opacity | No |
| `scale_0, scale_1, scale_2` | Gaussian ellipsoid scale (3 axes) | No |
| `rot_0, rot_1, rot_2, rot_3` | Gaussian rotation quaternion | No |

Each vertex = 17 floats x 4 bytes = **68 bytes** of data, plus a small header.

These files originate from **3D Gaussian Splatting** — a photogrammetry technique from the 2023 paper by Kerbl et al. The objects were likely 3D-scanned using a phone or camera array, processed through a Gaussian Splatting pipeline (like Nerfstudio, gsplat, or Luma AI), and the resulting `.ply` splat files are served directly.

---

## Complete Model Inventory

There are **16 PLY models** total on the site. Each corresponds to a section of the article about humanoid robotics hardware. 12 are confirmed publicly downloadable, 4 have URL variations that may require browser-based download.

### Downloadable Models (12)

| # | Model Name | Article Section | Vertices | File Size | What It Depicts |
|---|-----------|----------------|----------|-----------|-----------------|
| 1 | Skeleton | Full humanoid body | 19,556 | 1.3 MB | Complete humanoid robot skeleton/frame |
| 2 | Brushless DC Motor | Actuators | 105,544 | 7.2 MB | Electric brushless DC motor |
| 3 | Reducers - Strain Wave Reducer | Actuators | 108,940 | 7.4 MB | Harmonic/strain wave gear reducer |
| 4 | Screws-Planetary Screw | Actuators | 44,124 | 3.0 MB | Planetary screw mechanism |
| 5 | Bearings | Mechanical Components | 124,920 | 8.5 MB | Ball/roller bearing assembly |
| 6 | Battery | Power | 85,388 | 5.8 MB | Battery pack/cell |
| 7 | PCBs - pcb | Compute | 25,900 | 1.8 MB | Printed circuit board |
| 8 | General Sensors - Standard Camera | Sensors | 81,928 | 5.6 MB | Camera sensor module |
| 9 | Component Costs | Economics | 18,512 | 1.3 MB | (Decorative for costs section) |
| 10 | Thank You | Credits | 16,336 | 1.1 MB | (Decorative for credits section) |
| 11 | Actuators - Linear actuator | Actuators | 12,164 | 828 KB | Linear actuator mechanism |
| 12 | Actuators - Rotary actuator | Actuators | 41,084 | 2.8 MB | Rotary actuator mechanism |

### Additional Models (4) — Visible in Network Tab

These appear in browser network requests but may require exact URL matching or session context:

| # | Model Name | Size (from network) | Vertices (est.) |
|---|-----------|---------------------|-----------------|
| 13 | Encoder 201 | 1,883 kB | ~27,700 |
| 14 | Compute 201 | 3,419 kB | ~50,300 |
| 15 | Tactile sensor 202 | 2,127 kB | ~31,300 |
| 16 | End Effectors - Tactile sensor 2... | 1,629 kB | ~24,000 |

### Broken/Dead References (1)

| Model | Status | Notes |
|-------|--------|-------|
| sam3d-splat.ply | 404 | Preloaded in HTML `<head>` but file doesn't exist on server — likely removed or renamed |

**Total vertex count across all models: ~850,000+ points**
**Total download size: ~55 MB**

---

## How to Download the Models

### Method 1: Direct URL (curl / wget)

All confirmed models live at:
```
https://www.humanityslastmachine.com/models/Gaussian%20Splats/{ModelName}.ply
```

Download all 12 confirmed models:

```bash
mkdir -p hlm-models && cd hlm-models

curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Skeleton.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Brushless%20DC%20Motor.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Reducers%20-%20Strain%20Wave%20Reducer.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Screws-Planetary%20Screw.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Bearings.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Battery.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/PCBs%20-%20pcb.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/General%20Sensors%20-%20Standard%20Camera.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Component%20Costs.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Thank%20You.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Actuators%20-%20Linear%20actuator.ply"
curl -O "https://www.humanityslastmachine.com/models/Gaussian%20Splats/Actuators%20-%20Rotary%20actuator.ply"
```

### Method 2: Browser DevTools (for all 16 models)

This is the best method for the 4 models that can't be downloaded via direct URL:

1. Open https://www.humanityslastmachine.com/ in Chrome
2. Open DevTools (Cmd+Option+I / F12)
3. Go to **Network** tab
4. Check **"Disable cache"**
5. Hard reload (Cmd+Shift+R)
6. Filter by `.ply`
7. Scroll through the entire article to trigger lazy-loaded models
8. Right-click any `.ply` request → **"Copy" → "Copy as cURL"** to get the exact download command
9. Or right-click → **"Open in new tab"** to download directly

### Method 3: Browser Console Script

Paste this into the browser console after fully loading the page to download all models that have been fetched:

```javascript
// Run after scrolling through the entire article
performance.getEntriesByType('resource')
  .filter(r => r.name.endsWith('.ply'))
  .forEach(r => {
    const a = document.createElement('a');
    a.href = r.name;
    a.download = r.name.split('/').pop();
    a.click();
  });
```

---

## How the Site Renders Them

### Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| 3D Engine | **Three.js** (full build, ~884 KB) | Scene graph, WebGL rendering, camera, lighting |
| Model Loader | **Three.js PLYLoader** | Parses binary PLY files into BufferGeometry |
| Point Rendering | **Three.js Points + PointsMaterial** | Renders each vertex as a screen-space dot |
| Dot Sizing | **Custom vertex shader with `gl_PointSize`** | Controls how large each dot appears |
| Scroll Animation | **GSAP ScrollTrigger** | Ties model position/opacity to scroll position |
| Transitions | **Framer Motion** | Handles fade-in/out and entrance animations |
| Framework | **Next.js App Router + Turbopack** | SSR, code splitting, lazy chunk loading |

### Rendering Pipeline

Here's what happens step by step when you visit the page:

**1. Page Load**
- Next.js serves the HTML shell with preload hints for `Skeleton.ply`
- The Three.js chunk (`6c12eaf343cc22dc.js`, 884 KB) loads asynchronously
- GSAP (`8ad35c193c72828e.js`) and Framer Motion (`4feec57ccd843aae.js`) load in parallel

**2. Scene Initialization**
```
WebGLRenderer → attached to a <canvas> element
Scene → empty scene with no background (transparent)
PerspectiveCamera → positioned to frame each model
```
The canvas overlays the article text with `position: fixed` or `absolute`, allowing the stippled objects to float over/alongside the content.

**3. Model Loading (per section)**
As the user scrolls, each section's PLY model is fetched:
```
fetch('/models/Gaussian Splats/Bearings.ply')
  → ArrayBuffer (binary data)
  → PLYLoader.parse(buffer)
  → BufferGeometry with position attribute (Float32Array of x,y,z triplets)
```

**4. Point Cloud Creation**
```javascript
const geometry = loader.parse(buffer);  // BufferGeometry from PLY
const material = new THREE.PointsMaterial({
  color: 0x000000,      // Black dots
  size: 1.5,            // Small dot size (pixels)
  sizeAttenuation: true // Dots shrink with distance
});
const points = new THREE.Points(geometry, material);
scene.add(points);
```

The PLYLoader reads ALL 17 properties from the binary data but only the `position` attribute (x, y, z) is used by `Points`. The gaussian-specific properties (scale, rotation, opacity, SH color) are parsed into the BufferGeometry but never referenced by the material — they're effectively discarded at render time.

**5. Animation Loop**
```javascript
function animate() {
  points.rotation.y += 0.003;  // Slow continuous Y-axis rotation
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

**6. Scroll-Driven Behavior (GSAP ScrollTrigger)**
```javascript
ScrollTrigger.create({
  trigger: sectionElement,
  start: 'top center',
  end: 'bottom center',
  onEnter: () => { /* fade in model, start rotation */ },
  onLeave: () => { /* fade out model */ },
  onUpdate: (self) => {
    // Parallax: model floats up/down with scroll
    points.position.y = self.progress * -100;
  }
});
```

Each section has its own ScrollTrigger that:
- Loads the PLY when the section enters the viewport (lazy loading)
- Fades the point cloud in
- Applies a parallax float effect as you scroll
- Fades it out when you scroll past
- Swaps to the next section's model

**7. The Stippled Aesthetic**

The distinctive engraving/stipple look comes from:
- **Black dots** (`color: 0x000000`) on a **paper-textured background**
- **Small point size** (1-3 pixels) — each gaussian becomes a tiny dot
- **No lighting** — points are unlit, creating a flat graphic quality
- **Transparent canvas** — the WebGL canvas has `alpha: true`, so the paper texture shows through
- **Point density** — Gaussian Splat files naturally have high, non-uniform point density that mirrors the original surface detail (more points on detailed areas, fewer on flat surfaces), which mimics stipple illustration technique

---

## How to Use Them in Your Own Site

### Quick Start (Vanilla JS)

```bash
npm install three
```

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #f5f0eb; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="module">
    import * as THREE from 'three';
    import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    document.body.appendChild(renderer.domElement);

    // Load PLY model
    const loader = new PLYLoader();
    loader.load('/models/Bearings.ply', (geometry) => {
      geometry.computeBoundingSphere();

      // Center the geometry
      geometry.center();

      // Normalize scale
      const scale = 1 / geometry.boundingSphere.radius;
      geometry.scale(scale, scale, scale);

      const material = new THREE.PointsMaterial({
        color: 0x000000,
        size: 0.005,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Animation loop
      function animate() {
        points.rotation.y += 0.003;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    });

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

### React + Three.js (React Three Fiber)

```bash
npm install @react-three/fiber @react-three/drei three
```

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

function PointCloudModel({ url }: { url: string }) {
  const ref = useRef<THREE.Points>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const loader = new PLYLoader();
    loader.load(url, (geo) => {
      geo.center();
      geo.computeBoundingSphere();
      const s = 1 / geo.boundingSphere!.radius;
      geo.scale(s, s, s);
      setGeometry(geo);
    });
  }, [url]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.003;
  });

  if (!geometry) return null;

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="black" size={0.005} sizeAttenuation />
    </points>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <PointCloudModel url="/models/Bearings.ply" />
    </Canvas>
  );
}
```

### Adding Scroll Animation (GSAP)

```bash
npm install gsap
```

```tsx
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// In your component:
useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
    },
  });

  tl.fromTo(canvasRef.current,
    { opacity: 0, y: 100 },
    { opacity: 1, y: -100, ease: 'none' }
  );

  return () => tl.kill();
}, []);
```

---

## Complete Working Example

Here's a single HTML file you can open directly in a browser to see the effect:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>PLY Point Cloud Viewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f5f0eb;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      font-family: 'Cormorant Garamond', Georgia, serif;
      color: #1a1a1a;
    }
    .section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 4rem;
    }
    .section h2 {
      font-size: 3rem;
      font-weight: 300;
      font-style: italic;
      position: absolute;
      left: 8%;
      max-width: 30%;
    }
    #canvas-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }
    .content { position: relative; z-index: 0; }
  </style>
</head>
<body>
  <div id="canvas-container"></div>
  <div class="content">
    <div class="section"><h2>Bearings</h2></div>
    <div class="section"><h2>The precision components<br/>that enable motion.</h2></div>
    <div class="section"><h2>Every rotation begins here.</h2></div>
  </div>

  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
      }
    }
  </script>
  <script type="module">
    import * as THREE from 'three';
    import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    let pointCloud = null;

    const loader = new PLYLoader();

    // Replace with your local model path or use the remote URL
    loader.load(
      'https://www.humanityslastmachine.com/models/Gaussian%20Splats/Bearings.ply',
      (geometry) => {
        geometry.center();
        geometry.computeBoundingSphere();
        const s = 1.2 / geometry.boundingSphere.radius;
        geometry.scale(s, s, s);

        const material = new THREE.PointsMaterial({
          color: 0x1a1a1a,
          size: 0.004,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.85,
        });

        pointCloud = new THREE.Points(geometry, material);
        scene.add(pointCloud);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      if (pointCloud) {
        pointCloud.rotation.y += 0.002;
        pointCloud.rotation.x += 0.0005;

        // Gentle float with scroll
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = scrollY / maxScroll;
        pointCloud.position.y = (progress - 0.5) * -1.5;
      }
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

---

## Rendering Options & Customization

### Stipple density

Control how many points render by subsampling the geometry:

```javascript
// Show only every Nth point for a sparser stipple
function subsampleGeometry(geometry, factor = 2) {
  const positions = geometry.getAttribute('position');
  const count = Math.floor(positions.count / factor);
  const newPositions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    newPositions[i * 3] = positions.getX(i * factor);
    newPositions[i * 3 + 1] = positions.getY(i * factor);
    newPositions[i * 3 + 2] = positions.getZ(i * factor);
  }

  const newGeo = new THREE.BufferGeometry();
  newGeo.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
  return newGeo;
}
```

### Use the embedded color data

The PLY files contain color in spherical harmonics format. To extract it:

```javascript
// f_dc values encode color via SH band 0
// Convert SH DC coefficient to RGB: color = 0.5 + coeff * 0.2820947917738781
loader.load(url, (geometry) => {
  // The PLYLoader puts custom properties in the geometry
  // You'd need to parse them manually or modify PLYLoader
  // to extract f_dc_0, f_dc_1, f_dc_2 as a color attribute

  // If colors were extracted as an attribute:
  const material = new THREE.PointsMaterial({
    vertexColors: true,  // Use per-vertex colors from the PLY
    size: 0.005,
    sizeAttenuation: true,
  });
});
```

### Custom shader for varied dot sizes

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `
    uniform float uSize;
    uniform float uPixelRatio;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size varies slightly per point for organic feel
      float sizeVariation = 0.8 + 0.4 * fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
      gl_PointSize = uSize * uPixelRatio * sizeVariation * (300.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    void main() {
      // Circular points instead of squares
      vec2 center = gl_PointCoord - vec2(0.5);
      if (dot(center, center) > 0.25) discard;

      gl_FragColor = vec4(0.1, 0.1, 0.1, 0.8);
    }
  `,
  uniforms: {
    uSize: { value: 2.0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
  transparent: true,
});
```

### Full Gaussian Splat rendering

If you want photorealistic rendering (not the stippled look), use a proper Gaussian Splat renderer:

```bash
npm install @mkkellogg/gaussian-splat-3d
```

```javascript
import * as GaussianSplats3D from '@mkkellogg/gaussian-splat-3d';

const viewer = new GaussianSplats3D.Viewer({
  cameraUp: [0, -1, 0],
  initialCameraPosition: [0, 0, 3],
  initialCameraLookAt: [0, 0, 0],
  selfDrivenMode: true,
});

viewer.addSplatScene('/models/Bearings.ply').start();
```

This will render the full Gaussian Splats with proper opacity, scale, rotation, and color — giving a photorealistic 3D scan appearance instead of the stippled look.

---

## Performance Considerations

### File sizes and loading

| Model Category | Vertex Range | File Size Range | Load Time (3G) | Load Time (WiFi) |
|---------------|-------------|-----------------|-----------------|-------------------|
| Small (Thank You, Linear actuator) | 12K-16K | 0.8-1.1 MB | 3-4s | <1s |
| Medium (Skeleton, PCBs, Screws) | 19K-44K | 1.3-3.0 MB | 5-10s | 1-2s |
| Large (Battery, Camera, Motor) | 81K-109K | 5.5-7.4 MB | 15-25s | 2-4s |
| Extra Large (Bearings) | 125K | 8.5 MB | 28s | 3-5s |

### Optimization strategies

1. **Lazy load per section** — Only fetch the PLY when its section enters the viewport (the original site does this)
2. **Subsample large models** — Reduce 125K vertices to 50K with minimal visual difference
3. **Use `Float16Array`** — Half-precision reduces geometry memory by 50%
4. **Strip unused properties** — Convert the 68-byte/vertex Gaussian format to 12-byte/vertex (xyz only) using a build script:

```javascript
// Node.js script to strip Gaussian properties, keeping only xyz
import { readFileSync, writeFileSync } from 'fs';

const buffer = readFileSync('Bearings.ply');
const header = buffer.toString('ascii', 0, 500);
const vertexCount = parseInt(header.match(/element vertex (\d+)/)[1]);
const headerEnd = buffer.indexOf('end_header\n') + 'end_header\n'.length;

const bytesPerVertex = 17 * 4; // 17 floats x 4 bytes
const positions = new Float32Array(vertexCount * 3);

for (let i = 0; i < vertexCount; i++) {
  const offset = headerEnd + i * bytesPerVertex;
  positions[i * 3] = buffer.readFloatLE(offset);      // x
  positions[i * 3 + 1] = buffer.readFloatLE(offset + 4);  // y
  positions[i * 3 + 2] = buffer.readFloatLE(offset + 8);  // z
}

// Write stripped PLY
const newHeader = `ply\nformat binary_little_endian 1.0\nelement vertex ${vertexCount}\nproperty float x\nproperty float y\nproperty float z\nend_header\n`;
const headerBuf = Buffer.from(newHeader);
const dataBuf = Buffer.from(positions.buffer);
writeFileSync('Bearings-stripped.ply', Buffer.concat([headerBuf, dataBuf]));

// Original: 8.5 MB → Stripped: ~1.5 MB (82% reduction)
```

5. **Compress with Draco or gzip** — Serve `.ply` files with gzip/brotli compression from your CDN

---

## Legal Note

These models are served publicly from humanityslastmachine.com with no authentication. However, the site is authored by Sourish Jasti, Zoey Tang, Intel Chen, and Vishnu Mano with design by Noor Alam, supported by RoboStrategy. If you plan to use these models commercially, consider reaching out to the authors for permission. For personal projects, learning, and prototyping, downloading publicly served assets is generally acceptable.
