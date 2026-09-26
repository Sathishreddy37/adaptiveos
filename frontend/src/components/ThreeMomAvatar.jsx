import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, Sparkles, MessageCircle, Heart, CheckCircle2 } from 'lucide-react';

/**
 * High-Quality Stylized 3D Indian Mother / Living Guide Character
 * Built with Three.js WebGL.
 * Features:
 * - Stylized mature, warm Indian woman (approx 50-60 yrs)
 * - Traditional elegant saree drape with gold border accents
 * - Bindi, kind eyes, soft hair bun with silver highlights
 * - Articulated procedural rig: head tilt, eye blinking, mouth speech lip-sync,
 *   breathing, hand gestures (namaste / wave / point / celebrate / wake-up)
 * - Multiple animation states: 'idle', 'greeting', 'speaking', 'wakeup', 'thinking', 'celebrating'
 */
export default function ThreeMomAvatar({
  mode = 'companion', // 'guide' (onboarding/hero), 'wakeup' (alarm screen), 'companion' (floating badge)
  animationState = 'idle', // 'idle' | 'greeting' | 'speaking' | 'wakeup' | 'thinking' | 'celebrating'
  speechText = '',
  isSpeaking = false,
  onSpeakEnd = null,
  accentColor = '#ff5fa2',
  className = ''
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    animationState,
    isSpeaking,
    speechText
  });

  // Keep stateRef in sync for the animation loop
  useEffect(() => {
    stateRef.current.animationState = animationState;
    stateRef.current.isSpeaking = isSpeaking;
    stateRef.current.speechText = speechText;
  }, [animationState, isSpeaking, speechText]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    if (mode === 'wakeup') {
      camera.position.set(0, 1.45, 3.8);
    } else if (mode === 'guide') {
      camera.position.set(0, 1.35, 3.4);
    } else {
      camera.position.set(0, 1.4, 3.2);
    }

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.95);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaf0, 1.6);
    mainLight.position.set(2.5, 4.0, 3.0);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const softFill = new THREE.DirectionalLight(0xd9b3ff, 0.65);
    softFill.position.set(-3.0, 2.0, 2.0);
    scene.add(softFill);

    const warmRim = new THREE.PointLight(0xffaa55, 1.2, 10);
    warmRim.position.set(0, 2.5, -2.0);
    scene.add(warmRim);

    // Root Group for Character
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // Floor Soft Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x070712,
      transparent: true,
      opacity: 0.45
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    scene.add(shadowMesh);

    // Materials Palette (Warm Indian Mom Aesthetic)
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd69970, // Warm Indian skin tone
      roughness: 0.55,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x221d25, // Soft black with silver streak
      roughness: 0.8,
      metalness: 0.1
    });

    const silverHairMat = new THREE.MeshStandardMaterial({
      color: 0x8a8494, // Elegant mature silver streaks
      roughness: 0.7,
      metalness: 0.15
    });

    const sareeSlikMat = new THREE.MeshStandardMaterial({
      color: 0x8a385e, // Royal warm maroon-violet saree
      roughness: 0.4,
      metalness: 0.25
    });

    const sareePalluMat = new THREE.MeshStandardMaterial({
      color: 0xa84872, // Soft draped pallu fold
      roughness: 0.45,
      metalness: 0.18
    });

    const goldBorderMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Elegant traditional gold zari border
      roughness: 0.3,
      metalness: 0.85
    });

    const bindiMat = new THREE.MeshStandardMaterial({
      color: 0xba1324, // Traditional vermilion red bindi
      roughness: 0.3,
      metalness: 0.1
    });

    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.2
    });

    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d, // Warm deep brown iris
      roughness: 0.2,
      metalness: 0.1
    });

    const lipsMat = new THREE.MeshStandardMaterial({
      color: 0xb55a6d, // Soft warm rose lips
      roughness: 0.45,
      metalness: 0.05
    });

    // ---------------- Model Construction ----------------
    // Lower Body / Saree Skirt
    const skirtGeo = new THREE.CylinderGeometry(0.35, 0.55, 1.25, 24);
    const skirtMesh = new THREE.Mesh(skirtGeo, sareeSlikMat);
    skirtMesh.position.y = 0.65;
    characterGroup.add(skirtMesh);

    // Saree gold border bottom
    const borderGeo = new THREE.CylinderGeometry(0.555, 0.56, 0.1, 24);
    const borderMesh = new THREE.Mesh(borderGeo, goldBorderMat);
    borderMesh.position.y = 0.1;
    characterGroup.add(borderMesh);

    // Torso Group (for breathing movement)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.25;
    characterGroup.add(torsoGroup);

    // Blouse / Torso
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.55, 20);
    const torsoMesh = new THREE.Mesh(torsoGeo, sareeSlikMat);
    torsoMesh.position.y = 0.25;
    torsoGroup.add(torsoMesh);

    // Diagonal Saree Pallu Drape (Crosses left shoulder down to right waist)
    const palluCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, 0.05, 0.25),
      new THREE.Vector3(0.12, 0.32, 0.27),
      new THREE.Vector3(-0.24, 0.54, 0.12),
      new THREE.Vector3(-0.30, 0.40, -0.15),
      new THREE.Vector3(-0.25, 0.10, -0.22)
    ]);
    const palluGeo = new THREE.TubeGeometry(palluCurve, 20, 0.09, 8, false);
    const palluMesh = new THREE.Mesh(palluGeo, sareePalluMat);
    torsoGroup.add(palluMesh);

    // Gold zari stripe along pallu
    const zariGeo = new THREE.TubeGeometry(palluCurve, 20, 0.025, 6, false);
    const zariMesh = new THREE.Mesh(zariGeo, goldBorderMat);
    zariMesh.position.z += 0.02;
    torsoGroup.add(zariMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.22, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.y = 0.58;
    torsoGroup.add(neckMesh);

    // Head Group (for speech tilting, nodding, eye blinking)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.82, 0);
    torsoGroup.add(headGroup);

    // Head Base (stylized soft oval)
    const headGeo = new THREE.SphereGeometry(0.24, 24, 24);
    headGeo.scale(1.0, 1.15, 1.05);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(headMesh);

    // Mature Hair Volume (top & back bun)
    const hairGeo = new THREE.SphereGeometry(0.255, 20, 20);
    hairGeo.scale(1.04, 1.16, 1.15);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.04, -0.05);
    headGroup.add(hairMesh);

    // Traditional Neat Hair Bun (back of head)
    const bunGeo = new THREE.SphereGeometry(0.13, 16, 16);
    const bunMesh = new THREE.Mesh(bunGeo, hairMat);
    bunMesh.position.set(0, 0.05, -0.26);
    headGroup.add(bunMesh);

    // Elegant silver streak highlight on bun
    const silverStreakGeo = new THREE.TorusGeometry(0.11, 0.025, 8, 16);
    const silverStreakMesh = new THREE.Mesh(silverStreakGeo, silverHairMat);
    silverStreakMesh.position.set(0, 0.05, -0.25);
    headGroup.add(silverStreakMesh);

    // Bindi (Center of forehead)
    const bindiGeo = new THREE.CircleGeometry(0.022, 16);
    const bindiMesh = new THREE.Mesh(bindiGeo, bindiMat);
    bindiMesh.position.set(0, 0.09, 0.248);
    headGroup.add(bindiMesh);

    // Eyes Group
    const eyesGroup = new THREE.Group();
    headGroup.add(eyesGroup);

    // Left Eye
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), eyeWhiteMat);
    eyeL.position.set(-0.082, 0.025, 0.22);
    eyeL.scale.set(1.0, 0.65, 0.5);
    eyesGroup.add(eyeL);

    const irisL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), irisMat);
    irisL.position.set(-0.082, 0.025, 0.237);
    irisL.scale.set(1, 1, 0.4);
    eyesGroup.add(irisL);

    // Right Eye
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), eyeWhiteMat);
    eyeR.position.set(0.082, 0.025, 0.22);
    eyeR.scale.set(1.0, 0.65, 0.5);
    eyesGroup.add(eyeR);

    const irisR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), irisMat);
    irisR.position.set(0.082, 0.025, 0.237);
    irisR.scale.set(1, 1, 0.4);
    eyesGroup.add(irisR);

    // Eyelids for blinking
    const eyelidGeo = new THREE.SphereGeometry(0.046, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const eyelidL = new THREE.Mesh(eyelidGeo, skinMat);
    eyelidL.position.set(-0.082, 0.028, 0.225);
    eyelidL.rotation.x = -0.3;
    eyesGroup.add(eyelidL);

    const eyelidR = new THREE.Mesh(eyelidGeo, skinMat);
    eyelidR.position.set(0.082, 0.028, 0.225);
    eyelidR.rotation.x = -0.3;
    eyesGroup.add(eyelidR);

    // Mouth / Warm Smile (Lips that animate when speaking)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.12, 0.225);
    headGroup.add(mouthGroup);

    const mouthGeo = new THREE.TorusGeometry(0.045, 0.015, 8, 16, Math.PI);
    const mouthMesh = new THREE.Mesh(mouthGeo, lipsMat);
    mouthMesh.rotation.x = Math.PI * 0.15;
    mouthGroup.add(mouthMesh);

    // Golden Stud Earrings
    const earringGeo = new THREE.SphereGeometry(0.02, 12, 12);
    const earringL = new THREE.Mesh(earringGeo, goldBorderMat);
    earringL.position.set(-0.25, -0.04, 0.02);
    headGroup.add(earringL);

    const earringR = new THREE.Mesh(earringGeo, goldBorderMat);
    earringR.position.set(0.25, -0.04, 0.02);
    headGroup.add(earringR);

    // Arms & Hands (Articulated Left & Right for Gestures)
    // Left Arm (Greeting / Namaste / Wave)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.35, 0.42, 0);
    torsoGroup.add(leftArmGroup);

    const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.45, 12), sareeSlikMat);
    leftArmMesh.position.y = -0.22;
    leftArmGroup.add(leftArmMesh);

    // Left Forearm
    const leftForearmGroup = new THREE.Group();
    leftForearmGroup.position.y = -0.45;
    leftArmGroup.add(leftForearmGroup);

    const leftForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.38, 12), skinMat);
    leftForearmMesh.position.y = -0.19;
    leftForearmGroup.add(leftForearmMesh);

    // Left Hand (with traditional gold bangles)
    const bangleL = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.01, 8, 16), goldBorderMat);
    bangleL.rotation.x = Math.PI / 2;
    bangleL.position.y = -0.32;
    leftForearmGroup.add(bangleL);

    const leftHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), skinMat);
    leftHandMesh.scale.set(0.8, 1.2, 0.4);
    leftHandMesh.position.y = -0.42;
    leftForearmGroup.add(leftHandMesh);

    // Right Arm (Supportive / Pointing / Greeting)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.35, 0.42, 0);
    torsoGroup.add(rightArmGroup);

    const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.45, 12), sareeSlikMat);
    rightArmMesh.position.y = -0.22;
    rightArmGroup.add(rightArmMesh);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.y = -0.45;
    rightArmGroup.add(rightForearmGroup);

    const rightForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.38, 12), skinMat);
    rightForearmMesh.position.y = -0.19;
    rightForearmGroup.add(rightForearmMesh);

    const bangleR = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.01, 8, 16), goldBorderMat);
    bangleR.rotation.x = Math.PI / 2;
    bangleR.position.y = -0.32;
    rightForearmGroup.add(bangleR);

    const rightHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), skinMat);
    rightHandMesh.scale.set(0.8, 1.2, 0.4);
    rightHandMesh.position.y = -0.42;
    rightForearmGroup.add(rightHandMesh);

    // Ambient floating sparkle particles
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.2;
      particlePositions[i * 3 + 1] = Math.random() * 2.2 + 0.3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd180,
      size: 0.04,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop variables
    let animationFrameId;
    let startTime = performance.now();
    let blinkTimer = 0;
    let isBlinking = false;
    let walkPhase = 0;
    let targetGazeX = 0;
    let targetGazeY = 0;

    // Pointer move listener for gentle natural eye/head tracking
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetGazeX = Math.max(-0.4, Math.min(0.4, x * 0.35));
      targetGazeY = Math.max(-0.25, Math.min(0.25, y * 0.25));
    };
    window.addEventListener('pointermove', onPointerMove);

    // Wakeup entrance position animation
    if (mode === 'wakeup') {
      characterGroup.position.z = -1.2;
      characterGroup.position.y = 0;
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;
      const currentAnim = stateRef.current.animationState;
      const speaking = stateRef.current.isSpeaking;

      // 1. Subtle Idle Breathing (chest rises gently)
      const breathing = Math.sin(elapsed * 2.2) * 0.025;
      torsoGroup.position.y = 1.25 + breathing;
      torsoGroup.scale.set(1 + breathing * 0.4, 1 + breathing * 0.3, 1 + breathing * 0.4);

      // 2. Eye Blinking Logic (natural periodic blink every 3.5s)
      blinkTimer += 0.016;
      if (blinkTimer > 3.2 && !isBlinking) {
        isBlinking = true;
      }
      if (isBlinking) {
        eyelidL.scale.y = 2.4;
        eyelidR.scale.y = 2.4;
        if (blinkTimer > 3.42) {
          isBlinking = false;
          blinkTimer = 0;
          eyelidL.scale.y = 1.0;
          eyelidR.scale.y = 1.0;
        }
      }

      // 3. Speech Lip-Sync & Head Tilting with smooth cursor gaze tracking
      if (speaking) {
        // Mouth opens and closes rhythmically
        const mouthOpen = Math.abs(Math.sin(elapsed * 14)) * 1.5;
        mouthGroup.scale.set(1.0, 1.0 + mouthOpen, 1.0);
        // Head moves slightly while speaking
        headGroup.rotation.y += (targetGazeX + Math.sin(elapsed * 3.5) * 0.08 - headGroup.rotation.y) * 0.08;
        headGroup.rotation.x += (-targetGazeY + Math.sin(elapsed * 4.2) * 0.05 + 0.03 - headGroup.rotation.x) * 0.08;
        headGroup.rotation.z = Math.sin(elapsed * 2.5) * 0.03;
      } else {
        mouthGroup.scale.set(1.0, 1.0, 1.0);
        headGroup.rotation.y += (targetGazeX + Math.sin(elapsed * 1.2) * 0.04 - headGroup.rotation.y) * 0.06;
        headGroup.rotation.x += (-targetGazeY + Math.sin(elapsed * 1.5) * 0.02 - headGroup.rotation.x) * 0.06;
        headGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.02;
      }

      // 4. Gestures based on Animation State
      if (currentAnim === 'greeting' || mode === 'guide') {
        // Gentle Namaste / Waving Hand
        leftArmGroup.rotation.z = 0.4 + Math.sin(elapsed * 2.0) * 0.08;
        leftArmGroup.rotation.x = -0.5;
        leftForearmGroup.rotation.x = -1.2 + Math.sin(elapsed * 3.0) * 0.15;
        leftForearmGroup.rotation.y = 0.4;

        rightArmGroup.rotation.z = -0.3;
        rightArmGroup.rotation.x = -0.3;
        rightForearmGroup.rotation.x = -0.7;
      } else if (currentAnim === 'wakeup') {
        // Enters screen / Walking in gently toward viewer
        if (characterGroup.position.z < 0) {
          characterGroup.position.z += 0.015;
          walkPhase += 0.1;
          characterGroup.position.y = Math.abs(Math.sin(walkPhase)) * 0.04;
        }
        // Both arms open warmly in wake-up encouraging gesture
        leftArmGroup.rotation.z = 0.5 + Math.sin(elapsed * 2.0) * 0.05;
        leftArmGroup.rotation.x = -0.6;
        leftForearmGroup.rotation.x = -0.8;

        rightArmGroup.rotation.z = -0.5 - Math.sin(elapsed * 2.0) * 0.05;
        rightArmGroup.rotation.x = -0.6;
        rightForearmGroup.rotation.x = -0.8;
      } else if (currentAnim === 'thinking') {
        // Head tilts, hand to chin
        headGroup.rotation.z = 0.14;
        headGroup.rotation.x = -0.08;
        rightArmGroup.rotation.x = -1.1;
        rightArmGroup.rotation.z = -0.4;
        rightForearmGroup.rotation.x = -1.3;
      } else if (currentAnim === 'celebrating') {
        // Joyful clapping / arms up
        leftArmGroup.rotation.z = 0.8 + Math.sin(elapsed * 6.0) * 0.2;
        leftArmGroup.rotation.x = -0.8;
        rightArmGroup.rotation.z = -0.8 - Math.sin(elapsed * 6.0) * 0.2;
        rightArmGroup.rotation.x = -0.8;
        characterGroup.position.y = Math.abs(Math.sin(elapsed * 5.0)) * 0.06;
      } else {
        // Natural resting idle pose
        leftArmGroup.rotation.set(0.1, 0, 0.15 + Math.sin(elapsed * 1.5) * 0.03);
        leftForearmGroup.rotation.set(-0.25, 0, 0);
        rightArmGroup.rotation.set(0.1, 0, -0.15 - Math.sin(elapsed * 1.5) * 0.03);
        rightForearmGroup.rotation.set(-0.25, 0, 0);
      }

      // Sparkle rotation
      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing ${
          mode === 'companion' ? 'min-h-[180px] max-h-[220px]' :
          mode === 'guide' ? 'min-h-[300px] sm:min-h-[380px]' :
          'min-h-[340px] sm:min-h-[440px]'
        }`}
      />

      {/* Speaking Voice Waveform / Status Pill */}
      {isSpeaking && (
        <div className="absolute bottom-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151527]/90 border border-[#ff5fa2]/40 backdrop-blur-md shadow-lg shadow-[#ff5fa2]/20 animate-fade-in">
          <Volume2 className="w-3.5 h-3.5 text-[#ff5fa2] animate-pulse" />
          <span className="text-[11px] font-semibold text-white">
            Mom Living Guide Speaking...
          </span>
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-3 bg-[#ff5fa2] rounded-full animate-bounce" />
            <span className="w-1 h-4 bg-[#00e0c8] rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-1 h-2 bg-[#7c6cff] rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      )}
    </div>
  );
}
