import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Text } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CustomCakeConfig } from '../models/customizer.model';
import { colors } from '../../../core/theme';

interface Cake3DProps {
  config: Partial<CustomCakeConfig>;
  rotationY: number;
}

function CakeModel({ config, rotationY }: Cake3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  const spongeColor = config.base?.spongeColor || '#FDF2D0';
  const frostingColor = config.frosting?.color || '#FFFBF5';
  const dripColor = config.drip?.color || '#F472B6';
  const hasDrip = config.drip?.id !== 'none' && config.drip?.color && config.drip?.color !== 'transparent';
  const showSprinkles = config.toppings?.sprinkles ?? true;
  const showFruits = config.toppings?.fruits ?? true;

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Smoothly interpolate rotation to rotationY
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        rotationY,
        4,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 1. Ceramic Cake Stand / Pedestal */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[2.3, 2.4, 0.15, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.9, 1.4, 0.15, 32]} />
        <meshStandardMaterial color="#FAF5F0" roughness={0.3} />
      </mesh>

      {/* 2. Main Cake Body (Frosting Outer Layer) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 1.4, 48]} />
        <meshStandardMaterial
          color={frostingColor}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* 3. Exposed Middle Sponge Slice (Visual layer) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.81, 1.81, 0.28, 48]} />
        <meshStandardMaterial
          color={spongeColor}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* 4. Dripping Glaze Cap */}
      {hasDrip && (
        <group position={[0, 1.36, 0]}>
          {/* Top glaze disk */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.82, 1.82, 0.05, 48]} />
            <meshStandardMaterial
              color={dripColor}
              roughness={0.15}
              metalness={0.2}
            />
          </mesh>

          {/* Glaze drip beads down the side */}
          {[
            { angle: 0, height: 0.5, radius: 0.12 },
            { angle: 0.7, height: 0.8, radius: 0.14 },
            { angle: 1.5, height: 0.4, radius: 0.11 },
            { angle: 2.3, height: 0.9, radius: 0.15 },
            { angle: 3.1, height: 0.6, radius: 0.13 },
            { angle: 3.9, height: 0.85, radius: 0.14 },
            { angle: 4.7, height: 0.45, radius: 0.12 },
            { angle: 5.5, height: 0.75, radius: 0.13 },
          ].map((drip, idx) => {
            const x = Math.cos(drip.angle) * 1.81;
            const z = Math.sin(drip.angle) * 1.81;
            return (
              <group key={idx} position={[x, -drip.height / 2, z]}>
                <mesh>
                  <cylinderGeometry args={[drip.radius * 0.8, drip.radius, drip.height, 12]} />
                  <meshStandardMaterial color={dripColor} roughness={0.15} metalness={0.2} />
                </mesh>
                <mesh position={[0, -drip.height / 2, 0]}>
                  <sphereGeometry args={[drip.radius, 12, 12]} />
                  <meshStandardMaterial color={dripColor} roughness={0.15} metalness={0.2} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* 5. Procedural 3D Sprinkles */}
      {showSprinkles && (
        <group position={[0, 1.38, 0]}>
          {[
            { x: 0.4, z: 0.5, color: '#F43F5E', rot: [0.2, 0.4, 0] },
            { x: -0.6, z: 0.3, color: '#3B82F6', rot: [0.1, 1.2, 0] },
            { x: 0.2, z: -0.7, color: '#10B981', rot: [0, 0.8, 0.3] },
            { x: -0.3, z: -0.4, color: '#F59E0B', rot: [0.3, 0.2, 0.5] },
            { x: 0.8, z: -0.2, color: '#EC4899', rot: [0.4, 0.9, 0.1] },
            { x: -0.8, z: 0.6, color: '#8B5CF6', rot: [0.1, 0.3, 0.4] },
            { x: 0.0, z: 0.9, color: '#F43F5E', rot: [0.5, 0.1, 0] },
          ].map((sp, idx) => (
            <mesh
              key={idx}
              position={[sp.x, 0.02, sp.z]}
              rotation={sp.rot as any}
            >
              <capsuleGeometry args={[0.03, 0.12, 4, 8]} />
              <meshStandardMaterial color={sp.color} roughness={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* 6. 3D Strawberries & Blueberries */}
      {showFruits && (
        <group position={[0, 1.38, 0]}>
          {/* Main Strawberry 1 */}
          <group position={[0.4, 0.25, 0.2]} rotation={[0.1, 0.4, -0.1]}>
            <mesh>
              <coneGeometry args={[0.3, 0.55, 16]} />
              <meshStandardMaterial color="#E11D48" roughness={0.25} />
            </mesh>
            {/* Green Leaf Stem */}
            <mesh position={[0, 0.28, 0]}>
              <coneGeometry args={[0.22, 0.08, 6]} />
              <meshStandardMaterial color="#10B981" roughness={0.5} />
            </mesh>
          </group>

          {/* Strawberry 2 */}
          <group position={[-0.3, 0.25, 0.4]} rotation={[-0.1, -0.6, 0.2]}>
            <mesh>
              <coneGeometry args={[0.26, 0.48, 16]} />
              <meshStandardMaterial color="#F43F5E" roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.18, 0.07, 6]} />
              <meshStandardMaterial color="#10B981" roughness={0.5} />
            </mesh>
          </group>

          {/* Blueberries */}
          <mesh position={[-0.5, 0.1, -0.2]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#2563EB" roughness={0.3} />
          </mesh>
          <mesh position={[0.6, 0.1, -0.4]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#1D4ED8" roughness={0.3} />
          </mesh>
          <mesh position={[0.0, 0.1, -0.6]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.3} />
          </mesh>
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
        camera={{ position: [0, 2.6, 4.8], fov: 45 }}
        style={styles.canvas}
      >
        {/* Studio 3-Point Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <pointLight position={[-4, 3, -3]} intensity={0.6} color="#FFE4E6" />
        <directionalLight position={[0, -2, 2]} intensity={0.3} color="#FFFFFF" />

        {/* The 3D Cake Mesh */}
        <CakeModel config={config} rotationY={rotationY} />
      </Canvas>

      {/* 360 Gesture Hint Badge */}
      <View style={styles.hintBadge} pointerEvents="none">
        <Text style={styles.hintText}>👆 Swipe to rotate 360°</Text>
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
    bottom: 8,
    backgroundColor: 'rgba(59, 44, 48, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hintText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
