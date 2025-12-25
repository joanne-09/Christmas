import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

export interface ChristmasTreeHandle {
    reset: () => void;
}

interface ChristmasTreeProps {
    onAnimationComplete?: () => void;
}

const ChristmasTree = forwardRef<ChristmasTreeHandle, ChristmasTreeProps>(({ onAnimationComplete }, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});

  useImperativeHandle(ref, () => ({
    reset: () => {
        if (resetRef.current) {
            resetRef.current();
        }
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);
    scene.fog = new THREE.FogExp2(0x020205, 0.001);

    const getInitialZoom = () => {
        const width = window.innerWidth;
        if (width < 480) return 900; // Mobile
        if (width < 768) return 750; // Tablet
        return 550; // Desktop
    };

    let zoom = getInitialZoom();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 0, zoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const topLight = new THREE.PointLight(0xffffff, 3, 1500);
    topLight.position.set(0, 400, 100);
    scene.add(topLight);

    const sideLight = new THREE.DirectionalLight(0xffd700, 2.5);
    sideLight.position.set(50, 100, 100);
    scene.add(sideLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
    backLight.position.set(-50, 50, -100);
    scene.add(backLight);

    // Tree Group
    const treeBaseY = -150;
    const treeGroup = new THREE.Group();
    treeGroup.position.y = treeBaseY;
    scene.add(treeGroup);

    // State variables
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationX = 0.2;
    let rotationY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    
    // Animation state
    let allBalls: THREE.Mesh[] = [];
    let ballsShown = 0;
    const speed = 20; 
    let animationComplete = false;
    const treeHeight = 400;

    // Camera Tracking State
    const currentLookAt = new THREE.Vector3(0, treeBaseY, 0);
    const targetLookAt = new THREE.Vector3(0, treeBaseY, 0);

    // Objects
    let treeStar: THREE.Mesh;
    let starLight: THREE.PointLight;

    // Functions
    const prepareTreeData = () => {
        const numSpirals = 3; 
        const ballsPerSpiral = 1800;
        const baseRadius = 180;
        
        const detail = 8;
        const sphereGeometries = [
            new THREE.SphereGeometry(0.8, detail, detail),
            new THREE.SphereGeometry(1.5, detail, detail),
            new THREE.SphereGeometry(2.5, detail, detail),
            new THREE.SphereGeometry(4.0, detail, detail)
        ];

        const goldMaterials = [
            new THREE.MeshStandardMaterial({ 
                color: 0xffd700, 
                emissive: 0xffaa00,
                emissiveIntensity: 0.4,
                metalness: 1.0, 
                roughness: 0.0 
            }), 
            new THREE.MeshStandardMaterial({ 
                color: 0xffa500, 
                emissive: 0xff8800,
                emissiveIntensity: 0.3,
                metalness: 1.0, 
                roughness: 0.1 
            }), 
            new THREE.MeshStandardMaterial({ 
                color: 0xdaa520, 
                emissive: 0xffd700,
                emissiveIntensity: 0.5,
                metalness: 0.9, 
                roughness: 0.0 
            }), 
            new THREE.MeshStandardMaterial({ 
                color: 0xffd700, 
                emissive: 0xffec8b,
                emissiveIntensity: 0.2,
                metalness: 1.0, 
                roughness: 0.0 
            })
        ];

        let rawBalls: { mesh: THREE.Mesh, progress: number }[] = [];
        for (let s = 0; s < numSpirals; s++) {
            const spiralOffset = (s / numSpirals) * Math.PI * 2;

            for (let i = 0; i < ballsPerSpiral; i++) {
                const progress = i / ballsPerSpiral; 
                const currentRadius = baseRadius * (1 - progress);
                const y = progress * treeHeight;
                const angle = progress * (Math.PI * 18) + spiralOffset;

                const centerX = Math.cos(angle) * currentRadius;
                const centerZ = Math.sin(angle) * currentRadius;

                const thickness = (1 - progress) * 35 + 5;
                const spreadX = (Math.random() - 0.5) * thickness;
                const spreadY = (Math.random() - 0.5) * (thickness * 0.5);
                const spreadZ = (Math.random() - 0.5) * thickness;

                const x = centerX + spreadX;
                const z = centerZ + spreadZ;
                const finalY = y + spreadY;

                const sizeIdx = Math.floor(Math.random() * sphereGeometries.length);
                const matIdx = Math.floor(Math.random() * goldMaterials.length);
                
                const ball = new THREE.Mesh(sphereGeometries[sizeIdx], goldMaterials[matIdx]);
                ball.position.set(x, finalY, z);
                
                const distFromCenterOfBelt = Math.sqrt(spreadX*spreadX + spreadZ*spreadZ);
                const densityScale = (1 - (distFromCenterOfBelt / thickness)) * (Math.random() * 1.5 + 0.5);
                ball.scale.setScalar(Math.max(0.3, densityScale));
                
                rawBalls.push({ mesh: ball, progress: progress });
            }
        }

        rawBalls.sort((a, b) => a.progress - b.progress);
        allBalls = rawBalls.map(b => b.mesh);
    };

    // Create Star on top of the tree
    const createStar = () => {
        const starShape = new THREE.Shape();
        const outerRadius = 18;
        const innerRadius = 8;
        const points = 5;

        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) starShape.moveTo(x, y);
            else starShape.lineTo(x, y);
        }
        starShape.closePath();

        const extrudeSettings = {
            depth: 6,
            bevelEnabled: true,
            bevelThickness: 3,
            bevelSize: 2,
            bevelSegments: 5
        };
        const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
        starGeometry.center();

        const starMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffd700, 
            emissive: 0xffd700,
            emissiveIntensity: 1.5,
            metalness: 1.0, 
            roughness: 0.0 
        });

        treeStar = new THREE.Mesh(starGeometry, starMaterial);
        treeStar.position.y = treeHeight + 15;
        treeStar.visible = false;
        treeGroup.add(treeStar);

        starLight = new THREE.PointLight(0xffd700, 0, 250);
        starLight.position.set(0, treeHeight + 15, 0);
        treeGroup.add(starLight);
    };

    // Initialize
    prepareTreeData();
    createStar();

    // Event Handlers
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        targetRotationY += (e.clientX - previousMouseX) * 0.005;
        targetRotationX += (e.clientY - previousMouseY) * 0.005;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousMouseX = e.touches[0].clientX;
            previousMouseY = e.touches[0].clientY;
        }
    };

    const onTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        targetRotationY += (e.touches[0].clientX - previousMouseX) * 0.005;
        targetRotationX += (e.touches[0].clientY - previousMouseY) * 0.005;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => { isDragging = false; };

    const onMouseWheel = (e: WheelEvent) => {
        zoom += e.deltaY * 0.5;
        zoom = Math.max(100, Math.min(1500, zoom));
        e.preventDefault();
    };

    // Animation Loop
    let animationId: number;
    const animate = () => {
        animationId = requestAnimationFrame(animate);

        const buildProgress = ballsShown / allBalls.length;

        // Sequential Build Logic
        if (ballsShown < allBalls.length) {
            for (let i = 0; i < speed && ballsShown < allBalls.length; i++) {
                treeGroup.add(allBalls[ballsShown]);
                ballsShown++;
            }
            
            // Camera follow
            targetLookAt.y = (buildProgress * treeHeight) + treeBaseY;
        } else if (!animationComplete) {
            animationComplete = true;
            treeStar.visible = true;
            treeStar.scale.set(0.1, 0.1, 0.1);
            starLight.intensity = 5;
            
            // Reset camera target
            targetLookAt.y = 50; 
            
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }

        // Animate star pop-in
        if (animationComplete) {
            if (treeStar.scale.x < 1.0) {
                treeStar.scale.x += 0.05;
                treeStar.scale.y += 0.05;
                treeStar.scale.z += 0.05;
            }
            
            // Twinkle star light
            const time = Date.now() * 0.003;
            starLight.intensity = 4 + Math.sin(time) * 2;
            
            treeStar.rotation.y += 0.02;
        }

        // Smoothly interpolate the LookAt target
        currentLookAt.lerp(targetLookAt, 0.05);

        // Handle Camera Rotation
        rotationX += (targetRotationX - rotationX) * 0.05;
        rotationY += (targetRotationY - rotationY) * 0.05;
        treeGroup.rotation.x = rotationX;
        treeGroup.rotation.y = rotationY;

        if (!isDragging) targetRotationY += 0.005;

        // Smooth zoom & Position
        camera.position.z += (zoom - camera.position.z) * 0.05;
        
        const targetCamY = animationComplete ? 100 : currentLookAt.y + 50;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;

        camera.lookAt(currentLookAt);

        renderer.render(scene, camera);
    };

    animate();

    // Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('wheel', onMouseWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, false);

    // Expose reset function
    resetRef.current = () => {
        for(let i = treeGroup.children.length - 1; i >= 0; i--) {
            const obj = treeGroup.children[i];
            if(obj.type === "Mesh" && obj !== treeStar) {
                treeGroup.remove(obj);
            }
        }
        ballsShown = 0;
        animationComplete = false;
        treeStar.visible = false;
        starLight.intensity = 0;
        targetRotationY = 0;
        rotationY = 0;
        targetLookAt.set(0, treeBaseY, 0);
    };

    // Cleanup
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('wheel', onMouseWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        
        // Dispose geometries and materials to prevent leaks
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (object.material instanceof THREE.Material) {
                    object.material.dispose();
                }
            }
        });
        renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full block" />;
});

export default ChristmasTree;
