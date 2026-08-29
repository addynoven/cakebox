import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Text } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { CustomCakeConfig } from '../models/customizer.model';
import { colors } from '../../../core/theme';

interface Cake3DProps {
  config: Partial<CustomCakeConfig>;
  rotationY: number;
}

// Pure exponential damp smoothing (replaces duplicate THREE.MathUtils.damp runtime)
function smoothDamp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

// Realistic 3D Whipped Cream Rosette Swirl
function CreamRosette({ position, scale = 1, color = '#FFFBF5' }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <coneGeometry args={[0.12, 0.16, 12]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
    </group>
  );
}

// Realistic 3D Strawberry with Seed Details & Green Leaves
function RealisticStrawberry({ position, rotation = [0, 0, 0], scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  return (
    <group position={position} rotation={rotation as any} scale={scale}>
      {/* Strawberry Body (Glossy ruby red) */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.26, 0.52, 18]} />
        <meshStandardMaterial color="#D90429" roughness={0.25} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#D90429" roughness={0.25} metalness={0.08} />
      </mesh>

      {/* Green Stem Calyx Leaves */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.12, 0.44, Math.sin(angle) * 0.12]}
          rotation={[0.3, angle, 0.4]}
        >
          <coneGeometry args={[0.08, 0.16, 5]} />
          <meshStandardMaterial color="#2B9348" roughness={0.5} />
        </mesh>
      ))}

      {/* Strawberry Top Stem */}
      <mesh position={[0, 0.52, 0]} rotation={[0.1, 0, 0.15]}>
        <cylinderGeometry args={[0.025, 0.03, 0.12, 8]} />
        <meshStandardMaterial color="#1E5E2E" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 3D Cake Mesh Composition
function CakeModel({ config, rotationY }: Cake3DProps) {
  const groupRef = useRef<Group>(null);

  const spongeColor = config.base?.spongeColor || '#FDF2D0';
  const frostingColor = config.frosting?.color || '#FFFBF5';
  const dripColor = config.drip?.color || '#F472B6';
  const hasDrip = config.drip?.id !== 'none' && config.drip?.color && config.drip?.color !== 'transparent';
  const showSprinkles = config.toppings?.sprinkles ?? true;
  const showFruits = config.toppings?.fruits ?? true;
  const showTopper = config.toppings?.topper ?? true;
  const topperText = config.toppings?.topperText || 'Happy Birthday';

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = smoothDamp(
        groupRef.current.rotation.y,
        rotationY,
        4.5,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.65, 0]}>
      {/* 1. Ceramic Cake Stand / Pedestal with Gold Rim */}
      <group position={[0, -0.12, 0]}>
        {/* Main plate */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.35, 2.45, 0.12, 48]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.05} />
        </mesh>
        {/* Gold Trim Ring */}
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[2.36, 0.03, 16, 48]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Stand Base */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[1.1, 1.5, 0.22, 36]} />
          <meshStandardMaterial color="#FDFBF7" roughness={0.2} />
        </mesh>
      </group>

      {/* 2. Main Cake Body (Smooth Frosting Outer Tier) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.85, 1.85, 1.42, 64]} />
        <meshStandardMaterial
          color={frostingColor}
          roughness={0.32}
          metalness={0.04}
        />
      </mesh>

      {/* 3. Exposed Moist Sponge Slice (Middle Layer) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.855, 1.855, 0.26, 64]} />
        <meshStandardMaterial
          color={spongeColor}
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>
      {/* Thin Cream Core inside the Sponge */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.858, 1.858, 0.05, 64]} />
        <meshStandardMaterial color="#FFFDF9" roughness={0.25} />
      </mesh>

      {/* 4. Base Rim Whipped Cream Pearls */}
      {Array.from({ length: 24 }).map((_, idx) => {
        const angle = (idx / 24) * Math.PI * 2;
        const x = Math.cos(angle) * 1.88;
        const z = Math.sin(angle) * 1.88;
        return (
          <mesh key={idx} position={[x, 0.04, z]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={frostingColor} roughness={0.3} />
          </mesh>
        );
      })}

      {/* 5. Dripping Glaze Cap with Tear-drop Beaded Drips */}
      {hasDrip && (
        <group position={[0, 1.36, 0]}>
          {/* Top mirror glaze cap */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[1.86, 1.86, 0.06, 64]} />
            <meshStandardMaterial
              color={dripColor}
              roughness={0.12}
              metalness={0.25}
            />
          </mesh>

          {/* Organic cascading glaze drips */}
          {[
            { angle: 0.1, length: 0.72, width: 0.14 },
            { angle: 0.6, length: 0.42, width: 0.11 },
            { angle: 1.1, length: 0.95, width: 0.16 },
            { angle: 1.7, length: 0.55, width: 0.12 },
            { angle: 2.2, length: 0.88, width: 0.15 },
            { angle: 2.9, length: 0.38, width: 0.10 },
            { angle: 3.5, length: 1.05, width: 0.17 },
            { angle: 4.1, length: 0.62, width: 0.13 },
            { angle: 4.7, length: 0.92, width: 0.15 },
            { angle: 5.3, length: 0.48, width: 0.11 },
            { angle: 5.9, length: 0.78, width: 0.14 },
          ].map((drip, idx) => {
            const x = Math.cos(drip.angle) * 1.86;
            const z = Math.sin(drip.angle) * 1.86;
            return (
              <group key={idx} position={[x, -drip.length / 2, z]}>
                <mesh>
                  <cylinderGeometry args={[drip.width * 0.7, drip.width, drip.length, 14]} />
                  <meshStandardMaterial color={dripColor} roughness={0.12} metalness={0.25} />
                </mesh>
                <mesh position={[0, -drip.length / 2, 0]}>
                  <sphereGeometry args={[drip.width * 1.15, 14, 14]} />
                  <meshStandardMaterial color={dripColor} roughness={0.12} metalness={0.25} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* 6. Top Crown Piped Whipped Cream Rosettes (10 around perimeter) */}
      {Array.from({ length: 10 }).map((_, idx) => {
        const angle = (idx / 10) * Math.PI * 2;
        const x = Math.cos(angle) * 1.55;
        const z = Math.sin(angle) * 1.55;
        return (
          <CreamRosette
            key={idx}
            position={[x, 1.4, z]}
            scale={0.95}
            color={frostingColor}
          />
        );
      })}

      {/* 7. Procedural Cylindrical Sprinkles */}
      {showSprinkles && (
        <group position={[0, 1.41, 0]}>
          {[
            { x: 0.35, z: 0.45, c: '#FF477E', r: [0.1, 0.4, 0] },
            { x: -0.55, z: 0.25, c: '#3A86FF', r: [0.1, 1.2, 0] },
            { x: 0.2, z: -0.65, c: '#38B000', r: [0, 0.8, 0.3] },
            { x: -0.28, z: -0.38, c: '#FFB703', r: [0.3, 0.2, 0.5] },
            { x: 0.75, z: -0.18, c: '#FF006E', r: [0.4, 0.9, 0.1] },
            { x: -0.75, z: 0.55, c: '#8338EC', r: [0.1, 0.3, 0.4] },
            { x: 0.05, z: 0.85, c: '#FF477E', r: [0.5, 0.1, 0] },
            { x: 0.6, z: 0.6, c: '#FB8500', r: [0.2, 0.7, 0.1] },
            { x: -0.6, z: -0.6, c: '#3A86FF', r: [0.1, 0.5, 0.3] },
          ].map((sp, idx) => (
            <mesh key={idx} position={[sp.x, 0.02, sp.z]} rotation={sp.r as any}>
              <capsuleGeometry args={[0.028, 0.12, 6, 10]} />
              <meshStandardMaterial color={sp.c} roughness={0.25} />
            </mesh>
          ))}
        </group>
      )}

      {/* 8. Fresh Realistic Strawberries & Plump Blueberries */}
      {showFruits && (
        <group position={[0, 1.41, 0]}>
          {/* Strawberry 1 (Center Hero) */}
          <RealisticStrawberry
            position={[0.3, 0, 0.15]}
            rotation={[0.12, 0.35, -0.1]}
            scale={1.1}
          />
          {/* Strawberry 2 */}
          <RealisticStrawberry
            position={[-0.25, 0, 0.35]}
            rotation={[-0.15, -0.6, 0.2]}
            scale={0.95}
          />
          {/* Strawberry 3 */}
          <RealisticStrawberry
            position={[0.0, 0, -0.35]}
            rotation={[0.2, 2.1, -0.15]}
            scale={0.9}
          />

          {/* Plump Glossy Blueberries */}
          {[
            { x: -0.45, y: 0.1, z: -0.12, r: 0.13, c: '#1D3557' },
            { x: 0.55, y: 0.09, z: -0.32, r: 0.12, c: '#183059' },
            { x: -0.05, y: 0.11, z: 0.6, r: 0.14, c: '#274C77' },
            { x: 0.45, y: 0.08, z: 0.55, r: 0.11, c: '#1D3557' },
          ].map((b, idx) => (
            <mesh key={idx} position={[b.x, b.y, b.z]}>
              <sphereGeometry args={[b.r, 18, 18]} />
              <meshStandardMaterial color={b.c} roughness={0.22} metalness={0.05} />
            </mesh>
          ))}
        </group>
      )}

      {/* 9. Golden Acrylic Topper Sign */}
      {showTopper && (
        <group position={[0, 1.48, 0]}>
          {/* Two acrylic sticks inserted into cake */}
          <mesh position={[-0.45, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 10]} />
            <meshStandardMaterial color="#E0CDA9" roughness={0.1} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0.45, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 10]} />
            <meshStandardMaterial color="#E0CDA9" roughness={0.1} transparent opacity={0.7} />
          </mesh>

          {/* Golden Badge Sign Header */}
          <group position={[0, 0.82, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.95, 0.95, 0.05, 36]} />
              <meshStandardMaterial
                color="#FFFDF9"
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>
            {/* Gold Ring Border */}
            <mesh>
              <torusGeometry args={[0.96, 0.04, 16, 36]} />
              <meshStandardMaterial
                color="#D4AF37"
                roughness={0.2}
                metalness={0.85}
              />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}

interface ThreeCakeCanvasProps {
  config: Partial<CustomCakeConfig>;
  width?: number;
  height?: number;
}

export const ThreeCakeCanvas: React.FC<ThreeCakeCanvasProps> = ({
  config,
  width = 280,
  height = 280,
}) => {
  const [rotationY, setRotationY] = useState(0.4);
  const lastXRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        lastXRef.current = evt.nativeEvent.pageX;
      },
      onPanResponderMove: (evt) => {
        const deltaX = evt.nativeEvent.pageX - lastXRef.current;
        lastXRef.current = evt.nativeEvent.pageX;
        setRotationY((prev) => prev + deltaX * 0.015);
      },
    })
  ).current;

  return (
    <View style={[styles.container, { width, height }]} {...panResponder.panHandlers}>
      <Canvas
        camera={{ position: [0, 3.0, 4.8], fov: 42 }}
        style={styles.canvas}
      >
        {/* High-End Bakery Studio 3-Point Lighting */}
        <ambientLight intensity={0.95} color="#FFFBF5" />
        <directionalLight position={[4, 9, 6]} intensity={1.4} />
        <pointLight position={[-4, 4, -3]} intensity={0.7} color="#FFE4E6" />
        <directionalLight position={[0, -2, 3]} intensity={0.4} color="#FFFFFF" />
        <pointLight position={[0, 4, 3]} intensity={0.5} color="#FFF1E6" />

        {/* The Realistic 3D Cake Mesh */}
        <CakeModel config={config} rotationY={rotationY} />
      </Canvas>

      {/* 360 Gesture Hint Badge */}
      <View style={styles.hintBadge} pointerEvents="none">
        <Text style={styles.hintText}>✨ Drag to spin 360°</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  hintBadge: {
    position: 'absolute',
    bottom: 6,
    backgroundColor: 'rgba(59, 44, 48, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  hintText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
