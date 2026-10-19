import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Chất liệu Đồ chơi 3D Cao cấp (Pop Mart / Vinyl Clay Toy Finish)
export const ToyMaterial: React.FC<{
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  clearcoat?: number;
}> = ({
  color,
  roughness = 0.25,
  metalness = 0.06,
  emissive = '#000000',
  emissiveIntensity = 0,
  clearcoat = 0.72,
}) => (
  <meshPhysicalMaterial
    color={color}
    roughness={roughness}
    metalness={metalness}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
    clearcoat={clearcoat}
    clearcoatRoughness={0.2}
  />
);

// ============================================================================
// 1. BỘ MÔ HÌNH 3D CHI TIẾT CHO TẤT CẢ TỪ VỰNG TRONG 12 ĐẢO (SCULPTED 3D TOYS)
// ============================================================================
export const SculptedVocabulary3D: React.FC<{
  itemId: string;
  word: string;
  color: string;
}> = ({ itemId, word, color }) => {
  const groupRef = useRef<THREE.Group>(null);
  const w = word.toLowerCase();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.85) * 0.45 + t * 0.45;
      groupRef.current.position.y = Math.sin(t * 2.2) * 0.08;
    }
  });

  // --- 1. CON BÒ SỮA 3D (COW) ---
  if (w.includes('cow') || itemId.includes('cow')) {
    return (
      <group ref={groupRef} scale={0.95}>
        <RoundedBox args={[1.5, 1.0, 1.8]} radius={0.35} smoothness={4} position={[0, -0.1, 0]}>
          <ToyMaterial color="#ffffff" />
        </RoundedBox>
        <mesh position={[0.45, 0.25, 0.2]} scale={[0.5, 0.4, 0.6]}>
          <sphereGeometry args={[0.6, 20, 20]} />
          <ToyMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.48, 0.1, -0.3]} scale={[0.45, 0.45, 0.5]}>
          <sphereGeometry args={[0.55, 20, 20]} />
          <ToyMaterial color="#1e293b" />
        </mesh>
        <RoundedBox args={[1.05, 0.95, 0.95]} radius={0.3} smoothness={4} position={[0, 0.55, 0.85]}>
          <ToyMaterial color="#ffffff" />
        </RoundedBox>
        <RoundedBox args={[0.85, 0.48, 0.35]} radius={0.16} smoothness={4} position={[0, 0.38, 1.32]}>
          <ToyMaterial color="#fda4af" />
        </RoundedBox>
        <mesh position={[-0.18, 0.4, 1.5]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <ToyMaterial color="#881337" />
        </mesh>
        <mesh position={[0.18, 0.4, 1.5]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <ToyMaterial color="#881337" />
        </mesh>
        <mesh position={[-0.26, 0.72, 1.3]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.26, 0.72, 1.3]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.35, 1.12, 0.8]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.1, 0.32, 16]} />
          <ToyMaterial color="#fde047" />
        </mesh>
        <mesh position={[0.35, 1.12, 0.8]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.1, 0.32, 16]} />
          <ToyMaterial color="#fde047" />
        </mesh>
        {[
          [-0.45, -0.7, 0.55],
          [0.45, -0.7, 0.55],
          [-0.45, -0.7, -0.55],
          [0.45, -0.7, -0.55],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <capsuleGeometry args={[0.16, 0.35, 12, 16]} />
            <ToyMaterial color="#f1f5f9" />
          </mesh>
        ))}
      </group>
    );
  }

  // --- 2. CON VỊT VÀNG 3D (DUCK) ---
  if (w.includes('duck')) {
    return (
      <group ref={groupRef} scale={1.05}>
        <mesh position={[0, -0.2, 0]} scale={[1.1, 0.85, 1.35]}>
          <sphereGeometry args={[0.85, 32, 32]} />
          <ToyMaterial color="#facc15" />
        </mesh>
        <mesh position={[0, 0.65, 0.45]}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <ToyMaterial color="#fde047" />
        </mesh>
        <RoundedBox args={[0.55, 0.22, 0.5]} radius={0.1} position={[0, 0.58, 1.05]}>
          <ToyMaterial color="#f97316" />
        </RoundedBox>
        <mesh position={[-0.24, 0.78, 0.96]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.24, 0.78, 0.96]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.88, -0.1, 0]} rotation={[0, 0, 0.3]} scale={[0.3, 0.6, 0.9]}>
          <sphereGeometry args={[0.6, 20, 20]} />
          <ToyMaterial color="#eab308" />
        </mesh>
        <mesh position={[0.88, -0.1, 0]} rotation={[0, 0, -0.3]} scale={[0.3, 0.6, 0.9]}>
          <sphereGeometry args={[0.6, 20, 20]} />
          <ToyMaterial color="#eab308" />
        </mesh>
      </group>
    );
  }

  // --- 3. THỎ TRẮNG / SƯ TỬ / GẤU TRÚC / CÚN CON 3D (RABBIT / LION / PANDA / PUPPY) ---
  if (w.includes('rabbit') || w.includes('lion') || w.includes('wildlife') || w.includes('look after')) {
    const isLion = w.includes('lion');
    const isPanda = w.includes('wildlife');
    const bodyCol = isLion ? '#f59e0b' : isPanda ? '#ffffff' : '#fce7f3';

    return (
      <group ref={groupRef} scale={1.0}>
        {/* Thân tròn */}
        <mesh position={[0, -0.32, 0]} scale={[1.05, 0.95, 1.1]}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <ToyMaterial color={bodyCol} />
        </mesh>
        {/* Đầu */}
        <mesh position={[0, 0.55, 0.15]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <ToyMaterial color={bodyCol} />
        </mesh>
        {/* Bờm sư tử 3D */}
        {isLion && (
          <mesh position={[0, 0.55, 0.02]}>
            <torusGeometry args={[0.62, 0.24, 16, 32]} />
            <ToyMaterial color="#b45309" />
          </mesh>
        )}
        {/* Tai thỏ dài hoặc tai gấu trúc */}
        {w.includes('rabbit') ? (
          <>
            <mesh position={[-0.26, 1.35, 0.1]} rotation={[0, 0, 0.15]}>
              <capsuleGeometry args={[0.14, 0.55, 16, 24]} />
              <ToyMaterial color="#fbcfe8" />
            </mesh>
            <mesh position={[0.26, 1.35, 0.1]} rotation={[0, 0, -0.15]}>
              <capsuleGeometry args={[0.14, 0.55, 16, 24]} />
              <ToyMaterial color="#fbcfe8" />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[-0.48, 1.02, 0.1]}>
              <sphereGeometry args={[0.22, 20, 20]} />
              <ToyMaterial color={isPanda ? '#0f172a' : '#d97706'} />
            </mesh>
            <mesh position={[0.48, 1.02, 0.1]}>
              <sphereGeometry args={[0.22, 20, 20]} />
              <ToyMaterial color={isPanda ? '#0f172a' : '#d97706'} />
            </mesh>
          </>
        )}
        {/* Mắt & Mũi */}
        <mesh position={[-0.24, 0.62, 0.74]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.24, 0.62, 0.74]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.48, 0.78]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <ToyMaterial color="#f43f5e" />
        </mesh>
      </group>
    );
  }

  // --- 4. QUẢ TÁO / CAM / DÂU / CHUỐI / BÁNH KEM 3D (FRUITS & CAKE) ---
  if (w.includes('apple') || w.includes('orange') || w.includes('strawberry')) {
    const isStrawberry = w.includes('strawberry');
    const isOrange = w.includes('orange');
    const mainColor = isStrawberry ? '#f43f5e' : isOrange ? '#f97316' : '#ef4444';

    return (
      <group ref={groupRef} scale={1.15}>
        {isStrawberry ? (
          <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.95, 1.65, 32]} />
            <ToyMaterial color={mainColor} roughness={0.22} />
          </mesh>
        ) : (
          <mesh position={[0, -0.05, 0]} scale={[1.08, 0.96, 1.08]}>
            <sphereGeometry args={[0.98, 36, 36]} />
            <ToyMaterial color={mainColor} roughness={0.18} clearcoat={0.9} />
          </mesh>
        )}
        <mesh position={[0, 0.92, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.06, 0.09, 0.42, 16]} />
          <ToyMaterial color="#78350f" />
        </mesh>
        <mesh position={[0.28, 0.95, 0]} rotation={[0.2, 0, -0.6]} scale={[1.2, 0.35, 0.6]}>
          <sphereGeometry args={[0.32, 20, 20]} />
          <ToyMaterial color="#22c55e" />
        </mesh>
        <mesh position={[-0.25, 0.05, 0.94]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.25, 0.05, 0.94]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <ToyMaterial color="#0f172a" />
        </mesh>
      </group>
    );
  }

  if (w.includes('banana')) {
    return (
      <group ref={groupRef} scale={1.15}>
        <mesh rotation={[0.2, 0, 0.5]}>
          <torusGeometry args={[0.95, 0.32, 24, 40, Math.PI * 0.78]} />
          <ToyMaterial color="#facc15" clearcoat={0.7} />
        </mesh>
        <mesh position={[-0.65, 0.68, 0.1]} rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.1, 0.16, 0.28, 16]} />
          <ToyMaterial color="#65a30d" />
        </mesh>
      </group>
    );
  }

  if (w.includes('cake')) {
    return (
      <group ref={groupRef} scale={1.1}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.65, 32]} />
          <ToyMaterial color="#fbcfe8" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 0.5, 32]} />
          <ToyMaterial color="#fef08a" />
        </mesh>
        {/* Quả dâu & Nến trên đỉnh bánh */}
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
          <ToyMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <ToyMaterial color="#facc15" emissive="#f97316" emissiveIntensity={1} />
        </mesh>
      </group>
    );
  }

  // --- 5. ĐÀN GHI-TA / VÁN TRƯỢT / CÁNH DIỀU 3D (GUITAR / SKATEBOARD / KITE) ---
  if (w.includes('guitar')) {
    return (
      <group ref={groupRef} scale={1.0} rotation={[0, 0, -0.35]}>
        {/* Thùng đàn số 8 */}
        <mesh position={[0, -0.45, 0]} scale={[1, 0.9, 0.38]}>
          <sphereGeometry args={[0.78, 32, 32]} />
          <ToyMaterial color="#f97316" />
        </mesh>
        <mesh position={[0, 0.12, 0]} scale={[0.78, 0.75, 0.36]}>
          <sphereGeometry args={[0.68, 32, 32]} />
          <ToyMaterial color="#f97316" />
        </mesh>
        {/* Lỗ thoát âm */}
        <mesh position={[0, -0.05, 0.25]}>
          <circleGeometry args={[0.24, 24]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        {/* Cần đàn */}
        <RoundedBox args={[0.22, 1.45, 0.12]} radius={0.04} position={[0, 0.95, 0]}>
          <ToyMaterial color="#78350f" />
        </RoundedBox>
      </group>
    );
  }

  if (w.includes('skateboard')) {
    return (
      <group ref={groupRef} scale={1.1} rotation={[0.25, 0, 0]}>
        <RoundedBox args={[2.1, 0.14, 0.72]} radius={0.07} position={[0, 0, 0]}>
          <ToyMaterial color="#10b981" />
        </RoundedBox>
        {[
          [-0.65, -0.22, 0.28],
          [0.65, -0.22, 0.28],
          [-0.65, -0.22, -0.28],
          [0.65, -0.22, -0.28],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.12, 20]} />
            <ToyMaterial color="#f43f5e" />
          </mesh>
        ))}
      </group>
    );
  }

  // --- 6. ĐỒ DÙNG HỌC TẬP 3D (BACKPACK / NOTEBOOK / CRAYON / SCISSORS) ---
  if (w.includes('backpack') || w.includes('notebook') || w.includes('crayon')) {
    return (
      <group ref={groupRef} scale={1.05}>
        <RoundedBox args={[1.25, 1.5, 0.65]} radius={0.28} smoothness={4} position={[0, -0.05, 0]}>
          <ToyMaterial color={color} />
        </RoundedBox>
        <RoundedBox args={[0.92, 0.68, 0.25]} radius={0.16} position={[0, -0.25, 0.35]}>
          <ToyMaterial color="#facc15" />
        </RoundedBox>
        <mesh position={[0, 0.78, 0]}>
          <torusGeometry args={[0.28, 0.06, 14, 28, Math.PI]} />
          <ToyMaterial color="#f8fafc" />
        </mesh>
      </group>
    );
  }

  // --- 7. TÊN LỬA VŨ TRỤ 3D (ROCKET / ASTRONAUT / SPACE / FLYING CAR) ---
  if (w.includes('rocket') || w.includes('space') || w.includes('astronaut') || w.includes('flying car')) {
    return (
      <group ref={groupRef} scale={1.0}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 1.65, 32]} />
          <ToyMaterial color="#f8fafc" metalness={0.2} clearcoat={0.85} />
        </mesh>
        <mesh position={[0, 1.32, 0]}>
          <coneGeometry args={[0.56, 0.85, 32]} />
          <ToyMaterial color="#ef4444" clearcoat={0.85} />
        </mesh>
        <mesh position={[0, 0.3, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 24]} />
          <ToyMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[0, 0.3, 0.55]}>
          <torusGeometry args={[0.28, 0.05, 16, 32]} />
          <ToyMaterial color="#facc15" metalness={0.6} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <RoundedBox args={[0.14, 0.65, 0.45]} radius={0.05} position={[0, -0.5, 0.68]}>
              <ToyMaterial color="#ef4444" />
            </RoundedBox>
          </group>
        ))}
        <mesh position={[0, -1.05, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.38, 0.65, 20]} />
          <ToyMaterial color="#facc15" emissive="#f97316" emissiveIntensity={0.9} />
        </mesh>
      </group>
    );
  }

  // --- 8. ROBOT AI 3D (ROBOT / AI ASSISTANT) ---
  if (w.includes('robot') || w.includes('ai')) {
    return (
      <group ref={groupRef} scale={1.0}>
        <RoundedBox args={[1.25, 0.95, 0.95]} radius={0.28} smoothness={4} position={[0, 0.72, 0]}>
          <ToyMaterial color="#38bdf8" clearcoat={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.98, 0.58, 0.12]} radius={0.14} position={[0, 0.72, 0.44]}>
          <ToyMaterial color="#0f172a" roughness={0.1} />
        </RoundedBox>
        <mesh position={[-0.24, 0.74, 0.52]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <ToyMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.24, 0.74, 0.52]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <ToyMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 1.32, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35]} />
          <ToyMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
        <mesh position={[0, 1.52, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <ToyMaterial color="#facc15" emissive="#fde047" emissiveIntensity={0.8} />
        </mesh>
        <RoundedBox args={[1.15, 1.05, 0.85]} radius={0.25} smoothness={4} position={[0, -0.35, 0]}>
          <ToyMaterial color="#f8fafc" clearcoat={0.8} />
        </RoundedBox>
        <mesh position={[0, -0.3, 0.44]}>
          <octahedronGeometry args={[0.22, 0]} />
          <ToyMaterial color="#ec4899" emissive="#f43f5e" emissiveIntensity={0.7} />
        </mesh>
      </group>
    );
  }

  // --- 9. ĐOÀN TÀU LỬA 3D (TRAIN) ---
  if (w.includes('train')) {
    return (
      <group ref={groupRef} scale={0.95}>
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.52, 0.52, 1.4, 28]} />
          <ToyMaterial color="#10b981" />
        </mesh>
        <RoundedBox args={[0.95, 1.25, 1.1]} radius={0.18} position={[-0.65, 0.25, 0]}>
          <ToyMaterial color="#ef4444" />
        </RoundedBox>
        <mesh position={[0.65, 0.68, 0]}>
          <cylinderGeometry args={[0.2, 0.14, 0.55, 20]} />
          <ToyMaterial color="#facc15" />
        </mesh>
        {[
          [-0.65, -0.5, 0.58],
          [0.45, -0.5, 0.58],
          [-0.65, -0.5, -0.58],
          [0.45, -0.5, -0.58],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.14, 24]} />
            <ToyMaterial color="#f59e0b" metalness={0.4} />
          </mesh>
        ))}
      </group>
    );
  }

  // --- 10. NÚI LỬA PHUN TRÀO / CẦU VỒNG / NĂNG LƯỢNG XANH 3D ---
  if (w.includes('volcano')) {
    return (
      <group ref={groupRef} scale={1.05}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.52, 1.35, 1.5, 24]} />
          <ToyMaterial color="#78350f" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <torusGeometry args={[0.48, 0.14, 16, 32]} />
          <ToyMaterial color="#ef4444" emissive="#f97316" emissiveIntensity={0.95} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <ToyMaterial color="#facc15" emissive="#f97316" emissiveIntensity={1.1} />
        </mesh>
      </group>
    );
  }

  if (w.includes('rainbow')) {
    return (
      <group ref={groupRef} scale={1.05}>
        {[
          { r: 1.15, col: '#ef4444' },
          { r: 0.98, col: '#facc15' },
          { r: 0.81, col: '#22c55e' },
          { r: 0.64, col: '#38bdf8' },
        ].map((arc, i) => (
          <mesh key={i} position={[0, -0.35, 0]}>
            <torusGeometry args={[arc.r, 0.095, 16, 40, Math.PI]} />
            <ToyMaterial color={arc.col} />
          </mesh>
        ))}
        <mesh position={[-1.0, -0.35, 0.18]}>
          <sphereGeometry args={[0.36, 20, 20]} />
          <ToyMaterial color="#ffffff" />
        </mesh>
        <mesh position={[1.0, -0.35, 0.18]}>
          <sphereGeometry args={[0.36, 20, 20]} />
          <ToyMaterial color="#ffffff" />
        </mesh>
      </group>
    );
  }

  // --- MẶC ĐỊNH: RƯƠNG KHO BÁU HOÀNG GIA & PHA LÊ PHÉP THUẬT 3D ---
  return (
    <group ref={groupRef} scale={1.05}>
      {/* Thân rương kho báu */}
      <RoundedBox args={[1.5, 0.95, 1.1]} radius={0.18} smoothness={4} position={[0, -0.25, 0]}>
        <ToyMaterial color={color} />
      </RoundedBox>
      {/* Nắp rương vòm tròn */}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.54, 0.54, 1.48, 24, 1, false, 0, Math.PI]} />
        <ToyMaterial color={color} />
      </mesh>
      {/* Đai vàng & Khóa ngọc */}
      <RoundedBox args={[1.56, 0.16, 1.16]} radius={0.04} position={[0, 0.2, 0]}>
        <ToyMaterial color="#facc15" metalness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0.22, 0.6]}>
        <octahedronGeometry args={[0.22, 0]} />
        <ToyMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.85} />
      </mesh>
      {/* Viên ngọc bay lơ lửng phía trên rương */}
      <mesh position={[0, 1.05, 0]}>
        <octahedronGeometry args={[0.32, 0]} />
        <ToyMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
};

// ============================================================================
// 2. KIẾN TRÚC CÔNG TRÌNH 3D TRÊN CÁC ĐẢO BAY (3D ISLAND DIORAMA LANDMARKS)
// ============================================================================
export const IslandLandmark3D: React.FC<{
  islandNumber: number;
  tier: number;
  themeColor: string;
}> = ({ islandNumber, tier, themeColor }) => {
  const windmillRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (windmillRef.current) {
      windmillRef.current.rotation.z = t * 1.8;
    }
  });

  if (islandNumber === 1) {
    return (
      <group position={[-0.75, 0.38, -0.45]} scale={0.78}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.32, 0.46, 0.9, 20]} />
          <ToyMaterial color="#fef3c7" />
        </mesh>
        <mesh position={[0, 1.08, 0]}>
          <coneGeometry args={[0.45, 0.48, 20]} />
          <ToyMaterial color={themeColor} />
        </mesh>
        <group ref={windmillRef} position={[0, 0.72, 0.38]}>
          <RoundedBox args={[1.15, 0.12, 0.04]} radius={0.02}>
            <ToyMaterial color="#facc15" />
          </RoundedBox>
          <RoundedBox args={[0.12, 1.15, 0.04]} radius={0.02}>
            <ToyMaterial color="#facc15" />
          </RoundedBox>
        </group>
      </group>
    );
  }

  if (islandNumber === 2) {
    return (
      <group position={[0.75, 0.38, -0.45]} scale={0.78}>
        <RoundedBox args={[0.85, 0.75, 0.75]} radius={0.12} position={[0, 0.35, 0]}>
          <ToyMaterial color="#f8fafc" />
        </RoundedBox>
        <mesh position={[-0.36, 0.85, 0]}>
          <coneGeometry args={[0.25, 0.55, 16]} />
          <ToyMaterial color={themeColor} />
        </mesh>
        <mesh position={[0.36, 0.85, 0]}>
          <coneGeometry args={[0.25, 0.55, 16]} />
          <ToyMaterial color={themeColor} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <coneGeometry args={[0.32, 0.68, 20]} />
          <ToyMaterial color="#facc15" emissive="#fde047" emissiveIntensity={0.25} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0.75, 0.38, -0.45]} scale={0.78}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.52, 28, 28]} />
        <ToyMaterial color="#e0f2fe" clearcoat={0.9} />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[0.35, 0, 0.2]}>
        <torusGeometry args={[0.78, 0.06, 16, 40]} />
        <ToyMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.5} />
      </mesh>
      {tier >= 3 && <Sparkles count={15} scale={1.8} size={2.5} color="#fde047" />}
    </group>
  );
};

export const FluffyTree3D: React.FC<{
  position: [number, number, number];
  leafColor?: string;
  scale?: number;
}> = ({ position, leafColor = '#22c55e', scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.22, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.14, 0.45, 14]} />
      <ToyMaterial color="#92400e" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.62, 0]} castShadow>
      <sphereGeometry args={[0.34, 24, 24]} />
      <ToyMaterial color={leafColor} />
    </mesh>
    <mesh position={[-0.18, 0.48, 0.1]} castShadow>
      <sphereGeometry args={[0.24, 20, 20]} />
      <ToyMaterial color={leafColor} />
    </mesh>
    <mesh position={[0.2, 0.5, -0.08]} castShadow>
      <sphereGeometry args={[0.25, 20, 20]} />
      <ToyMaterial color={leafColor} />
    </mesh>
  </group>
);

export const FluffyCloud3D: React.FC<{
  position: [number, number, number];
  scale?: number;
}> = ({ position, scale = 1 }) => (
  <Float speed={1.4} rotationIntensity={0.04} floatIntensity={0.25}>
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 20, 20]} />
        <ToyMaterial color="#ffffff" roughness={0.4} clearcoat={0.2} />
      </mesh>
      <mesh position={[-0.34, -0.06, 0.05]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <ToyMaterial color="#f8fafc" roughness={0.4} clearcoat={0.2} />
      </mesh>
      <mesh position={[0.34, -0.06, -0.05]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <ToyMaterial color="#f8fafc" roughness={0.4} clearcoat={0.2} />
      </mesh>
    </group>
  </Float>
);
