'use client';

import { Html, Line, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { travelRoutes, travelStops, type TravelStop } from '../route-map/travel-route-data';

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = degToRad(90 - lat);
  const theta = degToRad(lon + 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function buildArc(start: THREE.Vector3, end: THREE.Vector3, heightMultiplier = 1.36) {
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(heightMultiplier);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(60);
}

function RoutePath({ start, end, active }: { start: TravelStop; end: TravelStop; active: boolean }) {
  const lineRef = useRef<any>(null);
  const points = useMemo(() => {
    const startPoint = latLonToVector3(start.lat, start.lon, 1.02);
    const endPoint = latLonToVector3(end.lat, end.lon, 1.02);
    return buildArc(startPoint, endPoint, 1.42);
  }, [end.lat, end.lon, start.lat, start.lon]);

  useFrame((_, delta) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= delta * (active ? 0.9 : 0.25);
    }
  });

  return (
    <>
      <Line
        ref={lineRef}
        points={points}
        color={active ? '#67e8f9' : '#1d4ed8'}
        lineWidth={active ? 2.8 : 1.4}
        dashed
        dashSize={0.16}
        gapSize={0.08}
        transparent
        opacity={active ? 0.95 : 0.4}
      />
      <Line points={points} color={active ? '#34d399' : '#0f172a'} lineWidth={active ? 5.5 : 3.6} transparent opacity={active ? 0.14 : 0.08} />
    </>
  );
}

function StopMarker({
  stop,
  active,
  hovered,
  onHover,
  onSelect,
}: {
  stop: TravelStop;
  active: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const markerPosition = useMemo(() => latLonToVector3(stop.lat, stop.lon, 1.08), [stop.lat, stop.lon]);
  return (
    <group position={markerPosition}>
      <mesh
        onPointerOver={() => onHover(stop.id)}
        onPointerOut={() => onHover(null)}
        onClick={() => onSelect(stop.id)}
        scale={active ? 1.12 : hovered ? 1.04 : 1}
      >
        <sphereGeometry args={[0.04, 18, 18]} />
        <meshStandardMaterial
          color={active ? '#ffffff' : '#d7fbff'}
          emissive={active ? '#67e8f9' : '#22d3ee'}
          emissiveIntensity={active ? 1.65 : 1.05}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      <Html distanceFactor={8} center>
        <div
          className={`pointer-events-none flex max-w-[9rem] items-center gap-2 overflow-hidden rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase shadow-[0_0_28px_rgba(103,232,249,0.35)] backdrop-blur-md transition-all sm:max-w-[11rem] sm:text-[11px] ${
            active || hovered
              ? 'border-white/20 bg-slate-900/15 text-white opacity-100'
              : 'border-white/10 bg-black/20 text-slate-200 opacity-90'
          }`}
        >
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${active ? 'bg-cyan-300 text-slate-950' : 'bg-slate-900/10 text-white'}`}>
            {stop.number}
          </span>
          <span className="min-w-0 truncate">{stop.name}</span>
        </div>
      </Html>
    </group>
  );
}

function GlobeScene({
  selectedStopId,
  hoveredStopId,
  onSelectStop,
  onHoverStop,
}: {
  selectedStopId: string;
  hoveredStopId: string | null;
  onSelectStop: (id: string) => void;
  onHoverStop: (id: string | null) => void;
}) {
  const globeGroup = useRef<THREE.Group>(null);
  const spin = useRef(0);

  useEffect(() => {
    const selected = travelStops.find((stop) => stop.id === selectedStopId) ?? travelStops[0];
    if (!selected || !globeGroup.current) return;

    const focusX = degToRad(selected.lat) * 0.18;
    const focusY = -degToRad(selected.lon) + Math.PI * 0.55;

    gsap.to(globeGroup.current.rotation, {
      x: focusX,
      y: focusY,
      duration: 1.5,
      ease: 'power3.out',
    });
  }, [selectedStopId]);

  useFrame((state, delta) => {
    spin.current += delta * 0.06;
    if (globeGroup.current) {
      globeGroup.current.rotation.y += delta * 0.018;
      globeGroup.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.02;
    }
  });

  const selectedIndex = travelStops.findIndex((stop) => stop.id === selectedStopId);

  return (
    <group ref={globeGroup} rotation={[0.18, -0.35, 0]}>
      <mesh>
        <sphereGeometry args={[1, 72, 72]} />
        <meshStandardMaterial
          color="#0d2145"
          roughness={0.86}
          metalness={0.12}
          emissive="#07111f"
          emissiveIntensity={0.7}
        />
      </mesh>

      <mesh scale={1.02}>
        <sphereGeometry args={[1, 72, 72]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.11} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh scale={1.045}>
        <sphereGeometry args={[1, 72, 72]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.06} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>

      <Sparkles count={70} scale={4.6} size={2.2} speed={0.28} color="#8befff" />
      <Stars radius={12} depth={24} count={1800} factor={3.2} saturation={0} fade speed={0.45} />

      <ambientLight intensity={0.8} color="#8feef7" />
      <directionalLight intensity={2.1} position={[4, 2, 4]} color="#ffffff" />
      <pointLight intensity={6} position={[-3, 2, 3]} color="#32d4ff" />
      <pointLight intensity={4.4} position={[3, -2, 2.5]} color="#37ffce" />

      {travelRoutes.map((route, index) => (
        <RoutePath key={route.id} start={route.start} end={route.end} active={selectedIndex === index || hoveredStopId === route.startId || hoveredStopId === route.endId} />
      ))}

      {travelStops.map((stop) => (
        <StopMarker
          key={stop.id}
          stop={stop}
          active={stop.id === selectedStopId}
          hovered={stop.id === hoveredStopId}
          onHover={onHoverStop}
          onSelect={onSelectStop}
        />
      ))}
    </group>
  );
}

export function InteractiveGlobe({
  selectedStopId,
  hoveredStopId,
  onSelectStop,
  onHoverStop,
}: {
  selectedStopId: string;
  hoveredStopId: string | null;
  onSelectStop: (id: string) => void;
  onHoverStop: (id: string | null) => void;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[46rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.2),transparent_35%),linear-gradient(180deg,#050816_0%,#081b34_52%,#050816_100%)] shadow-[0_25px_80px_rgba(2,6,23,0.55)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(12,74,110,0.22),transparent_40%),radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.12),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.14),transparent_18%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_18%,transparent_36%,rgba(255,255,255,0.03)_56%,transparent_78%)] opacity-70" />

      <div className="absolute inset-0 scale-[0.96] sm:scale-100">
        <Canvas camera={{ position: [0, 0, 3.1], fov: 39 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            <GlobeScene selectedStopId={selectedStopId} hoveredStopId={hoveredStopId} onSelectStop={onSelectStop} onHoverStop={onHoverStop} />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(103,232,249,0.16),transparent_20%),radial-gradient(circle_at_50%_90%,rgba(45,212,191,0.14),transparent_24%)]" />
    </div>
  );
}
