import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const Text3D = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const fontLoader = new FontLoader();

  const init = () => {
    if (!canvas.current) return;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.001,
      1000
    );
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    // textures
    const textureLoader = new THREE.TextureLoader();
    const matcap = textureLoader.load('/matcaps/8.png');

    // font
    fontLoader.load(
      '/3d-text/fonts/helvetiker_regular.typeface.json',
      (font) => {
        const geometry = new TextGeometry('Hello World!', {
          font: font,
          size: 0.5,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        geometry.center();

        const material = new THREE.MeshMatcapMaterial({ matcap });

        const textMesh = new THREE.Mesh(geometry, material);

        scene.add(textMesh);

        const torusGeo = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

        for (let i = 0; i < 200; i++) {
          const torus = new THREE.Mesh(torusGeo, material);
          torus.position.x = (Math.random() - 0.5) * 10;
          torus.position.y = (Math.random() - 0.5) * 10;
          torus.position.z = (Math.random() - 0.5) * 10;

          torus.rotation.x = Math.random() * Math.PI;
          torus.rotation.y = Math.random() * Math.PI;

          const scale = Math.random();
          torus.scale.set(scale, scale, scale);

          scene.add(torus);
        }
      }
    );

    // controls
    const controls = new OrbitControls(camera, canvas.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    const tick = () => {
      requestAnimationFrame(() => {
        tick();
      });
      controls.update();
      renderer.render(scene, camera);
    };

    return tick;
  };

  useEffect(() => {
    const tick = init();
    if (!tick) return;
    tick();
  }, []);

  return (
    <div className="h-full">
      <canvas className="w-full h-full" ref={canvas}></canvas>
    </div>
  );
};

export default Text3D;
