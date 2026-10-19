import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Volume2,
  Sparkles as SparklesIcon,
  Lock,
  Check,
  Hammer,
  Eye,
  Sun,
  Sunset,
  Snowflake,
  Orbit,
} from 'lucide-react';
import {
  ISLAND_DECOR_CATALOG,
  IslandDecorCategory,
  IslandDecorItem,
} from '../../data/curriculumData';
import {
  useGameStore,
  PlacedIslandDecor,
  HomeIslandTheme,
} from '../../store/useGameStore';
import { NormalizedGlbModel, Character3DModel } from '../three/Avatar3DScene';
import { ToyMaterial, FluffyTree3D, FluffyCloud3D } from '../three/Sculpted3DModels';
import { sound } from '../../lib/sound';

// ============================================================================
// 16 Ô ĐẤT XÂY DỰNG TRÊN HÒN ĐẢO CÁ NHÂN RỘNG LỚN (16 PLACEMENT SLOTS)
// ============================================================================
export interface IslandSlotMeta {
  slotIndex: number;
  label: string;
  zoneName: string;
  position: [number, number, number];
}

export const HOME_ISLAND_SLOTS: IslandSlotMeta[] = [
  { slotIndex: 0, label: 'Ô 1: Cổng Chào Chính', zoneName: 'Cổng Đảo', position: [0, 0.32, 4.15] },
  { slotIndex: 1, label: 'Ô 2: Lối Vào Trái', zoneName: 'Cổng Đảo', position: [-1.85, 0.32, 3.7] },
  { slotIndex: 2, label: 'Ô 3: Lối Vào Phải', zoneName: 'Cổng Đảo', position: [1.85, 0.32, 3.7] },
  { slotIndex: 3, label: 'Ô 4: Quảng Trường Giữa', zoneName: 'Trung Tâm', position: [0, 0.34, 1.35] },
  { slotIndex: 4, label: 'Ô 5: Quảng Trường Tây', zoneName: 'Trung Tâm', position: [-2.2, 0.32, 1.3] },
  { slotIndex: 5, label: 'Ô 6: Khu Biệt Thự Đông', zoneName: 'Trung Tâm', position: [2.35, 0.32, 1.25] },
  { slotIndex: 6, label: 'Ô 7: Bờ Hồ Pha Lê Bắc', zoneName: 'Hồ Nước', position: [-3.75, 0.32, -0.1] },
  { slotIndex: 7, label: 'Ô 8: Bờ Hồ Pha Lê Nam', zoneName: 'Hồ Nước', position: [-3.55, 0.32, 2.1] },
  { slotIndex: 8, label: 'Ô 9: Vườn Cổ Thụ Tây', zoneName: 'Vườn Xanh', position: [-3.2, 0.32, -2.1] },
  { slotIndex: 9, label: 'Ô 10: Đỉnh Đồi Hoàng Gia', zoneName: 'Đồi Cao', position: [0, 0.76, -2.5] },
  { slotIndex: 10, label: 'Ô 11: Đồi Cao Phía Đông', zoneName: 'Đồi Cao', position: [2.6, 0.76, -2.2] },
  { slotIndex: 11, label: 'Ô 12: Đồi Cao Phía Tây', zoneName: 'Đồi Cao', position: [-1.9, 0.76, -3.1] },
  { slotIndex: 12, label: 'Ô 13: Sân Trưng Bày Đông', zoneName: 'Sân Đỗ', position: [3.95, 0.32, -0.2] },
  { slotIndex: 13, label: 'Ô 14: Vườn Hoa Đông Nam', zoneName: 'Vườn Xanh', position: [3.65, 0.32, 2.15] },
  { slotIndex: 14, label: 'Ô 15: Đài Ngắm Sao Bắc', zoneName: 'Đồi Cao', position: [0.4, 0.76, -4.0] },
  { slotIndex: 15, label: 'Ô 16: Mỏm Đá Vệ Thần', zoneName: 'Đồi Cao', position: [3.1, 0.76, -3.5] },
];

const CATEGORY_TABS: { id: IslandDecorCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'Tất Cả', emoji: '✨' },
  { id: 'gate', label: 'Cổng Chào & Đài Phun', emoji: '⛩️' },
  { id: 'statue', label: 'Tượng Đá & Cúp', emoji: '🗿' },
  { id: 'building', label: 'Lâu Đài & Nhà', emoji: '🏰' },
  { id: 'nature', label: 'Cây & Vườn Cảnh', emoji: '🌳' },
  { id: 'vehicle', label: 'Siêu Xe & Máy Bay', emoji: '✈️' },
];

// ============================================================================
// CÁC CÔNG TRÌNH 3D ĐIÊU KHẮC ĐẶC BIỆT (CỔNG CHÀO, TƯỢNG ĐÁ, ĐÀI PHUN NƯỚC)
// ============================================================================
const SculptedIslandDecorMesh: React.FC<{
  sculptType: NonNullable<IslandDecorItem['sculptType']>;
}> = ({ sculptType }) => {
  const animRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (animRef.current) {
      animRef.current.rotation.y = t * 1.4;
      animRef.current.position.y = Math.sin(t * 3) * 0.08;
    }
  });

  // 1. CỔNG CHÀO CẦU VỒNG 3D (RAINBOW WELCOME ARCH)
  if (sculptType === 'rainbow_gate') {
    const rainbowColors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#a855f7'];
    return (
      <group position={[0, 0, 0]}>
        {/* 2 Trụ Cổng Đá Cẩm Thạch Trắng */}
        {[-1.05, 1.05].map((x, i) => (
          <group key={i} position={[x, 0.55, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.28, 1.1, 20]} />
              <ToyMaterial color="#f8fafc" clearcoat={0.8} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.32, 0.35, 0.18, 20]} />
              <ToyMaterial color="#facc15" metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.25, 20, 20]} />
              <ToyMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
        {/* Vòm Cầu Vồng 6 Sắc */}
        <group position={[0, 1.05, 0]}>
          {rainbowColors.map((col, idx) => (
            <mesh key={idx}>
              <torusGeometry args={[1.05 - idx * 0.07, 0.045, 14, 36, Math.PI]} />
              <ToyMaterial color={col} emissive={col} emissiveIntensity={0.35} />
            </mesh>
          ))}
        </group>
        {/* Ngôi Sao Vàng Trên Đỉnh Cổng Chào */}
        <group ref={animRef} position={[0, 2.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.26, 0]} />
            <ToyMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.95} />
          </mesh>
        </group>
      </group>
    );
  }

  // 2. CỔNG ĐÁ CỔ NGỮ PHÉP THUẬT (ANCIENT STONE TORII GATE)
  if (sculptType === 'stone_torii') {
    return (
      <group position={[0, 0, 0]}>
        {/* 2 Cột Đá Cổ Thụ */}
        {[-0.95, 0.95].map((x, i) => (
          <group key={i} position={[x, 0.85, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.24, 1.7, 16]} />
              <ToyMaterial color="#475569" roughness={0.6} />
            </mesh>
            {/* Vòng Cổ Ngữ Phát Sáng Trên Cột */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.21, 0.035, 12, 24]} />
              <ToyMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1} />
            </mesh>
          </group>
        ))}
        {/* Xà Ngang Đá Tầng Dưới */}
        <RoundedBox args={[2.5, 0.18, 0.28]} radius={0.05} position={[0, 1.4, 0]}>
          <ToyMaterial color="#64748b" roughness={0.5} />
        </RoundedBox>
        {/* Mái Đá Cong Tầng Trên */}
        <RoundedBox args={[2.9, 0.24, 0.42]} radius={0.08} position={[0, 1.75, 0]}>
          <ToyMaterial color="#334155" roughness={0.5} />
        </RoundedBox>
        {/* Ngọc Cổ Ngữ Giữa Cổng */}
        <group ref={animRef} position={[0, 1.58, 0]}>
          <mesh>
            <octahedronGeometry args={[0.2, 0]} />
            <ToyMaterial color="#38bdf8" emissive="#22d3ee" emissiveIntensity={1.2} />
          </mesh>
        </group>
      </group>
    );
  }

  // 3. ĐÀI PHUN NƯỚC PHA LÊ 3D (CRYSTAL MAGIC FOUNTAIN)
  if (sculptType === 'crystal_fountain') {
    return (
      <group position={[0, 0, 0]}>
        {/* Hồ Đá Cẩm Thạch Tầng 1 */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.15, 1.25, 0.35, 32]} />
          <ToyMaterial color="#e2e8f0" clearcoat={0.8} />
        </mesh>
        {/* Mặt Nước Xanh Lấp Lánh */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.1, 32]} />
          <ToyMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.45} clearcoat={1} />
        </mesh>
        {/* Trụ Giữa & Đĩa Phun Tầng 2 */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.22, 0.32, 0.75, 20]} />
          <ToyMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.62, 0.45, 0.18, 28]} />
          <ToyMaterial color="#e2e8f0" />
        </mesh>
        {/* Pha Lê Nước Xoay Trên Đỉnh */}
        <group ref={animRef} position={[0, 1.48, 0]}>
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <ToyMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={0.95} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.03, 12, 28]} />
            <ToyMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.7} />
          </mesh>
        </group>
      </group>
    );
  }

  // 4. TƯỢNG CÚP VÀNG QUÁN QUÂN (GOLDEN CHAMPION TROPHY)
  if (sculptType === 'golden_trophy') {
    return (
      <group position={[0, 0, 0]}>
        {/* Bệ Đá Đen Viền Vàng */}
        <RoundedBox args={[0.95, 0.45, 0.95]} radius={0.08} position={[0, 0.22, 0]}>
          <ToyMaterial color="#1e293b" roughness={0.3} />
        </RoundedBox>
        {/* Chân Cúp & Bầu Cúp Vàng Ròng */}
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.14, 0.28, 0.5, 24]} />
          <ToyMaterial color="#facc15" metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.45, 0.22, 0.65, 28]} />
          <ToyMaterial color="#facc15" metalness={0.85} roughness={0.12} clearcoat={1} />
        </mesh>
        {/* Quai Cúp 2 Bên */}
        <mesh position={[0, 1.18, 0]}>
          <torusGeometry args={[0.46, 0.055, 14, 32]} />
          <ToyMaterial color="#fde047" metalness={0.8} />
        </mesh>
        {/* Ngôi Sao Quán Quân Trên Đỉnh */}
        <group ref={animRef} position={[0, 1.75, 0]}>
          <mesh>
            <octahedronGeometry args={[0.22, 0]} />
            <ToyMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1} />
          </mesh>
        </group>
      </group>
    );
  }

  // 5. TRỤ ĐÈN ĐƯỜNG ÁNH SAO (STARLIGHT GARDEN LAMP)
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.25, 0.32, 0.24, 16]} />
        <ToyMaterial color="#334155" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.4, 16]} />
        <ToyMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <ToyMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <coneGeometry args={[0.28, 0.22, 16]} />
        <ToyMaterial color="#334155" metalness={0.6} />
      </mesh>
    </group>
  );
};

// ============================================================================
// COMPONENT HIỂN THỊ 1 VẬT PHẨM TRANG TRÍ ĐÃ ĐẶT TRÊN ĐẢO 3D
// ============================================================================
const PlacedDecor3DObject: React.FC<{
  placed: PlacedIslandDecor;
  meta: IslandDecorItem;
  slot: IslandSlotMeta;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ placed, meta, slot, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={slot.position}
      rotation={[0, placed.rotationY, 0]}
      scale={placed.scale * (hovered ? 1.06 : 1)}
      onClick={(e) => {
        e.stopPropagation();
        sound.playPop();
        onSelect();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Vòng sáng báo hiệu vật phẩm đang được chọn để chỉnh sửa */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.055, 16, 36]} />
          <ToyMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1} />
        </mesh>
      )}

      {/* Nội dung 3D: File .GLB thực tế hoặc Công trình Điêu khắc 3D (đặt trực tiếp lên mặt đất tự nhiên của đảo) */}
      <group position={[0, 0, 0]}>
        {meta.glbUrl ? (
          <Suspense fallback={null}>
            <NormalizedGlbModel url={meta.glbUrl} targetSize={1.55} alignBottom={true} />
          </Suspense>
        ) : meta.sculptType ? (
          <SculptedIslandDecorMesh sculptType={meta.sculptType} />
        ) : null}
      </group>

      {/* Nhãn tên tiếng Anh nổi lên khi chọn hoặc rê chuột */}
      {(isSelected || hovered) && (
        <Html position={[0, 2.25, 0]} center distanceFactor={11} zIndexRange={[15, 0]}>
          <div className="bg-slate-900/90 text-white px-3 py-1 rounded-2xl border-2 border-amber-300 shadow-xl whitespace-nowrap flex items-center gap-1.5 font-display font-bold text-xs pointer-events-none">
            <span>{meta.emoji}</span>
            <span>{meta.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

// Danh sách 6 File .GLB Hòn Đảo Bay người dùng đã tải về trong public/models
export interface DownloadedIslandGlbOption {
  id: string;
  label: string;
  shortLabel: string;
  url: string;
  targetSize: number;
  position: [number, number, number];
  rotationY?: number;
}

export const DOWNLOADED_ISLAND_GLB_MODELS: DownloadedIslandGlbOption[] = [
  {
    id: 'expanse_v7',
    label: 'Đảo Thảo Nguyên Bay V7 (floating_island_expanse_v7.glb)',
    shortLabel: '🏝️ Thảo Nguyên V7',
    url: '/models/floating_island_expanse_v7.glb',
    targetSize: 14.2,
    position: [0, -1.45, 0],
    rotationY: 0,
  },
  {
    id: 'andrews_v2',
    label: 'Đảo Đá Ngầm Andrew V2 (andrews_floating_island_unity_v2.glb)',
    shortLabel: '⛰️ Đảo Andrew V2',
    url: '/models/andrews_floating_island_unity_v2.glb',
    targetSize: 13.8,
    position: [0, -1.5, 0],
    rotationY: Math.PI / 6,
  },
  {
    id: 'floating_forest',
    label: 'Đảo Cổ Thụ Rừng Xanh (floating_island.glb)',
    shortLabel: '🌳 Đảo Cổ Thụ',
    url: '/models/floating_island.glb',
    targetSize: 14.0,
    position: [0, -1.2, -0.4],
    rotationY: 0,
  },
  {
    id: 'roots_rocks',
    label: 'Đảo Rễ Cây & Đá Cổ (floating_island_with_roots_and_rocks.glb)',
    shortLabel: '🪨 Đảo Rễ Cổ Thụ',
    url: '/models/floating_island_with_roots_and_rocks.glb',
    targetSize: 14.5,
    position: [0, -1.55, 0],
    rotationY: 0,
  },
  {
    id: 'island_peak',
    label: 'Đỉnh Núi Thiên Không (floating_island_peak.glb)',
    shortLabel: '🏔️ Đỉnh Thiên Không',
    url: '/models/floating_island_peak.glb',
    targetSize: 15.0,
    position: [0, -1.4, -0.6],
    rotationY: 0,
  },
  {
    id: 'mine_house',
    label: 'Đảo Hầm Mỏ & Nhà Gỗ (stylized_3d_floating_island_and_mine_house.glb)',
    shortLabel: '🏡 Đảo Hầm Mỏ',
    url: '/models/stylized_3d_floating_island_and_mine_house.glb',
    targetSize: 13.6,
    position: [0, -1.1, -1.1],
    rotationY: 0,
  },
];

// ============================================================================
// COMPONENT MẶT ĐẤT & ĐỊA HÌNH HÒN ĐẢO CÁ NHÂN RỘNG LỚN 3D (KẾT HỢP FILE .GLB)
// ============================================================================
const SpaciousIslandTerrain3D: React.FC<{
  theme: HomeIslandTheme;
  selectedIslandGlb: DownloadedIslandGlbOption;
  isEditMode: boolean;
  activeSlotIndex: number;
  occupiedSlotSet: Set<number>;
  onClickSlot: (slotIndex: number) => void;
}> = ({ theme, selectedIslandGlb, isEditMode, activeSlotIndex, occupiedSlotSet, onClickSlot }) => {
  const grassColor =
    theme === 'winter'
      ? '#f1f5f9'
      : theme === 'sunset'
      ? '#84cc16'
      : theme === 'galaxy'
      ? '#4ade80'
      : '#4ade80';

  return (
    <group>
      {/* 1. Mô Hình Đảo Bay .GLB Chính (từ các file người dùng tải về) */}
      <group
        position={selectedIslandGlb.position}
        rotation={[0, selectedIslandGlb.rotationY || 0, 0]}
      >
        <Suspense fallback={null}>
          <NormalizedGlbModel
            url={selectedIslandGlb.url}
            targetSize={selectedIslandGlb.targetSize}
            alignBottom={false}
          />
        </Suspense>
      </group>

      {/* 2. Hai Đảo Vệ Tinh Nhỏ Bay Lơ Lửng Xung Quanh (Dùng file .GLB thực tế tạo quần đảo sống động) */}
      <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.45}>
        <group position={[-7.8, -0.8, -4.6]}>
          <Suspense fallback={null}>
            <NormalizedGlbModel
              url="/models/andrews_floating_island_unity_v2.glb"
              targetSize={3.8}
              alignBottom={false}
            />
          </Suspense>
          <group position={[0, 0.95, 0]}>
            <Suspense fallback={null}>
              <NormalizedGlbModel
                url="/models/Crystal3D.glb"
                targetSize={1.1}
                alignBottom={true}
              />
            </Suspense>
          </group>
        </group>
      </Float>

      <Float speed={1.9} rotationIntensity={0.08} floatIntensity={0.5}>
        <group position={[7.9, -0.5, -4.2]}>
          <Suspense fallback={null}>
            <NormalizedGlbModel
              url="/models/floating_island_expanse_v7.glb"
              targetSize={3.6}
              alignBottom={false}
            />
          </Suspense>
          <FluffyTree3D position={[0, 0.75, 0]} leafColor="#ec4899" scale={0.55} />
        </group>
      </Float>

      {/* 3. Hiển Thị 16 Ô Đất Tương Tác (Placement Slots - Chỉ hiển thị khi bật Chế Độ Chỉnh Sửa) */}
      {isEditMode &&
        HOME_ISLAND_SLOTS.map((slot) => {
          const isOccupied = occupiedSlotSet.has(slot.slotIndex);
          const isCurrentSlot = activeSlotIndex === slot.slotIndex;

          return (
            <group
              key={slot.slotIndex}
              position={slot.position}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onClickSlot(slot.slotIndex);
              }}
            >
              {/* Đĩa Ô Đất Phát Sáng khi Đang Chọn hoặc chưa có đồ */}
              {(!isOccupied || isCurrentSlot) && (
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.48, 0.68, 24]} />
                  <meshBasicMaterial
                    color={isCurrentSlot ? '#facc15' : '#ffffff'}
                    transparent
                    opacity={isCurrentSlot ? 0.95 : 0.45}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}

            {isEditMode && !isOccupied && (
              <Html position={[0, 0.35, 0]} center distanceFactor={13} zIndexRange={[15, 0]}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onClickSlot(slot.slotIndex);
                  }}
                  className={`px-2 py-0.5 rounded-full font-display font-extrabold text-[10px] whitespace-nowrap shadow border cursor-pointer transition-transform ${
                    isCurrentSlot
                      ? 'bg-amber-400 text-slate-950 border-white scale-110 ring-2 ring-amber-300'
                      : 'bg-slate-900/75 text-white border-white/40 hover:scale-105'
                  }`}
                >
                  ➕ Ô {slot.slotIndex + 1}
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

// ============================================================================
// GIAO DIỆN CHÍNH: ĐẢO CÁ NHÂN 3D & KHO ĐỒ TRANG TRÍ ĐẢO
// ============================================================================
export const PersonalHomeIsland3D: React.FC = () => {
  const {
    nickname,
    avatarBase,
    equippedSkin,
    petState,
    rainbowGems,
    unlockedDecorIds,
    placedIslandDecors,
    homeIslandTheme,
    buyOrUnlockDecor,
    placeIslandDecor,
    updatePlacedDecor,
    removePlacedDecor,
    setHomeIslandTheme,
  } = useGameStore();

  const [categoryFilter, setCategoryFilter] = useState<IslandDecorCategory | 'all'>('all');
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [selectedIslandGlbId, setSelectedIslandGlbId] = useState<string>('expanse_v7');
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(3); // Mặc định chọn Ô 4: Quảng Trường Giữa
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [pendingDecorToPlace, setPendingDecorToPlace] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedIslandGlb =
    DOWNLOADED_ISLAND_GLB_MODELS.find((m) => m.id === selectedIslandGlbId) ||
    DOWNLOADED_ISLAND_GLB_MODELS[0];

  const showNotice = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const occupiedSlotSet = new Set(placedIslandDecors.map((p) => p.slotIndex));
  const selectedPlacedObj = placedIslandDecors.find((p) => p.instanceId === selectedInstanceId) || null;
  const selectedPlacedMeta = selectedPlacedObj
    ? ISLAND_DECOR_CATALOG.find((d) => d.id === selectedPlacedObj.decorId) || null
    : null;

  const filteredCatalog = ISLAND_DECOR_CATALOG.filter(
    (item) => categoryFilter === 'all' || item.category === categoryFilter
  );

  // Khi người chơi bấm vào 1 Ô Đất trên Đảo 3D
  const handleSelectSlotOnIsland = (slotIdx: number) => {
    setActiveSlotIndex(slotIdx);
    const existing = placedIslandDecors.find((p) => p.slotIndex === slotIdx);

    if (pendingDecorToPlace) {
      placeIslandDecor(pendingDecorToPlace, slotIdx);
      const meta = ISLAND_DECOR_CATALOG.find((d) => d.id === pendingDecorToPlace);
      if (meta) {
        sound.playSuccess();
        sound.speakEnglish(`${meta.name}! ${meta.englishSentence}`);
        showNotice(`✨ Đã đặt "${meta.vietnameseName}" lên Ô ${slotIdx + 1}!`);
      }
      setPendingDecorToPlace(null);
      return;
    }

    if (existing) {
      setSelectedInstanceId(existing.instanceId);
    } else {
      setSelectedInstanceId(null);
      showNotice(`📍 Đang chọn ${HOME_ISLAND_SLOTS[slotIdx]?.label}. Hãy bấm 1 vật phẩm bên phải để đặt xuống!`);
    }
  };

  // Khi người chơi bấm vào 1 Vật Phẩm trong Kho Đồ / Cửa Hàng bên phải
  const handleDecorItemAction = (item: IslandDecorItem) => {
    const isUnlocked = unlockedDecorIds.includes(item.id) || item.priceGems === 0;

    if (!isUnlocked) {
      if (rainbowGems < item.priceGems) {
        sound.playGentleTryAgain();
        showNotice(
          `Cần thêm ${item.priceGems - rainbowGems} 💎 Ngọc Cầu Vồng (hoặc vượt qua Đảo Boss #${
            item.unlockByIslandNumber || 10
          }) để sở hữu "${item.vietnameseName}"!`
        );
        return;
      }
      const ok = buyOrUnlockDecor(item.id, item.priceGems);
      if (ok) {
        sound.playWinFanfare();
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
        placeIslandDecor(item.id, activeSlotIndex);
        sound.speakEnglish(`Unlocked ${item.name}!`);
        showNotice(`🎉 Đã mở khóa & đặt "${item.vietnameseName}" lên Ô ${activeSlotIndex + 1}!`);
      }
      return;
    }

    // Nếu đã mở khóa -> Đặt ngay vào Ô Đất đang chọn (hoặc chọn ô trống tiếp theo)
    sound.playPop();
    placeIslandDecor(item.id, activeSlotIndex);
    sound.speakEnglish(`${item.name}. ${item.englishSentence}`);
    showNotice(`🏡 Đã đặt "${item.vietnameseName}" tại ${HOME_ISLAND_SLOTS[activeSlotIndex]?.label}!`);
  };

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4 px-5 py-2 relative overflow-hidden">
      {/* Thông báo nổi */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-display font-extrabold text-sm px-5 py-2.5 rounded-3xl shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce">
          <SparklesIcon className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= CỘT TRÁI (7 CỘT): KHÔNG GIAN ĐẢO CÁ NHÂN 3D RỘNG LỚN ================= */}
      <div className="col-span-7 h-full rounded-3xl border-4 border-white/35 bg-slate-950/35 backdrop-blur-md relative overflow-hidden flex flex-col justify-between shadow-2xl">
        {/* Thanh điều khiển góc trên Đảo Cá Nhân */}
        <div className="p-2.5 flex flex-col gap-2 z-20 pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl border border-white/20 flex items-center gap-2">
              <span className="text-xl">🏝️</span>
              <div>
                <div className="font-display font-extrabold text-xs">
                  Đảo Cá Nhân 3D Của {nickname} ({placedIslandDecors.length}/16 Công Trình)
                </div>
                <div className="text-[10px] text-amber-300 font-bold">
                  Đang chọn: {HOME_ISLAND_SLOTS[activeSlotIndex]?.label}
                </div>
              </div>
            </div>

            {/* Đổi Thời Tiết / Bầu Trời Đảo & Chế Độ Xây Dựng */}
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'sunny', icon: Sun, label: 'Nắng Xuân' },
                  { id: 'sunset', icon: Sunset, label: 'Hoàng Hôn' },
                  { id: 'winter', icon: Snowflake, label: 'Đảo Tuyết' },
                  { id: 'galaxy', icon: Orbit, label: 'Ngân Hà' },
                ] as const
              ).map((th) => {
                const IconComp = th.icon;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      sound.playClick();
                      setHomeIslandTheme(th.id);
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                      homeIslandTheme === th.id
                        ? 'bg-amber-400 text-slate-950 border-white shadow'
                        : 'bg-slate-900/70 text-white border-white/20 hover:bg-slate-800'
                    }`}
                    title={th.label}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}

              <button
                onClick={() => {
                  sound.playClick();
                  setIsEditMode(!isEditMode);
                }}
                className={`px-3 py-1.5 rounded-2xl font-display font-extrabold text-xs flex items-center gap-1.5 border-2 cursor-pointer ${
                  isEditMode
                    ? 'bg-emerald-500 text-white border-white shadow-lg'
                    : 'bg-sky-500 text-white border-white shadow-lg'
                }`}
              >
                {isEditMode ? <Hammer className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isEditMode ? 'Đang Xây Dựng' : 'Chế Độ Ngắm Đảo'}</span>
              </button>
            </div>
          </div>

          {/* Thanh chọn nhanh 6 Mô Hình Hòn Đảo .GLB người dùng đã tải về */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-extrabold text-amber-300 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-amber-400/40 whitespace-nowrap">
              🏔️ Mẫu Đảo .GLB:
            </span>
            {DOWNLOADED_ISLAND_GLB_MODELS.map((glbOpt) => {
              const active = selectedIslandGlbId === glbOpt.id;
              return (
                <button
                  key={glbOpt.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedIslandGlbId(glbOpt.id);
                    showNotice(`🏔️ Đã chuyển sang nền "${glbOpt.label}"!`);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-display font-extrabold text-[10px] whitespace-nowrap border transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-slate-950 border-white shadow scale-105'
                      : 'bg-slate-900/75 text-white border-white/25 hover:bg-slate-800'
                  }`}
                  title={glbOpt.label}
                >
                  {glbOpt.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Canvas 3D Hòn Đảo Cá Nhân */}
        <div className="flex-1 relative">
          <Canvas shadows camera={{ position: [0, 7.2, 11.2], fov: 42 }}>
            <ambientLight intensity={homeIslandTheme === 'galaxy' ? 0.7 : 0.95} />
            <hemisphereLight
              args={[
                homeIslandTheme === 'sunset' ? '#fed7aa' : '#ffffff',
                homeIslandTheme === 'galaxy' ? '#312e81' : '#38bdf8',
                0.7,
              ]}
            />
            <directionalLight position={[7, 12, 8]} intensity={1.45} castShadow />
            <pointLight position={[-6, 5, 4]} intensity={0.8} color="#f472b6" />
            <Sparkles
              count={homeIslandTheme === 'winter' ? 95 : 60}
              scale={15}
              size={3.5}
              speed={0.4}
              color={homeIslandTheme === 'winter' ? '#ffffff' : '#fde047'}
            />

            <FluffyCloud3D position={[-6.2, 3.8, -4.5]} scale={1.15} />
            <FluffyCloud3D position={[5.8, 4.1, -4.2]} scale={1.2} />

            {/* Địa hình Hòn Đảo Cá Nhân Rộng Lớn (.GLB + 16 Ô Đất) */}
            <SpaciousIslandTerrain3D
              theme={homeIslandTheme}
              selectedIslandGlb={selectedIslandGlb}
              isEditMode={isEditMode}
              activeSlotIndex={activeSlotIndex}
              occupiedSlotSet={occupiedSlotSet}
              onClickSlot={handleSelectSlotOnIsland}
            />

            {/* Tất cả các Tượng Đá, Cổng Chào, Lâu Đài, Cây Cối đã đặt trên Đảo */}
            {placedIslandDecors.map((placed) => {
              const meta = ISLAND_DECOR_CATALOG.find((d) => d.id === placed.decorId);
              const slot = HOME_ISLAND_SLOTS.find((s) => s.slotIndex === placed.slotIndex);
              if (!meta || !slot) return null;
              return (
                <PlacedDecor3DObject
                  key={placed.instanceId}
                  placed={placed}
                  meta={meta}
                  slot={slot}
                  isSelected={selectedInstanceId === placed.instanceId}
                  onSelect={() => {
                    setSelectedInstanceId(placed.instanceId);
                    setActiveSlotIndex(placed.slotIndex);
                    sound.speakEnglish(`${meta.name}. ${meta.englishSentence}`);
                  }}
                />
              );
            })}

            {/* Nhân vật 3D .GLB và Thú Cưng của bé đi dạo ngay giữa Đảo Cá Nhân */}
            <Character3DModel
              avatarBase={avatarBase}
              equippedSkin={equippedSkin}
              petState={petState}
              position={[-0.95, 0.5, 2.55]}
              scale={0.72}
              onClickCharacter={() =>
                sound.speakEnglish(`Welcome to my personal island! Let's decorate it together!`)
              }
            />

            <ContactShadows position={[0, -0.25, 0]} opacity={0.35} scale={14} blur={2.4} />
            <OrbitControls
              enablePan={true}
              minDistance={5.5}
              maxDistance={16}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.15}
            />
          </Canvas>
        </div>

        {/* Thanh Công Cụ Chỉnh Sửa Vật Phẩm Đang Chọn Trên Đảo (Xoay góc, Phóng to/Thu nhỏ, Cất vào kho) */}
        {selectedPlacedObj && selectedPlacedMeta ? (
          <div className="m-3 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border-2 border-amber-300 text-white flex items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl bg-amber-400/20 p-2 rounded-2xl border border-amber-300/40">
                {selectedPlacedMeta.emoji}
              </span>
              <div>
                <div className="font-display font-extrabold text-sm flex items-center gap-2">
                  <span>{selectedPlacedMeta.vietnameseName}</span>
                  <span className="text-xs text-amber-300">({selectedPlacedMeta.name})</span>
                </div>
                <div className="text-[11px] text-slate-300 italic">"{selectedPlacedMeta.englishSentence}"</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playClick();
                  sound.speakEnglish(`${selectedPlacedMeta.name}. ${selectedPlacedMeta.englishSentence}`);
                }}
                className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white cursor-pointer"
                title="Nghe phát âm tiếng Anh"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  updatePlacedDecor(selectedPlacedObj.instanceId, {
                    rotationY: selectedPlacedObj.rotationY + Math.PI / 4,
                  });
                }}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-display font-bold text-xs flex items-center gap-1 cursor-pointer"
                title="Xoay 45 độ"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Xoay</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  updatePlacedDecor(selectedPlacedObj.instanceId, {
                    scale: Math.min(1.65, Number((selectedPlacedObj.scale + 0.12).toFixed(2))),
                  });
                }}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  updatePlacedDecor(selectedPlacedObj.instanceId, {
                    scale: Math.max(0.65, Number((selectedPlacedObj.scale - 0.12).toFixed(2))),
                  });
                }}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  removePlacedDecor(selectedPlacedObj.instanceId);
                  setSelectedInstanceId(null);
                  showNotice(`📦 Đã cất "${selectedPlacedMeta.vietnameseName}" về Kho Đồ Đảo!`);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-display font-bold text-xs flex items-center gap-1 cursor-pointer"
                title="Cất vào kho"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cất</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="m-3 px-4 py-2 rounded-2xl bg-slate-900/75 text-slate-200 text-xs font-bold flex items-center justify-between z-20">
            <span>
              💡 Mẹo: Chạm vào bất kỳ **Ô Đất (Ô 1 – Ô 16)** trên đảo rồi chọn Tượng Đá, Cổng Chào, Lâu Đài bên phải để bày trí!
            </span>
            <span className="text-amber-300 font-extrabold">Xoay 360° bằng chuột / cảm ứng</span>
          </div>
        )}
      </div>

      {/* ================= CỘT PHẢI (5 CỘT): KHO ĐỒ & CỬA HÀNG KIẾN TRÚC ĐẢO 3D ================= */}
      <div className="col-span-5 h-full clay-card rounded-3xl p-4 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-display font-extrabold text-slate-900 flex items-center gap-2">
                <span>⛩️</span>
                <span>Kho Đồ & Cửa Hàng Kiến Trúc Đảo 3D</span>
              </h2>
              <p className="text-[11px] font-bold text-slate-500">
                Mở khóa bằng 💎 Ngọc Cầu Vồng hoặc chiến thắng các Đảo Boss (Đảo 10, 20... 80)!
              </p>
            </div>
            <div className="bg-pink-100 border-2 border-pink-300 px-3 py-1 rounded-2xl font-display font-extrabold text-sm text-pink-600">
              💎 {rainbowGems}
            </div>
          </div>

          {/* Bộ chọn nhanh 16 Ô Đất trên Đảo */}
          <div className="mt-2.5 bg-slate-100 p-2 rounded-2xl">
            <div className="text-[10px] font-extrabold uppercase text-slate-500 mb-1 flex items-center justify-between">
              <span>📍 Chọn Vị Trí Ô Đất Trên Đảo Để Đặt:</span>
              <span className="text-indigo-600">{HOME_ISLAND_SLOTS[activeSlotIndex]?.label}</span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {HOME_ISLAND_SLOTS.map((slot) => {
                const isOccupied = occupiedSlotSet.has(slot.slotIndex);
                const isSelected = activeSlotIndex === slot.slotIndex;
                return (
                  <button
                    key={slot.slotIndex}
                    onClick={() => {
                      sound.playClick();
                      setActiveSlotIndex(slot.slotIndex);
                    }}
                    className={`py-1 rounded-lg font-display font-bold text-[10px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-600 scale-105 shadow'
                        : isOccupied
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    Ô {slot.slotIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Các Tab Danh Mục Vật Phẩm Đảo */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setCategoryFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-2xl font-display font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách các Công Trình, Tượng Đá, Cổng Chào, Cây Cối */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-2.5 my-1">
          {filteredCatalog.map((item) => {
            const isUnlocked = unlockedDecorIds.includes(item.id) || item.priceGems === 0;
            const placedCount = placedIslandDecors.filter((p) => p.decorId === item.id).length;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white border-emerald-200 hover:border-indigo-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-3xl bg-amber-50 p-2 rounded-2xl border border-amber-200">
                      {item.emoji}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.rarity === 'Legendary'
                            ? 'bg-amber-100 text-amber-800'
                            : item.rarity === 'Epic'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {item.rarity}
                      </span>
                      {placedCount > 0 && (
                        <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 rounded-full">
                          Đã đặt ({placedCount})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="font-display font-extrabold text-xs text-slate-900 leading-snug">
                      {item.vietnameseName}
                    </div>
                    <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                      <span>{item.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.speakEnglish(`${item.name}. ${item.englishSentence}`);
                        }}
                        className="text-sky-600 hover:text-sky-800 cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.unlockByIslandNumber && !isUnlocked && (
                      <div className="text-[10px] font-bold text-rose-600 mt-0.5">
                        👑 Miễn phí khi vượt Đảo Boss #{item.unlockByIslandNumber}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDecorItemAction(item)}
                  className={`mt-2.5 w-full py-2 rounded-xl font-display font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 ${
                    isUnlocked
                      ? 'btn-toy-green text-white'
                      : 'btn-toy-yellow text-slate-900'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đặt Vào Ô {activeSlotIndex + 1}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Mở Khóa ({item.priceGems} 💎)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
