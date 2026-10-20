import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export type CharacterGender = 'boy' | 'girl';

export interface ModularEquippedSkin {
  hat?: string;
  hair?: string;
  outfit?: string;
  hand_item?: string;
  shield?: string;
  wing?: string;
  aura?: string;
  glasses?: string;
}

export interface ChibiCharacterProps {
  gender?: CharacterGender;
  equippedSkin?: ModularEquippedSkin;
  petId?: string;
  scale?: number;
  position?: [number, number, number];
  isJumping?: boolean;
  onClickCharacter?: () => void;
  showPet?: boolean;
}

// ============================================================================
// CHẤT LIỆU TOY / VINYL CLAYMORPHISM CAO CẤP
// ============================================================================
const ToyMat: React.FC<{
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  clearcoat?: number;
  wireframe?: boolean;
}> = ({
  color,
  roughness = 0.28,
  metalness = 0.05,
  emissive = '#000000',
  emissiveIntensity = 0,
  clearcoat = 0.65,
}) => (
  <meshPhysicalMaterial
    color={color}
    roughness={roughness}
    metalness={metalness}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
    clearcoat={clearcoat}
    clearcoatRoughness={0.25}
  />
);

// ============================================================================
// 1. KHUÔN MẶT ANIME & ĐẦU CHIBI ĐÁNG YÊU (CUTE ANIME HEAD & EXPRESSIVE FACE)
// ============================================================================
const ChibiHeadAndFace: React.FC<{ gender: CharacterGender; hairId?: string }> = ({ gender, hairId }) => {
  const isGirl = gender === 'girl';
  const skinColor = isGirl ? '#ffdcd0' : '#ffd7c9';
  const blushColor = '#fb7185';
  const eyeColor = '#1e1b4b';

  return (
    <group position={[0, 0.85, 0]}>
      {/* Khối Đầu Tròn Chibi */}
      <mesh castShadow receiveShadow scale={[0.88, 0.82, 0.85]}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <ToyMat color={skinColor} roughness={0.4} clearcoat={0.3} />
      </mesh>

      {/* Đôi Tai Chibi */}
      <mesh position={[-0.45, 0.02, -0.05]} scale={[0.1, 0.14, 0.12]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color={skinColor} roughness={0.4} />
      </mesh>
      <mesh position={[0.45, 0.02, -0.05]} scale={[0.1, 0.14, 0.12]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color={skinColor} roughness={0.4} />
      </mesh>

      {/* Mắt Trái */}
      <group position={[-0.17, 0.04, 0.42]}>
        <mesh scale={[0.075, 0.11, 0.04]}>
          <sphereGeometry args={[1, 20, 20]} />
          <ToyMat color={eyeColor} roughness={0.1} clearcoat={1.0} />
        </mesh>
        {/* Điểm sáng mắt lớn */}
        <mesh position={[-0.02, 0.035, 0.03]} scale={[0.028, 0.038, 0.02]}>
          <sphereGeometry args={[1, 12, 12]} />
          <ToyMat color="#ffffff" roughness={0.05} />
        </mesh>
        {/* Điểm sáng mắt nhỏ */}
        <mesh position={[0.02, -0.03, 0.03]} scale={[0.015, 0.018, 0.015]}>
          <sphereGeometry args={[1, 12, 12]} />
          <ToyMat color="#ffffff" roughness={0.05} />
        </mesh>
        {/* Lông mi bé gái */}
        {isGirl && (
          <mesh position={[-0.01, 0.09, 0.01]} rotation={[0, 0, 0.2]} scale={[0.065, 0.015, 0.02]}>
            <boxGeometry />
            <ToyMat color="#0f172a" />
          </mesh>
        )}
      </group>

      {/* Mắt Phải */}
      <group position={[0.17, 0.04, 0.42]}>
        <mesh scale={[0.075, 0.11, 0.04]}>
          <sphereGeometry args={[1, 20, 20]} />
          <ToyMat color={eyeColor} roughness={0.1} clearcoat={1.0} />
        </mesh>
        {/* Điểm sáng mắt lớn */}
        <mesh position={[-0.02, 0.035, 0.03]} scale={[0.028, 0.038, 0.02]}>
          <sphereGeometry args={[1, 12, 12]} />
          <ToyMat color="#ffffff" roughness={0.05} />
        </mesh>
        {/* Điểm sáng mắt nhỏ */}
        <mesh position={[0.02, -0.03, 0.03]} scale={[0.015, 0.018, 0.015]}>
          <sphereGeometry args={[1, 12, 12]} />
          <ToyMat color="#ffffff" roughness={0.05} />
        </mesh>
        {/* Lông mi bé gái */}
        {isGirl && (
          <mesh position={[0.01, 0.09, 0.01]} rotation={[0, 0, -0.2]} scale={[0.065, 0.015, 0.02]}>
            <boxGeometry />
            <ToyMat color="#0f172a" />
          </mesh>
        )}
      </group>

      {/* Má Hồng Phấn (Blush) */}
      <mesh position={[-0.24, -0.08, 0.38]} scale={[0.08, 0.04, 0.02]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color={blushColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.24, -0.08, 0.38]} scale={[0.08, 0.04, 0.02]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color={blushColor} roughness={0.8} />
      </mesh>

      {/* Mũi Nhỏ Nụ Chồi */}
      <mesh position={[0, -0.04, 0.45]} scale={[0.022, 0.022, 0.022]}>
        <sphereGeometry args={[1, 12, 12]} />
        <ToyMat color="#fb7185" roughness={0.5} />
      </mesh>

      {/* Miệng Cười Vui Tươi */}
      <mesh position={[0, -0.16, 0.42]} rotation={[0.1, 0, 0]} scale={[0.065, 0.032, 0.025]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color="#e11d48" roughness={0.3} />
      </mesh>

      {/* TÓC CHIBI NGUYÊN BẢN THEO HÌNH MẪU 2D */}
      <ChibiHair gender={gender} hairId={hairId} />
    </group>
  );
};

// ============================================================================
// 2. MÁI TÓC CHIBI (GIRL TWIN-TAILS & BOY MESSY SPIKES)
// ============================================================================
const ChibiHair: React.FC<{ gender: CharacterGender; hairId?: string }> = ({ gender }) => {
  const isGirl = gender === 'girl';
  const hairColor = isGirl ? '#f472b6' : '#78350f'; // Hồng đào / Nâu hạt dẻ ấm
  const ribbonColor = '#ec4899';

  if (isGirl) {
    return (
      <group position={[0, 0.05, 0]}>
        {/* Khối tóc bồng đỉnh đầu */}
        <mesh position={[0, 0.12, -0.04]} scale={[0.92, 0.78, 0.88]}>
          <sphereGeometry args={[0.54, 28, 28]} />
          <ToyMat color={hairColor} roughness={0.35} clearcoat={0.6} />
        </mesh>

        {/* Mái ngố vòm cung che trán (Bangs) */}
        <group position={[0, 0.22, 0.38]}>
          <mesh position={[-0.15, -0.06, 0.06]} rotation={[0, 0, 0.15]} scale={[0.15, 0.18, 0.09]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color={hairColor} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.04, 0.08]} scale={[0.18, 0.16, 0.09]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color={hairColor} roughness={0.35} />
          </mesh>
          <mesh position={[0.15, -0.06, 0.06]} rotation={[0, 0, -0.15]} scale={[0.15, 0.18, 0.09]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color={hairColor} roughness={0.35} />
          </mesh>
        </group>

        {/* Lọn tóc mai ôm 2 bên má */}
        <mesh position={[-0.42, -0.05, 0.18]} rotation={[0.1, 0, 0.2]} scale={[0.11, 0.28, 0.14]}>
          <capsuleGeometry args={[0.7, 0.8, 8, 16]} />
          <ToyMat color={hairColor} roughness={0.35} />
        </mesh>
        <mesh position={[0.42, -0.05, 0.18]} rotation={[0.1, 0, -0.2]} scale={[0.11, 0.28, 0.14]}>
          <capsuleGeometry args={[0.7, 0.8, 8, 16]} />
          <ToyMat color={hairColor} roughness={0.35} />
        </mesh>

        {/* Bím Tóc Đuôi Sam 2 Bên (Twin Braid Loops) */}
        <group position={[-0.42, -0.22, -0.05]}>
          {/* Dây thun cột tóc */}
          <mesh scale={[0.07, 0.04, 0.07]}>
            <cylinderGeometry args={[1, 1, 1, 16]} />
            <ToyMat color={ribbonColor} />
          </mesh>
          {/* Lọn đuôi sam uốn cong */}
          <mesh position={[-0.04, -0.12, 0.02]} rotation={[0.2, 0, 0.25]} scale={[0.11, 0.14, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color={hairColor} roughness={0.35} />
          </mesh>
        </group>

        <group position={[0.42, -0.22, -0.05]}>
          {/* Dây thun cột tóc */}
          <mesh scale={[0.07, 0.04, 0.07]}>
            <cylinderGeometry args={[1, 1, 1, 16]} />
            <ToyMat color={ribbonColor} />
          </mesh>
          {/* Lọn đuôi sam uốn cong */}
          <mesh position={[0.04, -0.12, 0.02]} rotation={[0.2, 0, -0.25]} scale={[0.11, 0.14, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color={hairColor} roughness={0.35} />
          </mesh>
        </group>
      </group>
    );
  }

  // Tóc Nam (Boy Messy Textured Hair)
  return (
    <group position={[0, 0.06, 0]}>
      {/* Vòm tóc chính */}
      <mesh position={[0, 0.14, -0.02]} scale={[0.94, 0.82, 0.88]}>
        <sphereGeometry args={[0.54, 28, 28]} />
        <ToyMat color={hairColor} roughness={0.35} clearcoat={0.6} />
      </mesh>

      {/* Các lọn tóc tỉa nhọn cá tính trước trán */}
      {[-0.28, -0.14, 0, 0.14, 0.28].map((x, i) => (
        <mesh
          key={i}
          position={[x, 0.19, 0.4]}
          rotation={[0.15, 0, (i - 2) * 0.12]}
          scale={[0.12, 0.18, 0.1]}
        >
          <coneGeometry args={[0.8, 1.2, 8]} />
          <ToyMat color={hairColor} roughness={0.35} />
        </mesh>
      ))}

      {/* Lọn tóc gáy & 2 bên tai */}
      <mesh position={[-0.42, 0.05, 0.05]} rotation={[0, 0, 0.3]} scale={[0.14, 0.22, 0.14]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color={hairColor} roughness={0.35} />
      </mesh>
      <mesh position={[0.42, 0.05, 0.05]} rotation={[0, 0, -0.3]} scale={[0.14, 0.22, 0.14]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color={hairColor} roughness={0.35} />
      </mesh>
    </group>
  );
};

// ============================================================================
// 3. THÂN BODY CHIBI CHUẨN ĐỒ LÓT BƠI MẶC ĐỊNH (SWIMWEAR / UNDERGARMENT)
// ============================================================================
const ChibiBodyBase: React.FC<{ gender: CharacterGender }> = ({ gender }) => {
  const isGirl = gender === 'girl';
  const skinColor = isGirl ? '#ffdcd0' : '#ffd7c9';
  const suitColor = isGirl ? '#f472b6' : '#38bdf8'; // Hồng pastel cho nữ, Xanh cyan cho nam

  return (
    <group position={[0, 0, 0]}>
      {/* Cổ Nhỏ */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.18, 16]} />
        <ToyMat color={skinColor} roughness={0.4} />
      </mesh>

      {/* Thân Bụng Tròn Mặc Đồ Bơi / Áo Lót Mặc Định */}
      <mesh position={[0, 0.22, 0]} scale={[0.62, 0.58, 0.48]} castShadow>
        <capsuleGeometry args={[0.42, 0.35, 8, 16]} />
        <ToyMat color={suitColor} roughness={0.3} clearcoat={0.5} />
      </mesh>

      {/* Họa tiết ngực áo bơi */}
      <mesh position={[0, 0.24, 0.24]} scale={[0.06, 0.06, 0.02]}>
        <sphereGeometry args={[1, 16, 16]} />
        <ToyMat color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
      </mesh>

      {/* Cánh Tay Trái (Chubby Cute Arm) */}
      <group position={[-0.38, 0.28, 0]} rotation={[0, 0, 0.35]}>
        <mesh position={[0, -0.15, 0]} scale={[0.12, 0.26, 0.12]} castShadow>
          <capsuleGeometry args={[0.7, 0.8, 8, 16]} />
          <ToyMat color={skinColor} roughness={0.4} />
        </mesh>
        {/* Bàn tay tròn & ngón cái */}
        <mesh position={[0, -0.32, 0.02]} scale={[0.12, 0.12, 0.12]}>
          <sphereGeometry args={[1, 16, 16]} />
          <ToyMat color={skinColor} roughness={0.4} />
        </mesh>
      </group>

      {/* Cánh Tay Phải */}
      <group position={[0.38, 0.28, 0]} rotation={[0, 0, -0.35]}>
        <mesh position={[0, -0.15, 0]} scale={[0.12, 0.26, 0.12]} castShadow>
          <capsuleGeometry args={[0.7, 0.8, 8, 16]} />
          <ToyMat color={skinColor} roughness={0.4} />
        </mesh>
        {/* Bàn tay tròn */}
        <mesh position={[0, -0.32, 0.02]} scale={[0.12, 0.12, 0.12]}>
          <sphereGeometry args={[1, 16, 16]} />
          <ToyMat color={skinColor} roughness={0.4} />
        </mesh>
      </group>

      {/* Đùi & Chân Trái (Left Leg) */}
      <group position={[-0.17, -0.14, 0]}>
        <mesh position={[0, -0.18, 0]} scale={[0.15, 0.28, 0.15]} castShadow>
          <capsuleGeometry args={[0.65, 0.65, 8, 16]} />
          <ToyMat color={skinColor} roughness={0.4} />
        </mesh>
        {/* Bàn Chân */}
        <mesh position={[0, -0.34, 0.05]} scale={[0.15, 0.1, 0.22]}>
          <boxGeometry />
          <ToyMat color={suitColor} roughness={0.4} />
        </mesh>
      </group>

      {/* Đùi & Chân Phải (Right Leg) */}
      <group position={[0.17, -0.14, 0]}>
        <mesh position={[0, -0.18, 0]} scale={[0.15, 0.28, 0.15]} castShadow>
          <capsuleGeometry args={[0.65, 0.65, 8, 16]} />
          <ToyMat color={skinColor} roughness={0.4} />
        </mesh>
        {/* Bàn Chân */}
        <mesh position={[0, -0.34, 0.05]} scale={[0.15, 0.1, 0.22]}>
          <boxGeometry />
          <ToyMat color={suitColor} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

// ============================================================================
// 4. BỘ MŨ & PHỤ KIỆN ĐẦU (HATS & HELMETS FIT 100% TRÊN ĐỈNH ĐẦU)
// ============================================================================
const ModularHat3D: React.FC<{ hatId?: string }> = ({ hatId }) => {
  if (!hatId || hatId === 'none') return null;

  // 1. MŨ PHÁP SƯ TÍM (MAGE / WITCH HAT - THEO HÌNH MẪU 2D)
  if (hatId === 'hat_mage_witch' || hatId === 'wizard_hat') {
    return (
      <group position={[0, 1.28, 0.02]} rotation={[-0.1, 0, 0.08]}>
        {/* Vành mũ tròn rộng màu tím */}
        <mesh scale={[0.85, 0.06, 0.85]} castShadow>
          <cylinderGeometry args={[1, 1, 1, 32]} />
          <ToyMat color="#6b21a8" roughness={0.3} clearcoat={0.6} />
        </mesh>
        {/* Dải ruy băng màu hồng viền mũ */}
        <mesh position={[0, 0.08, 0]} scale={[0.46, 0.1, 0.46]}>
          <cylinderGeometry args={[1, 1.05, 1, 24]} />
          <ToyMat color="#db2777" roughness={0.3} />
        </mesh>
        {/* Khóa vàng ruy băng */}
        <mesh position={[0, 0.08, 0.46]} scale={[0.08, 0.08, 0.03]}>
          <boxGeometry />
          <ToyMat color="#facc15" metalness={0.8} />
        </mesh>
        {/* Chóp nón hình nón uốn cong về sau */}
        <group position={[0, 0.12, 0]}>
          <mesh position={[0, 0.24, -0.05]} rotation={[-0.2, 0, 0]} scale={[0.42, 0.55, 0.42]} castShadow>
            <coneGeometry args={[1, 1.6, 24]} />
            <ToyMat color="#581c87" roughness={0.3} />
          </mesh>
          {/* Đỉnh chóp gập cong nhọn */}
          <mesh position={[0, 0.54, -0.22]} rotation={[-0.6, 0, 0]} scale={[0.18, 0.32, 0.18]}>
            <coneGeometry args={[1, 1.4, 16]} />
            <ToyMat color="#4a044e" roughness={0.3} />
          </mesh>
        </group>
      </group>
    );
  }

  // 2. VƯƠNG MIỆN HOÀNG GIA / NỮ TU (CLERIC / ROYAL TIARA - THEO HÌNH 2D)
  if (hatId === 'hat_cleric_tiara' || hatId === 'crown_gold') {
    return (
      <group position={[0, 1.34, 0.05]} scale={0.78}>
        {/* Vành vương miện vàng */}
        <mesh scale={[0.42, 0.12, 0.42]}>
          <cylinderGeometry args={[1, 0.9, 1, 24]} />
          <ToyMat color="#facc15" metalness={0.85} roughness={0.2} clearcoat={1.0} />
        </mesh>
        {/* 5 Chóp nhọn hoàng gia */}
        {[-0.32, -0.16, 0, 0.16, 0.32].map((x, idx) => (
          <mesh key={idx} position={[x, 0.14, 0.38 - Math.abs(x) * 0.4]} scale={[0.08, 0.18, 0.04]}>
            <coneGeometry args={[1, 1.5, 4]} />
            <ToyMat color="#eab308" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
        {/* Viên Hồng Ngọc Đỏ Trung Tâm */}
        <mesh position={[0, 0.1, 0.42]} scale={[0.08, 0.08, 0.05]}>
          <octahedronGeometry />
          <ToyMat color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} metalness={0.1} roughness={0.1} />
        </mesh>
      </group>
    );
  }

  // 3. MŨ GIÁP SẮT HIỆP SĨ & LÔNG VŨ ĐỎ (WARRIOR HELMET - THEO HÌNH 2D)
  if (hatId === 'hat_warrior_helmet' || hatId === 'bunny_ears') {
    return (
      <group position={[0, 0.88, 0]} scale={1.05}>
        {/* Vòm thép trùm đầu */}
        <mesh scale={[0.54, 0.52, 0.54]} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
          <ToyMat color="#64748b" metalness={0.85} roughness={0.25} clearcoat={0.9} />
        </mesh>
        {/* Kính ngắm chiến binh (Visor T-slit) */}
        <mesh position={[0, 0.05, 0.52]} scale={[0.44, 0.14, 0.06]}>
          <boxGeometry />
          <ToyMat color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Thanh sọc mũi */}
        <mesh position={[0, -0.05, 0.53]} scale={[0.08, 0.16, 0.05]}>
          <boxGeometry />
          <ToyMat color="#475569" metalness={0.8} />
        </mesh>
        {/* Chùm Lông Vũ Đỏ Thắm Uốn Lượn Trên Đỉnh (Crimson Feather Plume) */}
        <group position={[0, 0.52, -0.05]}>
          <mesh position={[0, 0.14, -0.08]} rotation={[-0.3, 0, 0]} scale={[0.1, 0.26, 0.38]}>
            <coneGeometry args={[1, 1.4, 16]} />
            <ToyMat color="#ef4444" roughness={0.4} clearcoat={0.3} />
          </mesh>
          <mesh position={[0, 0.28, -0.22]} rotation={[-0.7, 0, 0]} scale={[0.08, 0.22, 0.28]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color="#dc2626" roughness={0.4} />
          </mesh>
        </group>
      </group>
    );
  }

  // 4. NÓN THỢ SĂN LÔNG VŨ VÀNG (ARCHER FEATHER CAP - THEO HÌNH 2D)
  if (hatId === 'hat_archer_cap') {
    return (
      <group position={[0, 1.26, 0]} rotation={[0.05, 0, -0.08]} scale={0.88}>
        {/* Mũ nỉ xanh lá Robin Hood */}
        <mesh position={[0, 0.05, 0]} rotation={[-0.2, 0, 0]} scale={[0.55, 0.32, 0.65]} castShadow>
          <coneGeometry args={[1, 1.3, 16]} />
          <ToyMat color="#15803d" roughness={0.5} />
        </mesh>
        {/* Vành lật ngược */}
        <mesh position={[0, -0.02, 0.05]} scale={[0.58, 0.08, 0.66]}>
          <cylinderGeometry args={[1, 0.95, 1, 16]} />
          <ToyMat color="#166534" roughness={0.6} />
        </mesh>
        {/* Chiếc Lông Vũ Vàng Đính Kèm (Golden Feather) */}
        <mesh position={[0.32, 0.18, 0.15]} rotation={[0.4, 0.2, 0.6]} scale={[0.06, 0.34, 0.12]}>
          <coneGeometry args={[1, 1.5, 8]} />
          <ToyMat color="#facc15" emissive="#facc15" emissiveIntensity={0.2} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  // 5. MŨ GIÁP KHÔNG GIAN CYBER (ASTRO HELMET)
  if (hatId === 'astro_helmet') {
    return (
      <group position={[0, 0.88, 0]} scale={1.08}>
        <mesh scale={[0.54, 0.52, 0.54]}>
          <sphereGeometry args={[1, 24, 24]} />
          <ToyMat color="#e2e8f0" metalness={0.4} roughness={0.2} clearcoat={0.9} />
        </mesh>
        {/* Kính Vòm Neon Phát Sáng */}
        <mesh position={[0, 0.04, 0.32]} scale={[0.45, 0.35, 0.3]}>
          <sphereGeometry args={[1, 20, 20]} />
          <ToyMat color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} roughness={0.1} clearcoat={1.0} />
        </mesh>
      </group>
    );
  }

  return null;
};

// ============================================================================
// 5. TRANG PHỤC TOÀN THÂN (OUTFITS & ARMOR FIT CHUẨN THÂN HÌNH)
// ============================================================================
const ModularOutfit3D: React.FC<{ outfitId?: string }> = ({ outfitId }) => {
  if (!outfitId || outfitId === 'none') return null;

  // 1. ÁO CHOÀNG PHÙ THỦY TÍM + VÁY HỒNG (MAGE PURPLE CAPE & DRESS)
  if (outfitId === 'outfit_mage' || outfitId === 'wizard_robe') {
    return (
      <group position={[0, 0.15, 0]}>
        {/* Váy xòe màu hồng/tím sen bên dưới */}
        <mesh position={[0, -0.15, 0]} scale={[0.38, 0.28, 0.35]}>
          <cylinderGeometry args={[0.85, 1.25, 1, 16]} />
          <ToyMat color="#db2777" roughness={0.4} />
        </mesh>
        {/* Áo Choàng Tím Đậm (Purple Capelet) */}
        <mesh position={[0, 0.12, 0]} scale={[0.42, 0.32, 0.38]}>
          <cylinderGeometry args={[0.9, 1.35, 1, 16]} />
          <ToyMat color="#6b21a8" roughness={0.3} clearcoat={0.6} />
        </mesh>
        {/* Ngôi sao vàng cài áo trước ngực */}
        <mesh position={[0, 0.22, 0.32]} scale={[0.07, 0.07, 0.03]}>
          <octahedronGeometry />
          <ToyMat color="#facc15" emissive="#facc15" emissiveIntensity={0.5} metalness={0.8} />
        </mesh>
      </group>
    );
  }

  // 2. VÁY CÔNG CHÚA HOÀNG GIA TRẮNG VIỀN VÀNG (CLERIC HOLY PRINCESS GOWN)
  if (outfitId === 'outfit_cleric' || outfitId === 'cape_royal') {
    return (
      <group position={[0, 0.15, 0]}>
        {/* Váy dạ hội xếp ly trắng tinh khôi */}
        <mesh position={[0, -0.16, 0]} scale={[0.42, 0.34, 0.38]}>
          <cylinderGeometry args={[0.8, 1.45, 1, 24]} />
          <ToyMat color="#ffffff" roughness={0.2} clearcoat={0.9} />
        </mesh>
        {/* Đai viền vàng kim sa */}
        <mesh position={[0, -0.02, 0]} scale={[0.36, 0.05, 0.34]}>
          <cylinderGeometry args={[1, 1, 1, 20]} />
          <ToyMat color="#eab308" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Cầu vai hoàng gia viền vàng 2 bên */}
        <mesh position={[-0.34, 0.16, 0]} scale={[0.14, 0.08, 0.14]}>
          <sphereGeometry args={[1, 16, 16]} />
          <ToyMat color="#facc15" metalness={0.85} />
        </mesh>
        <mesh position={[0.34, 0.16, 0]} scale={[0.14, 0.08, 0.14]}>
          <sphereGeometry args={[1, 16, 16]} />
          <ToyMat color="#facc15" metalness={0.85} />
        </mesh>
        {/* Viên Kim Cương Hồng Trước Ngực */}
        <mesh position={[0, 0.16, 0.28]} scale={[0.07, 0.09, 0.04]}>
          <octahedronGeometry />
          <ToyMat color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
        </mesh>
      </group>
    );
  }

  // 3. BỘ GIÁP THÉP HIỆP SĨ & ĐAI DA (WARRIOR STEEL PLATE ARMOR)
  if (outfitId === 'outfit_warrior' || outfitId === 'knight_armor') {
    return (
      <group position={[0, 0.18, 0]}>
        {/* Giáp ngực phiến thép xanh xám */}
        <mesh position={[0, 0.06, 0]} scale={[0.38, 0.34, 0.34]}>
          <cylinderGeometry args={[1, 0.95, 1, 16]} />
          <ToyMat color="#475569" metalness={0.85} roughness={0.2} clearcoat={0.9} />
        </mesh>
        {/* Giáp vai thép 2 bên (Pauldrons) */}
        <mesh position={[-0.36, 0.18, 0]} scale={[0.15, 0.12, 0.15]}>
          <sphereGeometry args={[1, 16, 16]} />
          <ToyMat color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0.36, 0.18, 0]} scale={[0.15, 0.12, 0.15]}>
          <sphereGeometry args={[1, 16, 16]} />
          <ToyMat color="#334155" metalness={0.9} />
        </mesh>
        {/* Thắt lưng da màu nâu */}
        <mesh position={[0, -0.08, 0]} scale={[0.36, 0.06, 0.33]}>
          <cylinderGeometry args={[1, 1, 1, 16]} />
          <ToyMat color="#78350f" roughness={0.7} />
        </mesh>
        {/* Khóa thắt lưng vàng ròng */}
        <mesh position={[0, -0.08, 0.28]} scale={[0.08, 0.07, 0.03]}>
          <boxGeometry />
          <ToyMat color="#facc15" metalness={0.9} />
        </mesh>
        {/* Váy giáp phiến (Tassets) */}
        <mesh position={[0, -0.18, 0]} scale={[0.37, 0.18, 0.33]}>
          <cylinderGeometry args={[0.9, 1.15, 1, 16]} />
          <ToyMat color="#1e293b" metalness={0.8} />
        </mesh>
      </group>
    );
  }

  // 4. ÁO TUNIC CUNG THỦ RỪNG XANH & DÂY ĐEO CHÉO (ARCHER HUNTER TUNIC)
  if (outfitId === 'outfit_archer') {
    return (
      <group position={[0, 0.16, 0]}>
        {/* Áo Tunic Xanh Lá Cây */}
        <mesh position={[0, 0.04, 0]} scale={[0.36, 0.34, 0.33]}>
          <cylinderGeometry args={[0.95, 1.05, 1, 16]} />
          <ToyMat color="#16a34a" roughness={0.5} />
        </mesh>
        {/* Dây da đeo chéo qua ngực (Quiver Strap) */}
        <mesh position={[0, 0.08, 0.24]} rotation={[0, 0, 0.55]} scale={[0.48, 0.05, 0.04]}>
          <boxGeometry />
          <ToyMat color="#78350f" roughness={0.8} />
        </mesh>
        {/* Thắt lưng da & khóa vàng */}
        <mesh position={[0, -0.1, 0]} scale={[0.35, 0.06, 0.32]}>
          <cylinderGeometry args={[1, 1, 1, 16]} />
          <ToyMat color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.1, 0.27]} scale={[0.07, 0.06, 0.03]}>
          <boxGeometry />
          <ToyMat color="#facc15" metalness={0.9} />
        </mesh>
        {/* Vạt áo tunic xòe nhẹ */}
        <mesh position={[0, -0.18, 0]} scale={[0.36, 0.14, 0.32]}>
          <cylinderGeometry args={[0.95, 1.18, 1, 16]} />
          <ToyMat color="#15803d" roughness={0.6} />
        </mesh>
      </group>
    );
  }

  return null;
};

// ============================================================================
// 6. VŨ KHÍ TAY PHẢI (RIGHT HAND WEAPONS & STAVES)
// ============================================================================
const ModularHandItem3D: React.FC<{ itemId?: string }> = ({ itemId }) => {
  const staffOrbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (staffOrbRef.current) {
      staffOrbRef.current.rotation.y = state.clock.getElapsedTime() * 2;
    }
  });

  if (!itemId || itemId === 'none') return null;

  // 1. TRƯỢNG GỖ XOẮN MA THUẬT TÍM (MAGE SPIRAL STAFF - THEO HÌNH 2D)
  if (itemId === 'hand_mage_staff' || itemId === 'magic_wand') {
    return (
      <group position={[0.48, 0.22, 0.2]} rotation={[0.2, 0, -0.1]}>
        {/* Cán gậy gỗ dài */}
        <mesh position={[0, 0, 0]} scale={[0.035, 1.1, 0.035]} castShadow>
          <cylinderGeometry args={[1, 0.8, 1, 16]} />
          <ToyMat color="#854d0e" roughness={0.7} />
        </mesh>
        {/* Vòng gỗ xoắn ốc trên đỉnh */}
        <mesh position={[0, 0.58, 0]} scale={[0.14, 0.14, 0.08]}>
          <torusGeometry args={[1, 0.3, 16, 24]} />
          <ToyMat color="#a16207" roughness={0.5} />
        </mesh>
        {/* Quả Cầu Pha Lê Tím Phát Sáng Rực Rỡ */}
        <mesh ref={staffOrbRef} position={[0, 0.58, 0]} scale={[0.09, 0.09, 0.09]}>
          <sphereGeometry args={[1, 20, 20]} />
          <ToyMat color="#c084fc" emissive="#c084fc" emissiveIntensity={1.2} roughness={0.1} />
        </mesh>
      </group>
    );
  }

  // 2. QUYỀN TRƯỢNG CÁNH THIÊN THẦN VÀNG & NGỌC LAM (CLERIC WINGED SCEPTER - THEO HÌNH 2D)
  if (itemId === 'hand_cleric_scepter') {
    return (
      <group position={[0.48, 0.24, 0.2]} rotation={[0.15, 0, -0.05]}>
        {/* Cán vàng ngà thanh lịch */}
        <mesh scale={[0.03, 1.15, 0.03]} castShadow>
          <cylinderGeometry args={[1, 0.8, 1, 16]} />
          <ToyMat color="#fef08a" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Cặp Cánh Thiên Thần Vàng Ôm Viên Ngọc */}
        <mesh position={[-0.1, 0.62, 0]} rotation={[0, 0, 0.4]} scale={[0.07, 0.16, 0.03]}>
          <capsuleGeometry />
          <ToyMat color="#facc15" metalness={0.9} />
        </mesh>
        <mesh position={[0.1, 0.62, 0]} rotation={[0, 0, -0.4]} scale={[0.07, 0.16, 0.03]}>
          <capsuleGeometry />
          <ToyMat color="#facc15" metalness={0.9} />
        </mesh>
        {/* Viên Ngọc Lam Tỏa Sáng Tâm Điểm */}
        <mesh position={[0, 0.62, 0]} scale={[0.08, 0.08, 0.08]}>
          <octahedronGeometry />
          <ToyMat color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} roughness={0.05} />
        </mesh>
      </group>
    );
  }

  // 3. THANH KIẾM HIỆP SĨ THÉP (WARRIOR STEEL SWORD - THEO HÌNH 2D)
  if (itemId === 'hand_warrior_sword' || itemId === 'laser_sword') {
    return (
      <group position={[0.48, 0.15, 0.22]} rotation={[0.4, 0, 0]}>
        {/* Chuôi kiếm bọc da */}
        <mesh position={[0, -0.15, 0]} scale={[0.035, 0.18, 0.035]}>
          <cylinderGeometry />
          <ToyMat color="#78350f" roughness={0.8} />
        </mesh>
        {/* Núm chuôi kiếm đính ngọc */}
        <mesh position={[0, -0.25, 0]} scale={[0.05, 0.05, 0.05]}>
          <sphereGeometry />
          <ToyMat color="#eab308" metalness={0.9} />
        </mesh>
        {/* Thanh chắn ngang bảo vệ tay (Crossguard) */}
        <mesh position={[0, -0.05, 0]} scale={[0.26, 0.04, 0.06]}>
          <boxGeometry />
          <ToyMat color="#eab308" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Lưỡi kiếm thép sắc bén */}
        <mesh position={[0, 0.32, 0]} scale={[0.08, 0.68, 0.02]} castShadow>
          <boxGeometry />
          <ToyMat color="#cbd5e1" metalness={0.95} roughness={0.15} clearcoat={1.0} />
        </mesh>
        {/* Đầu mũi kiếm nhọn */}
        <mesh position={[0, 0.72, 0]} rotation={[0, 0, 0]} scale={[0.08, 0.14, 0.02]}>
          <coneGeometry args={[1, 1, 4]} />
          <ToyMat color="#cbd5e1" metalness={0.95} />
        </mesh>
      </group>
    );
  }

  // 4. CÂY CUNG GỖ UỐN LƯỢN & MŨI TÊN (ARCHER RECURVE BOW - THEO HÌNH 2D)
  if (itemId === 'hand_archer_bow' || itemId === 'balloon_heart') {
    return (
      <group position={[0.48, 0.2, 0.18]} rotation={[0.1, -0.3, 0.1]}>
        {/* Thân Cung Gỗ Uốn Cong Hình Bán Nguyệt */}
        <mesh scale={[0.04, 0.45, 0.38]}>
          <torusGeometry args={[1, 0.08, 12, 24, Math.PI]} />
          <ToyMat color="#854d0e" roughness={0.6} />
        </mesh>
        {/* Dây Cung Căng Tròn */}
        <mesh position={[0, 0, 0]} scale={[0.008, 0.88, 0.008]}>
          <cylinderGeometry />
          <ToyMat color="#f8fafc" />
        </mesh>
        {/* Mũi Tên Gỗ Đính Lông Vũ */}
        <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} scale={[0.015, 0.65, 0.015]}>
          <cylinderGeometry />
          <ToyMat color="#b45309" />
        </mesh>
        <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]} scale={[0.04, 0.08, 0.02]}>
          <coneGeometry args={[1, 1, 4]} />
          <ToyMat color="#64748b" metalness={0.9} />
        </mesh>
      </group>
    );
  }

  // 5. TRƯỢNG NGÔI SAO KẸO NGỌT (STAR WAND)
  if (itemId === 'hand_star_wand') {
    return (
      <group position={[0.48, 0.22, 0.2]} rotation={[0.2, 0, -0.1]}>
        <mesh scale={[0.03, 0.9, 0.03]}>
          <cylinderGeometry />
          <ToyMat color="#f472b6" />
        </mesh>
        <mesh position={[0, 0.48, 0]} scale={[0.14, 0.14, 0.06]}>
          <octahedronGeometry />
          <ToyMat color="#facc15" emissive="#facc15" emissiveIntensity={0.8} />
        </mesh>
      </group>
    );
  }

  return null;
};

// ============================================================================
// 7. KHIÊN TAY TRÁI (LEFT HAND SHIELD - WARRIOR KITE SHIELD THEO HÌNH 2D)
// ============================================================================
const ModularShield3D: React.FC<{ shieldId?: string }> = ({ shieldId }) => {
  if (!shieldId || shieldId === 'none') return null;

  if (shieldId === 'shield_warrior' || shieldId === 'knight_armor') {
    return (
      <group position={[-0.45, 0.18, 0.15]} rotation={[0.1, 0.4, 0]}>
        {/* Thân khiên hình tam giác uốn lượn (Kite Shield) */}
        <mesh scale={[0.34, 0.48, 0.06]} castShadow>
          <boxGeometry />
          <ToyMat color="#1e3a8a" roughness={0.3} clearcoat={0.8} />
        </mesh>
        {/* Viền thép bao quanh khiên */}
        <mesh position={[0, 0, 0.035]} scale={[0.36, 0.5, 0.02]}>
          <boxGeometry />
          <ToyMat color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Viên Ngọc Lam Sáng Tròn Tâm Khiên */}
        <mesh position={[0, 0.05, 0.06]} scale={[0.08, 0.08, 0.04]}>
          <sphereGeometry args={[1, 16, 16]} />
          <ToyMat color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} roughness={0.1} />
        </mesh>
      </group>
    );
  }

  return null;
};

// ============================================================================
// 8. CÁNH & TRANG BỊ SAU LƯNG (WINGS, QUIVER, BACKPACK)
// ============================================================================
const ModularBackItem3D: React.FC<{ backId?: string }> = ({ backId }) => {
  const wingGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wingGroupRef.current) {
      const flap = Math.sin(state.clock.getElapsedTime() * 4) * 0.18;
      wingGroupRef.current.children[0].rotation.y = flap + 0.35;
      wingGroupRef.current.children[1].rotation.y = -flap - 0.35;
    }
  });

  if (!backId || backId === 'none') return null;

  // 1. CÁNH THIÊN THẦN TRẮNG TINH KHÔI (ANGEL WINGS)
  if (backId === 'angel_wings' || backId === 'wing_angel') {
    return (
      <group ref={wingGroupRef} position={[0, 0.32, -0.22]}>
        {/* Cánh Trái */}
        <mesh position={[-0.22, 0.1, 0]} scale={[0.38, 0.28, 0.04]}>
          <boxGeometry />
          <ToyMat color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} clearcoat={1.0} />
        </mesh>
        {/* Cánh Phải */}
        <mesh position={[0.22, 0.1, 0]} scale={[0.38, 0.28, 0.04]}>
          <boxGeometry />
          <ToyMat color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} clearcoat={1.0} />
        </mesh>
      </group>
    );
  }

  // 2. ỐNG ĐỰNG TÊN CUNG THỦ DA NÂU (ARCHER QUIVER)
  if (backId === 'back_quiver' || backId === 'archer_quiver') {
    return (
      <group position={[0.12, 0.35, -0.22]} rotation={[0, 0, -0.45]}>
        {/* Ống da hình trụ */}
        <mesh scale={[0.07, 0.42, 0.07]}>
          <cylinderGeometry />
          <ToyMat color="#78350f" roughness={0.8} />
        </mesh>
        {/* 3 Mũi tên thò ra khỏi ống */}
        {[-0.03, 0, 0.03].map((x, i) => (
          <mesh key={i} position={[x, 0.25, 0]} scale={[0.015, 0.18, 0.015]}>
            <cylinderGeometry />
            <ToyMat color="#facc15" />
          </mesh>
        ))}
      </group>
    );
  }

  // 3. BALO DA NHÀ THÁM HIỂM (ADVENTURER LEATHER BACKPACK)
  if (backId === 'back_backpack') {
    return (
      <group position={[0, 0.26, -0.26]} scale={0.85}>
        <mesh scale={[0.34, 0.38, 0.22]}>
          <boxGeometry />
          <ToyMat color="#92400e" roughness={0.7} />
        </mesh>
        {/* Nắp túi da & dây khóa */}
        <mesh position={[0, 0.14, 0.04]} scale={[0.36, 0.14, 0.24]}>
          <boxGeometry />
          <ToyMat color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.04, 0.12]} scale={[0.06, 0.06, 0.04]}>
          <boxGeometry />
          <ToyMat color="#facc15" metalness={0.9} />
        </mesh>
      </group>
    );
  }

  // 4. ĐỘNG CƠ PHẢN LỰC TÊN LỬA (TURBO SPACE JETPACK)
  if (backId === 'jetpack_3d') {
    return (
      <group position={[0, 0.28, -0.26]} scale={0.78}>
        <mesh position={[-0.14, 0, 0]} scale={[0.09, 0.38, 0.09]}>
          <cylinderGeometry />
          <ToyMat color="#0ea5e9" metalness={0.8} />
        </mesh>
        <mesh position={[0.14, 0, 0]} scale={[0.09, 0.38, 0.09]}>
          <cylinderGeometry />
          <ToyMat color="#0ea5e9" metalness={0.8} />
        </mesh>
      </group>
    );
  }

  return null;
};

// ============================================================================
// 9. THÚ CƯNG MINI ĐI DƯỚI CHÂN NHÂN VẬT (MINI GROUND PET COMPANION)
// ============================================================================
const GroundPetCompanion3D: React.FC<{ petId?: string }> = ({ petId }) => {
  const petRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (petRef.current) {
      // Hoạt ảnh nhún nhảy lon ton dưới chân
      petRef.current.position.y = -0.52 + Math.abs(Math.sin(t * 5.5)) * 0.08;
      petRef.current.rotation.y = -0.3 + Math.sin(t * 2.2) * 0.18;
    }
  });

  // Vị trí cố định: bên cạnh bàn chân phải của nhân vật
  return (
    <group ref={petRef} position={[0.62, -0.52, 0.22]} scale={0.34}>
      {/* 1. BÉ RỒNG LỬA CON (BABY FIRE DRAGON) */}
      {(!petId || petId === 'dragon_sky' || petId === 'pet_dragon') && (
        <group>
          {/* Đầu rồng con to tròn */}
          <mesh position={[0, 0.52, 0.12]} scale={[0.42, 0.38, 0.44]}>
            <sphereGeometry args={[1, 20, 20]} />
            <ToyMat color="#f97316" roughness={0.3} clearcoat={0.6} />
          </mesh>
          {/* Sừng rồng vàng mini */}
          <mesh position={[-0.22, 0.82, -0.05]} rotation={[0.4, 0, -0.3]} scale={[0.08, 0.22, 0.08]}>
            <coneGeometry />
            <ToyMat color="#facc15" />
          </mesh>
          <mesh position={[0.22, 0.82, -0.05]} rotation={[0.4, 0, 0.3]} scale={[0.08, 0.22, 0.08]}>
            <coneGeometry />
            <ToyMat color="#facc15" />
          </mesh>
          {/* Mắt rồng to đen láy */}
          <mesh position={[-0.18, 0.56, 0.45]} scale={[0.07, 0.09, 0.04]}>
            <sphereGeometry />
            <ToyMat color="#1e1b4b" />
          </mesh>
          <mesh position={[0.18, 0.56, 0.45]} scale={[0.07, 0.09, 0.04]}>
            <sphereGeometry />
            <ToyMat color="#1e1b4b" />
          </mesh>
          {/* Thân tròn mập */}
          <mesh position={[0, 0.18, 0]} scale={[0.34, 0.32, 0.36]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color="#ea580c" roughness={0.3} />
          </mesh>
          {/* Cánh rồng con vỗ vỗ */}
          <mesh position={[-0.28, 0.32, -0.12]} rotation={[0, 0.4, 0.3]} scale={[0.22, 0.14, 0.03]}>
            <boxGeometry />
            <ToyMat color="#facc15" />
          </mesh>
          <mesh position={[0.28, 0.32, -0.12]} rotation={[0, -0.4, -0.3]} scale={[0.22, 0.14, 0.03]}>
            <boxGeometry />
            <ToyMat color="#facc15" />
          </mesh>
          {/* Đuôi rồng ngúng nguẩy */}
          <mesh position={[0, 0.12, -0.36]} rotation={[-0.5, 0, 0]} scale={[0.08, 0.22, 0.08]}>
            <coneGeometry />
            <ToyMat color="#f97316" />
          </mesh>
        </group>
      )}

      {/* 2. MÈO CON BA TƯ KẸO NGỌT (KITTY) */}
      {petId === 'pet_cat' && (
        <group>
          {/* Đầu mèo tròn trắng */}
          <mesh position={[0, 0.48, 0.1]} scale={[0.42, 0.38, 0.4]}>
            <sphereGeometry args={[1, 20, 20]} />
            <ToyMat color="#ffffff" roughness={0.4} />
          </mesh>
          {/* 2 Tai tam giác hồng */}
          <mesh position={[-0.24, 0.76, 0.08]} rotation={[0, 0, 0.3]} scale={[0.12, 0.18, 0.08]}>
            <coneGeometry args={[1, 1.2, 4]} />
            <ToyMat color="#f472b6" />
          </mesh>
          <mesh position={[0.24, 0.76, 0.08]} rotation={[0, 0, -0.3]} scale={[0.12, 0.18, 0.08]}>
            <coneGeometry args={[1, 1.2, 4]} />
            <ToyMat color="#f472b6" />
          </mesh>
          {/* Chuông vàng cổ leng keng */}
          <mesh position={[0, 0.28, 0.28]} scale={[0.06, 0.06, 0.06]}>
            <sphereGeometry />
            <ToyMat color="#facc15" metalness={0.9} />
          </mesh>
          {/* Thân tròn */}
          <mesh position={[0, 0.18, 0]} scale={[0.32, 0.28, 0.34]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* 3. CÚN CORGI TINH NGHỊCH (CORGI PUP) */}
      {(petId === 'pet_corgi' || petId === 'robo_pup') && (
        <group>
          <mesh position={[0, 0.48, 0.12]} scale={[0.42, 0.36, 0.42]}>
            <sphereGeometry args={[1, 20, 20]} />
            <ToyMat color="#f59e0b" roughness={0.4} />
          </mesh>
          {/* Tai to dựng đứng */}
          <mesh position={[-0.26, 0.78, 0.05]} rotation={[0, 0, 0.3]} scale={[0.14, 0.26, 0.06]}>
            <boxGeometry />
            <ToyMat color="#b45309" />
          </mesh>
          <mesh position={[0.26, 0.78, 0.05]} rotation={[0, 0, -0.3]} scale={[0.14, 0.26, 0.06]}>
            <boxGeometry />
            <ToyMat color="#b45309" />
          </mesh>
          <mesh position={[0, 0.18, 0]} scale={[0.34, 0.3, 0.38]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color="#f59e0b" />
          </mesh>
        </group>
      )}

      {/* 4. THỎ TRẮNG TAI DÀI (BUNNY) */}
      {(petId === 'pet_bunny' || petId === 'cloud_pet') && (
        <group>
          <mesh position={[0, 0.46, 0.1]} scale={[0.4, 0.36, 0.38]}>
            <sphereGeometry args={[1, 20, 20]} />
            <ToyMat color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Tai thỏ dài dựng cao */}
          <mesh position={[-0.16, 0.88, 0.02]} rotation={[0, 0, 0.15]} scale={[0.09, 0.32, 0.06]}>
            <capsuleGeometry args={[1, 1.2, 4, 8]} />
            <ToyMat color="#fbcfe8" />
          </mesh>
          <mesh position={[0.16, 0.88, 0.02]} rotation={[0, 0, -0.15]} scale={[0.09, 0.32, 0.06]}>
            <capsuleGeometry args={[1, 1.2, 4, 8]} />
            <ToyMat color="#fbcfe8" />
          </mesh>
          {/* Mắt thỏ hồng ngọc */}
          <mesh position={[-0.16, 0.52, 0.42]} scale={[0.06, 0.08, 0.04]}>
            <sphereGeometry />
            <ToyMat color="#f43f5e" />
          </mesh>
          <mesh position={[0.16, 0.52, 0.42]} scale={[0.06, 0.08, 0.04]}>
            <sphereGeometry />
            <ToyMat color="#f43f5e" />
          </mesh>
          {/* Cà rốt mini ôm trước ngực */}
          <mesh position={[0, 0.24, 0.32]} rotation={[0.4, 0, 0.3]} scale={[0.07, 0.2, 0.07]}>
            <coneGeometry />
            <ToyMat color="#f97316" />
          </mesh>
          {/* Thân tròn trắng */}
          <mesh position={[0, 0.16, 0]} scale={[0.32, 0.28, 0.32]}>
            <sphereGeometry args={[1, 16, 16]} />
            <ToyMat color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* 5. CHIM CÁNH CỤT HOÀNG ĐẾ MINI (PENGUIN) */}
      {petId === 'pet_penguin' && (
        <group>
          {/* Thân tròn đen bóng */}
          <mesh position={[0, 0.36, 0]} scale={[0.36, 0.44, 0.36]}>
            <sphereGeometry args={[1, 20, 20]} />
            <ToyMat color="#1e293b" roughness={0.3} />
          </mesh>
          {/* Bụng trắng */}
          <mesh position={[0, 0.34, 0.16]} scale={[0.26, 0.34, 0.22]}>
            <sphereGeometry args={[1, 20, 20]} />
            <ToyMat color="#f8fafc" />
          </mesh>
          {/* Mỏ vàng cam */}
          <mesh position={[0, 0.48, 0.36]} rotation={[0.3, 0, 0]} scale={[0.09, 0.08, 0.16]}>
            <coneGeometry />
            <ToyMat color="#f59e0b" />
          </mesh>
          {/* Khăn choàng cổ vàng */}
          <mesh position={[0, 0.38, 0.08]} scale={[0.38, 0.08, 0.38]}>
            <cylinderGeometry args={[1, 1, 1, 16]} />
            <ToyMat color="#fbbf24" />
          </mesh>
          {/* Cánh mini vỗ hai bên */}
          <mesh position={[-0.34, 0.32, 0]} rotation={[0, 0, 0.4]} scale={[0.08, 0.26, 0.14]}>
            <boxGeometry />
            <ToyMat color="#0f172a" />
          </mesh>
          <mesh position={[0.34, 0.32, 0]} rotation={[0, 0, -0.4]} scale={[0.08, 0.26, 0.14]}>
            <boxGeometry />
            <ToyMat color="#0f172a" />
          </mesh>
        </group>
      )}

      {/* 6. CÁO LỬA THẦN RỪNG (FENNEC FOX) */}
      {petId === 'pet_fox' && (
        <group>
          {/* Đầu cáo thon cam đỏ */}
          <mesh position={[0, 0.48, 0.1]} scale={[0.38, 0.36, 0.4]}>
            <sphereGeometry args={[1, 20, 20]} />
            <ToyMat color="#ea580c" roughness={0.35} />
          </mesh>
          {/* Má lông trắng hai bên */}
          <mesh position={[-0.2, 0.38, 0.24]} scale={[0.16, 0.16, 0.16]}>
            <sphereGeometry />
            <ToyMat color="#fff7ed" />
          </mesh>
          <mesh position={[0.2, 0.38, 0.24]} scale={[0.16, 0.16, 0.16]}>
            <sphereGeometry />
            <ToyMat color="#fff7ed" />
          </mesh>
          {/* Tai cáo siêu to đặc trưng fennec */}
          <mesh position={[-0.26, 0.86, 0.04]} rotation={[0, 0, 0.4]} scale={[0.18, 0.34, 0.06]}>
            <coneGeometry args={[1, 1.5, 4]} />
            <ToyMat color="#c2410c" />
          </mesh>
          <mesh position={[0.26, 0.86, 0.04]} rotation={[0, 0, -0.4]} scale={[0.18, 0.34, 0.06]}>
            <coneGeometry args={[1, 1.5, 4]} />
            <ToyMat color="#c2410c" />
          </mesh>
          {/* Đuôi xù bồng bềnh */}
          <mesh position={[0, 0.22, -0.32]} rotation={[-0.6, 0, 0]} scale={[0.16, 0.36, 0.18]}>
            <sphereGeometry />
            <ToyMat color="#ea580c" />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ============================================================================
// 10. COMPONENT TỔNG HỢP: NHÂN VẬT CHIBI 3D MODULAR CHÍNH THỨC CỦA PIPPO
// ============================================================================
export const ChibiModularCharacter3D: React.FC<ChibiCharacterProps> = ({
  gender = 'girl',
  equippedSkin = {},
  petId,
  scale = 1,
  position = [0, 0, 0],
  isJumping = false,
  onClickCharacter,
  showPet = true,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rootRef.current) {
      // Hoạt ảnh thở nhún nhảy tự nhiên (Cute Idle Breathing)
      const breath = Math.sin(t * 3.0) * 0.025;
      const jump = isJumping ? Math.abs(Math.sin(t * 10)) * 0.28 : 0;
      rootRef.current.position.y = position[1] + breath + jump;
      rootRef.current.rotation.y = Math.sin(t * 0.9) * 0.12;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = t * 1.5;
    }
  });

  // Tự động gán khiên nếu bé mặc đồ Warrior mà chưa trang bị khiên
  const effectiveShield =
    equippedSkin.shield ||
    (equippedSkin.outfit === 'outfit_warrior' || equippedSkin.outfit === 'knight_armor'
      ? 'shield_warrior'
      : undefined);

  return (
    <group ref={rootRef} position={position} scale={scale} onClick={onClickCharacter}>
      {/* 1. KHUÔN MẶT, ĐẦU VÀ MÁI TÓC */}
      <ChibiHeadAndFace gender={gender} hairId={equippedSkin.hair} />

      {/* 2. BODY CHIBI MẶC ĐỊNH (SWIMWEAR / UNDERGARMENT) */}
      <ChibiBodyBase gender={gender} />

      {/* 3. MŨ / VƯƠNG MIỆN / GIÁP ĐẦU */}
      <ModularHat3D hatId={equippedSkin.hat} />

      {/* 4. TRANG PHỤC TOÀN THÂN (VÁY / GIÁP / TUNIC) */}
      <ModularOutfit3D outfitId={equippedSkin.outfit} />

      {/* 5. VŨ KHÍ TAY PHẢI (TRƯỢNG / KIẾM / CUNG) */}
      <ModularHandItem3D itemId={equippedSkin.hand_item} />

      {/* 6. KHIÊN TAY TRÁI */}
      <ModularShield3D shieldId={effectiveShield} />

      {/* 7. CÁNH & TRANG BỊ LƯNG */}
      <ModularBackItem3D backId={equippedSkin.wing} />

      {/* 8. THÚ CƯNG MINI CHẠY DƯỚI CHÂN */}
      {showPet && <GroundPetCompanion3D petId={petId} />}

      {/* 9. HIỆU ỨNG HÀO QUANG (AURA VFX CHO ĐỒ HUYỀN THOẠI) */}
      {equippedSkin.aura && equippedSkin.aura !== 'none' && (
        <group ref={auraRef} position={[0, 0.4, 0]}>
          <Sparkles
            count={equippedSkin.aura === 'rainbow_ring' ? 45 : 25}
            scale={2.2}
            size={equippedSkin.aura === 'starlight' ? 4.5 : 3.0}
            speed={0.6}
            color={
              equippedSkin.aura === 'starlight'
                ? '#fde047'
                : equippedSkin.aura === 'rainbow_ring'
                ? '#ec4899'
                : '#38bdf8'
            }
          />
        </group>
      )}
    </group>
  );
};
