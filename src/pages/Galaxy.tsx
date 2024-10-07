import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { useEffect, useRef } from 'react';

const Galaxy = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI({ width: 400 });

    // Canvas

    // Scene
    const scene = new THREE.Scene();

    /**
     * Galaxy
     */
    const parameters = {
      count: 160500,
      size: 0.001,
      radius: 5,
      branches: 5,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984',
      rotationSpeed: 0.001,
    };

    let geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> | null =
      null;
    let material: THREE.PointsMaterial | null = null;
    let points: THREE.Points<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.PointsMaterial,
      THREE.Object3DEventMap
    > | null = null;
    const generateGalaxy = () => {
      if (points !== null) {
        geometry?.dispose();
        material?.dispose();
        scene.remove(points);
      }
      /**
       * Geometry
       */
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Positions
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() > 0.5 ? 1 : -1);
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() > 0.5 ? 1 : -1);
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() > 0.5 ? 1 : -1);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = 0 + randomY;
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Colors
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );

      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      /**
       * Material
       */
      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      /**
       * Points
       */
      points = new THREE.Points(geometry, material);
      points.rotation.y = 0;
      scene.add(points);
    };
    generateGalaxy();

    gui
      .add(parameters, 'count')
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'size')
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'radius')
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'branches')
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'spin')
      .min(-5)
      .max(5)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'randomness')
      .min(0)
      .max(2)
      .step(0.001)
      .onChange(generateGalaxy);
    gui
      .add(parameters, 'randomnessPower')
      .min(1)
      .max(10)
      .step(0.001)
      .onChange(generateGalaxy);
    gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
    gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
    gui.add(parameters, 'rotationSpeed').min(0.001).max(0.1).step(0.001);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Controls
    const controls = new OrbitControls(camera, canvas.current!);
    controls.enableDamping = true;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // console.log(elapsedTime);
      points!.rotation.y += parameters.rotationSpeed;
      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return <canvas className="w-full h-full" ref={canvas}></canvas>;
};

export default Galaxy;
