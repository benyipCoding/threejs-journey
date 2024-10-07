import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Shadow = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const init = () => {
    if (!canvas.current) return;

    // scene
    const scene = new THREE.Scene();

    // axes helpers
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.001,
      1000
    );
    camera.position.set(0, 0.5, 2);
    camera.lookAt(0, 0, 0);

    // controls
    const controls = new OrbitControls(camera, canvas.current);
    controls.enableDamping = true;

    // lights
    const lightColor = 0xffffff;
    const ambientLight = new THREE.AmbientLight(lightColor, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(lightColor, 2);
    directionalLight.position.set(2, 2, 2);
    directionalLight.castShadow = false;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 5;

    directionalLight.shadow.camera.top = 1.5;
    directionalLight.shadow.camera.right = 1.5;
    directionalLight.shadow.camera.bottom = -1.5;
    directionalLight.shadow.camera.left = -1.5;

    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(lightColor, 1);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.castShadow = true;
    spotLight.position.set(-1, 0.5, 1);

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;
    spotLight.shadow.camera.fov = 30;

    // spotLight.target.position.set(sphere.position);
    scene.add(spotLight);

    // lightCamera helper
    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );
    directionalLightCameraHelper.visible = false;
    scene.add(directionalLightCameraHelper);

    const soptLightCameraHelper = new THREE.CameraHelper(
      spotLight.shadow.camera
    );
    scene.add(soptLightCameraHelper);

    // material
    const material = new THREE.MeshStandardMaterial({ roughness: 0.7 });
    material.side = THREE.DoubleSide;

    // object
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.receiveShadow = true;
    scene.add(plane);

    const radius = 0.3;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 64),
      material
    );
    sphere.position.y = radius + 0.01;
    sphere.castShadow = true;
    scene.add(sphere);
    console.log(sphere.position);

    spotLight.target.position.set(
      sphere.position.x,
      sphere.position.y,
      sphere.position.z
    );
    scene.add(spotLight.target);

    // renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);

    // tick func
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
      <canvas className="size-full" ref={canvas}></canvas>
    </div>
  );
};

export default Shadow;
