import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VueTest = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const width = 800;
  const height = 600;

  const init = () => {
    const scene = new THREE.Scene();
    // camera
    const camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 1000);
    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);

    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);
    scene.add(camera);
    const helper = new THREE.AxesHelper();
    scene.add(helper);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.render(scene, camera);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="w-full h-full bg-slate-700 flex">
      <canvas ref={canvas}></canvas>
    </div>
  );
};

export default VueTest;
