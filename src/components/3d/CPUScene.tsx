'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// --- Circuit trace lines pulsing with electrical signals ---
function CircuitTraces() {
  const groupRef = useRef<THREE.Group>(null!)
  
  const traces = useMemo(() => {
    const lines: { points: [number, number, number][], color: string, speed: number, offset: number }[] = []
    
    // Horizontal and vertical circuit traces
    const segments = [
      { start: [-5, 2, -1] as [number,number,number], end: [5, 2, -1] as [number,number,number] },
      { start: [-5, 0, -1] as [number,number,number], end: [5, 0, -1] as [number,number,number] },
      { start: [-5, -2, -1] as [number,number,number], end: [5, -2, -1] as [number,number,number] },
      { start: [-3, 3, -1] as [number,number,number], end: [-3, -3, -1] as [number,number,number] },
      { start: [0, 3, -1] as [number,number,number], end: [0, -3, -1] as [number,number,number] },
      { start: [3, 3, -1] as [number,number,number], end: [3, -3, -1] as [number,number,number] },
    ]
    
    segments.forEach((seg, i) => {
      lines.push({
        points: [seg.start, seg.end],
        color: i % 2 === 0 ? '#00e5ff' : '#7c3aed',
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      })
    })
    return lines
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {traces.map((trace, i) => {
        const points = trace.points.map(p => new THREE.Vector3(...p))
        const geo = new THREE.BufferGeometry().setFromPoints(points)
        return (
          // @ts-expect-error: Threejs line conflicts with SVG line in types
          <line key={i} geometry={geo}>
            <lineBasicMaterial color={trace.color} transparent opacity={0.15} />
          </line>
        )
      })}
    </group>
  )
}

// --- Flowing signal particles along circuit paths ---
function SignalParticles({ count = 120 }) {
  const meshRef = useRef<THREE.Points>(null!)
  
  const [positions, velocities, progresses] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)
    const prog = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // Place on either horizontal or vertical "traces"
      const isHorizontal = Math.random() > 0.5
      if (isHorizontal) {
        pos[i * 3] = (Math.random() - 0.5) * 10
        pos[i * 3 + 1] = [-2, 0, 2][Math.floor(Math.random() * 3)]
        pos[i * 3 + 2] = -1 + Math.random() * 0.5
      } else {
        pos[i * 3] = [-3, 0, 3][Math.floor(Math.random() * 3)]
        pos[i * 3 + 1] = (Math.random() - 0.5) * 6
        pos[i * 3 + 2] = -1 + Math.random() * 0.5
      }
      vel[i] = 0.01 + Math.random() * 0.02
      prog[i] = Math.random()
    }
    return [pos, vel, prog]
  }, [count])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      progresses[i] += velocities[i]
      if (progresses[i] > 1) progresses[i] = 0
      // Move horizontally
      pos[i * 3] = -5 + progresses[i] * 10
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00e5ff"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// --- Central CPU Die - the hero object ---
function CPUDie() {
  const groupRef = useRef<THREE.Group>(null!)
  const coreRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    
    // Pulse the cores
    coreRefs.current.forEach((core, i) => {
      if (!core) return
      const pulse = Math.sin(state.clock.elapsedTime * 2 + i * 0.8) * 0.5 + 0.5
      const mat = core.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.3 + pulse * 1.2
    })
  })

  const corePositions: [number, number, number][] = [
    [-0.45, 0.45, 0.06], [0.45, 0.45, 0.06],
    [-0.45, -0.45, 0.06], [0.45, -0.45, 0.06],
  ]

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* PCB substrate */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.4, 2.4, 0.08]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Die package */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1.8, 0.1]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* CPU cores */}
      {corePositions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          ref={(el) => { if (el) coreRefs.current[i] = el }}
        >
          <boxGeometry args={[0.65, 0.65, 0.04]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Interconnect lines on die */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={`h-${i}`} position={[0, x, 0.06]}>
          <boxGeometry args={[1.7, 0.02, 0.01]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {[-0.6, 0, 0.6].map((y, i) => (
        <mesh key={`v-${i}`} position={[y, 0, 0.06]}>
          <boxGeometry args={[0.02, 1.7, 0.01]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Solder bumps grid */}
      {Array.from({ length: 25 }).map((_, i) => {
        const row = Math.floor(i / 5)
        const col = i % 5
        return (
          <mesh key={`bump-${i}`} position={[-0.8 + col * 0.4, -0.8 + row * 0.4, -0.09]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#c0a020" metalness={1} roughness={0.1} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Camera parallax on mouse ---
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.8 - camera.position.x) * 0.04
    camera.position.y += (-mouse.current.y * 0.5 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

// --- Background star field ---
function StarField({ count = 500 }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = -5 - Math.random() * 15
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.005
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export function CPUScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#00e5ff" />
      <pointLight position={[-4, 4, 2]} intensity={0.5} color="#7c3aed" />
      <pointLight position={[4, -4, 2]} intensity={0.3} color="#f59e0b" />

      <CameraRig />
      <StarField />
      <CircuitTraces />
      <SignalParticles count={100} />
      <CPUDie />
    </Canvas>
  )
}
