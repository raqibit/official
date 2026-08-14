'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleWave() {
  const pointsRef = useRef<THREE.Points>(null!)

  const count = 3000
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)

    let i = 0
    for (let ix = 0; ix < 60; ix++) {
      for (let iy = 0; iy < 50; iy++) {
        pos[i * 3] = (ix - 30) * 0.4
        pos[i * 3 + 1] = 0 // Y will be animated
        pos[i * 3 + 2] = (iy - 25) * 0.4
        ph[i] = ix * 0.5 + iy * 0.3
        i++
      }
    }
    return [pos, ph]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const ix = i % 60
      const iy = Math.floor(i / 60)
      const x = (ix - 30) * 0.4
      const z = (iy - 25) * 0.4

      // Complex wave equation
      const wave1 = Math.sin(x * 0.3 + time * 0.8) * 1.5
      const wave2 = Math.cos(z * 0.2 - time * 0.4) * 1.0
      const wave3 = Math.sin(Math.sqrt(x * x + z * z) * 0.2 - time) * 1.2

      positions[i * 3 + 1] = wave1 + wave2 + wave3
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = time * 0.05
  })

  // Create a custom shader material for beautiful glowing particles
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color1: { value: new THREE.Color('#00e5ff') },
          color2: { value: new THREE.Color('#7c3aed') },
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = (4.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec3 vPos;
          
          void main() {
            // Circle shape
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float ll = length(xy);
            if (ll > 0.5) discard;
            
            // Mix colors based on height (Y axis)
            float mixVal = smoothstep(-2.0, 2.0, vPos.y);
            vec3 finalColor = mix(color2, color1, mixVal);
            
            // Glow effect
            float alpha = smoothstep(0.5, 0.1, ll) * 0.8;
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  )
}

export function LoginBackgroundScene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#050505]">
      <Canvas
        camera={{ position: [0, 8, 15], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#050505', 10, 25]} />
        <ParticleWave />
      </Canvas>
    </div>
  )
}
