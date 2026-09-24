/**
 * Builds an original stylized sneaker GLB for the PULSO scroll-360 hero.
 * Run: node scripts/generate-munich-barru.mjs
 */
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

class FileReaderPolyfill {
  result = null;
  onloadend = null;
  onload = null;
  onerror = null;
  readyState = 0;

  readAsArrayBuffer(blob) {
    this.readyState = 1;
    Promise.resolve(blob.arrayBuffer())
      .then((buf) => {
        this.result = buf;
        this.readyState = 2;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      })
      .catch((err) => {
        this.onerror?.(err);
        this.onloadend?.({ target: this });
      });
  }
}

globalThis.FileReader = FileReaderPolyfill;

const out = join(process.cwd(), "public/models/munich-barru.glb");
mkdirSync(dirname(out), { recursive: true });

const scene = new THREE.Scene();
const root = new THREE.Group();
root.name = "MunichBarru";

const mustard = new THREE.MeshStandardMaterial({
  color: "#b8911a",
  roughness: 0.78,
  metalness: 0.02,
  name: "upper",
});
const navy = new THREE.MeshStandardMaterial({
  color: "#16304f",
  roughness: 0.5,
  metalness: 0.1,
  name: "accent",
});
const gum = new THREE.MeshStandardMaterial({
  color: "#6f5336",
  roughness: 0.9,
  metalness: 0,
  name: "sole",
});
const lace = new THREE.MeshStandardMaterial({
  color: "#f0e2b8",
  roughness: 0.55,
  metalness: 0,
  name: "lace",
});
const mid = new THREE.MeshStandardMaterial({
  color: "#efe8d8",
  roughness: 0.65,
  metalness: 0,
  name: "midsole",
});

function addBox(w, h, d, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

// Outsole + midsole — clear ground plane silhouette
addBox(2.7, 0.14, 1.0, gum, 0.08, 0.07, 0);
addBox(2.5, 0.1, 0.92, mid, 0.08, 0.18, 0);
addBox(2.55, 0.05, 0.96, mid, 0.08, 0.24, 0);

// Main upper
const upper = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.62, 0.86), mustard);
upper.position.set(0, 0.55, 0);
upper.castShadow = true;
root.add(upper);

// Rounded toe
const toe = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 18), mustard);
toe.scale.set(1.05, 0.78, 0.95);
toe.position.set(1.05, 0.42, 0);
toe.castShadow = true;
root.add(toe);

// Heel counter + tab
addBox(0.48, 0.72, 0.9, navy, -1.08, 0.58, 0);
addBox(0.2, 0.32, 0.38, navy, -1.28, 0.88, 0);

// Side straps — Pulso mark (readable from lateral view)
addBox(1.05, 0.14, 0.07, navy, 0.1, 0.62, 0.44, 0, 0, 0.48);
addBox(1.05, 0.14, 0.07, navy, 0.1, 0.62, -0.44, 0, 0, -0.48);
addBox(0.7, 0.12, 0.06, navy, 0.2, 0.48, 0.44, 0, 0, -0.35);
addBox(0.7, 0.12, 0.06, navy, 0.2, 0.48, -0.44, 0, 0, 0.35);

// Tongue + collar
addBox(0.6, 0.1, 0.58, mustard, 0.2, 0.9, 0, 0.28, 0, 0);
const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.44, 0.32, 28), mustard);
collar.rotation.z = Math.PI / 2;
collar.position.set(-0.5, 0.82, 0);
collar.castShadow = true;
root.add(collar);

for (let i = 0; i < 5; i++) {
  addBox(0.07, 0.045, 0.56, lace, 0.5 - i * 0.18, 0.82, 0);
}

scene.add(root);

const box3 = new THREE.Box3().setFromObject(root);
const center = box3.getCenter(new THREE.Vector3());
const size = box3.getSize(new THREE.Vector3());
root.position.sub(center);
root.position.y += size.y / 2;
// Default camera looks down -Z; keep a clear lateral/3-quarter silhouette at progress 0.
root.rotation.y = -Math.PI * 0.15;

const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const buf = Buffer.from(result);
    writeFileSync(out, buf);
    console.log(
      `Wrote ${out} (${buf.length} bytes) size=[${size
        .toArray()
        .map((n) => n.toFixed(3))
        .join(", ")}]`,
    );
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
  { binary: true },
);
