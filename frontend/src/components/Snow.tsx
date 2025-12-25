import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Snow = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create round snow texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(16, 16, 16, 0, 2 * Math.PI);
      context.fillStyle = 'white';
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount);

    for(let i = 0; i < particlesCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 200; // x
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 200; // y
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
      
      velocityArray[i] = Math.random() * 0.2 + 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      map: texture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for(let i = 0; i < particlesCount; i++) {
        // Update Y
        positions[i * 3 + 1] -= velocityArray[i];

        // Reset if below bottom
        if (positions[i * 3 + 1] < -100) {
          positions[i * 3 + 1] = 100;
          positions[i * 3] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      particlesMesh.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-40" />;
};

export default Snow;
