// Hero Globe Animation using Three.js with Icon Nodes
function initGlobe() {
  console.log("Initializing globe...");
  const canvas = document.getElementById("globe");
  console.log("Canvas element:", canvas);

  if (!canvas) {
    console.error("Canvas element not found!");
    const msg = document.createElement("div");
    msg.textContent = "Canvas not found!";
    msg.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:red;font-size:24px;background:black;padding:20px;";
    document.body.appendChild(msg);
    return;
  }

  console.log("Three.js available:", typeof THREE);
  if (typeof THREE === "undefined") {
    console.error("Three.js not loaded!");
    return;
  }

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    console.log("WebGL renderer created successfully");
  } catch (e) {
    console.error("Failed to create WebGL renderer:", e);
    canvas.style.display = "none";

    const errorMsg = document.createElement("div");
    errorMsg.textContent = "WebGL not supported - globe cannot be displayed";
    errorMsg.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-family:monospace;background:black;padding:20px;border-radius:10px;";
    document.body.appendChild(errorMsg);
    return;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  // Globe Geometry and Material
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00e5d1,
    wireframe: true,
    transparent: false,
    opacity: 1,
  });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);
  console.log("Globe mesh added to scene");

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Camera Position
  camera.position.z = 10;

  // Replace these icon URLs later with your own real public assets
  const CHANNELS = [
    { id: "Web Chat", icon: "https://cdn.example.com/icons/webchat.svg", link: "https://your-webchat-link" },
    { id: "SMS", icon: "https://cdn.example.com/icons/sms.svg", link: "sms:+14374947028" },
    { id: "WhatsApp", icon: "https://cdn.example.com/icons/whatsapp.svg", link: "https://wa.me/14374947028" },
    { id: "Messenger", icon: "https://cdn.example.com/icons/messenger.svg", link: "https://m.me/..." },
    { id: "Instagram", icon: "https://cdn.example.com/icons/instagram.svg", link: "https://instagram.com/..." },
    { id: "Email", icon: "https://cdn.example.com/icons/email.svg", link: "mailto:..." },
    { id: "Calls", icon: "https://cdn.example.com/icons/phone.svg", link: "tel:+14374947028" },
    { id: "Booking", icon: "https://cdn.example.com/icons/calendar.svg", link: "https://www.lukairoengine.com/..." },
    { id: "CRM", icon: "https://cdn.example.com/icons/hubspot.svg", link: "https://crm.example.com/..." },
    { id: "Automation", icon: "https://cdn.example.com/icons/automation.svg", link: "https://automation.link" },
  ];

  function hexToRgba(hex, a = 1) {
    let clean = hex;
    if (clean[0] === "#") clean = clean.slice(1);
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${a})`;
  }

  function makeCanvasIcon(text = "LK", bg = "#00e5d1", size = 256) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.45;

    const g = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r * 1.15);
    g.addColorStop(0, bg);
    g.addColorStop(0.5, hexToRgba(bg, 0.55));
    g.addColorStop(1, hexToRgba(bg, 0.06));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fill();

    ctx.fillStyle = "#021515";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.floor(size * 0.46)}px Inter, system-ui`;
    ctx.fillText(text.slice(0, 2).toUpperCase(), cx, cy + 2);

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = hexToRgba("#ffffff", 0.06);
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.28, r * 1.05, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }

  function loadTextureSafe(url, fallbackText = "LK", fallbackColor = "#00e5d1") {
    return new Promise((resolve) => {
      if (!url) {
        resolve(makeCanvasIcon(fallbackText, fallbackColor));
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      let done = false;

      img.onload = () => {
        try {
          const tex = new THREE.Texture(img);
          tex.needsUpdate = true;
          try {
            tex.colorSpace = THREE.SRGBColorSpace;
          } catch (e) {}
          done = true;
          resolve(tex);
        } catch (e) {
          done = true;
          resolve(makeCanvasIcon(fallbackText, fallbackColor));
        }
      };

      img.onerror = (e) => {
        if (!done) {
          console.warn("Icon load failed", url, e);
          resolve(makeCanvasIcon(fallbackText, fallbackColor));
        }
      };

      img.src = url;

      setTimeout(() => {
        if (!done) resolve(makeCanvasIcon(fallbackText, fallbackColor));
      }, 4500);
    });
  }

  async function createIconNodes(options = {}) {
    const orbitBase = options.orbitBase || 9.6;
    const planeSize = options.planeSize || 1.9;
    const nodeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

    const nodes = [];
    const beams = [];
    const labels = [];

    const texPromises = CHANNELS.map((ch) =>
      loadTextureSafe(ch.icon, (ch.id || "")[0] || "LK", "#00e5d1")
    );
    const textures = await Promise.all(texPromises);

    CHANNELS.forEach((ch, i) => {
      const tex = textures[i];

      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      });

      const plane = new THREE.Mesh(nodeGeo, mat);
      plane.userData = {
        angle: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.0012,
        elev: Math.random() * 0.8 - 0.4,
        beatPhase: Math.random() * Math.PI * 2,
        orbit: orbitBase + i * 0.9,
        link: ch.link || null,
      };
      plane.renderOrder = 9999;

      scene.add(plane);
      nodes.push(plane);

      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(),
          new THREE.Vector3(),
        ]),
        new THREE.LineBasicMaterial({
          color: 0x00e5d1,
          transparent: true,
          opacity: 0.22,
        })
      );
      scene.add(line);
      beams.push(line);

      const lbl = document.createElement("div");
      lbl.className = "lk-label lk-label--small";
      lbl.innerText = ch.id;
      document.body.appendChild(lbl);
      labels.push(lbl);
    });

    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;

    function onPointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(nodes, true);

      if (hits.length) {
        const obj = hits[0].object;
        if (hovered !== obj) {
          if (hovered) hovered.scale.setScalar(1);
          hovered = obj;
          hovered.scale.setScalar(1.25);
        }
      } else {
        if (hovered) hovered.scale.setScalar(1);
        hovered = null;
      }
    }

    function onPointerDown(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(nodes, true);

      if (hits.length) {
        const obj = hits[0].object;
        const link = obj.userData.link;
        if (link) window.open(link, "_blank", "noopener");
      }
    }

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    function updateIcons(now) {
      const t = now * 0.001;

      nodes.forEach((n, i) => {
        n.userData.angle += n.userData.speed;
        const rr = n.userData.orbit + Math.sin(t * 0.6 + i) * 0.35;

        n.position.set(
          Math.cos(n.userData.angle) * rr,
          Math.sin(n.userData.angle * 2) * 0.9 + n.userData.elev * 2.2,
          Math.sin(n.userData.angle) * rr
        );

        n.lookAt(camera.position);

        const s = 1 + 0.12 * Math.sin(t + n.userData.beatPhase);
        n.scale.setScalar(s);

        const beam = beams[i];
        beam.geometry.setFromPoints([new THREE.Vector3(), n.position.clone()]);

        const v = n.position.clone().project(camera);
        const x = (v.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-v.y * 0.5 + 0.5) * window.innerHeight;

        const lbl = labels[i];
        if (lbl) {
          lbl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%,-50%)`;
          lbl.style.opacity = beam.material.opacity > 0.18 ? "1" : "0.48";
        }
      });
    }

    return {
      nodes,
      beams,
      labels,
      update: updateIcons,
      dispose: () => {
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        labels.forEach((l) => l.remove());
      },
    };
  }

  let iconSystem = null;

  createIconNodes({ orbitBase: 9.6, planeSize: 1.9 }).then((system) => {
    iconSystem = system;
  });

  function animate() {
    requestAnimationFrame(animate);

    globe.rotation.y += 0.005;
    globe.rotation.x += 0.002;

    if (iconSystem) {
      iconSystem.update(performance.now());
    }

    renderer.render(scene, camera);
  }

  console.log("Starting animation loop");
  animate();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  window.addEventListener("resize", onResize);
}

let globeStarted = false;

function startGlobeOnce() {
  if (globeStarted) return;
  if (typeof THREE === "undefined") return;
  globeStarted = true;
  initGlobe();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      if (typeof THREE !== "undefined") {
        startGlobeOnce();
      } else {
        window.addEventListener("load", startGlobeOnce, { once: true });
      }
    },
    { once: true }
  );
} else {
  if (typeof THREE !== "undefined") {
    startGlobeOnce();
  } else {
    window.addEventListener("load", startGlobeOnce, { once: true });
  }
}
