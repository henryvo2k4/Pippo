import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows, RoundedBox, Html, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AvatarBaseId, AVATAR_CHARACTERS, IslandLesson, KINGDOM_ZONES } from '../../data/curriculumData';
import { EquippedSkin, PetState, useGameStore } from '../../store/useGameStore';
import { sound } from '../../lib/sound';
import {
  ToyMaterial,
  SculptedVocabulary3D,
  IslandLandmark3D,
  FluffyTree3D,
  FluffyCloud3D,
} from './Sculpted3DModels';
import { ChibiModularCharacter3D } from './ChibiModularCharacter3D';
import { PhuThuyCharacter3D } from './PhuThuyCharacter3D';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';

// ============================================================================
// COMPONENT TẢI & CHUẨN HÓA KÍCH THƯỚC MÔ HÌNH 3D (.GLB) CÓ HOẠT ẢNH XƯƠNG
// ============================================================================
export const NormalizedGlbModel: React.FC<{
  url: string;
  targetSize?: number;
  alignBottom?: boolean;
  stripSkin?: boolean;
  isExcited?: boolean;
  rotation?: [number, number, number];
  rotationY?: number;
  tintColor?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
}> = ({
  url,
  targetSize = 1.85,
  alignBottom = true,
  stripSkin = false,
  isExcited = false,
  rotation,
  rotationY = 0,
  tintColor,
  emissiveColor,
  emissiveIntensity = 0.35,
}) => {
  const animRootRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);

  const { cloned, normScale, offset } = useMemo(() => {
    let clone: THREE.Object3D = SkeletonUtils.clone(scene);

    // Nếu là phụ kiện tĩnh bị gắn kèm khung xương thừa (như Glasses3D.glb), trích xuất riêng Mesh
    if (stripSkin) {
      const staticGroup = new THREE.Group();
      scene.traverse((child: any) => {
        if (child.isMesh && child.geometry) {
          const mat = child.material ? child.material.clone() : new THREE.MeshStandardMaterial();
          const meshCopy = new THREE.Mesh(child.geometry.clone(), mat);
          staticGroup.add(meshCopy);
        }
      });
      if (staticGroup.children.length > 0) {
        clone = staticGroup;
      }
    }

    clone.updateMatrixWorld(true);

    // Tính Bounding Box chính xác từ các Mesh hiển thị, loại bỏ Camera/Light thừa từ Blender
    const box = new THREE.Box3();
    clone.traverse((child: any) => {
      if (child.isLight || child.isCamera) {
        child.visible = false;
        return;
      }
      if (child.isMesh && child.geometry) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (tintColor || emissiveColor) {
          const baseMat = Array.isArray(child.material) ? child.material[0] : child.material;
          if (baseMat && baseMat.clone) {
            const m = baseMat.clone();
            if (tintColor && m.color) m.color.set(tintColor);
            if (emissiveColor && m.emissive) {
              m.emissive.set(emissiveColor);
              m.emissiveIntensity = emissiveIntensity;
            }
            child.material = m;
          }
        }

        child.geometry.computeBoundingBox();
        if (child.geometry.boundingBox) {
          const gBox = child.geometry.boundingBox.clone();
          if (!stripSkin) {
            gBox.applyMatrix4(child.matrixWorld);
          }
          box.union(gBox);
        }
      }
    });

    if (box.isEmpty()) {
      box.setFromObject(clone);
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scaleFactor = targetSize / maxDim;

    const offsetX = -center.x * scaleFactor;
    const offsetZ = -center.z * scaleFactor;
    const offsetY = alignBottom ? -box.min.y * scaleFactor : -center.y * scaleFactor;

    return {
      cloned: clone,
      normScale: scaleFactor,
      offset: [offsetX, offsetY, offsetZ] as [number, number, number],
    };
  }, [scene, targetSize, alignBottom, stripSkin, tintColor, emissiveColor, emissiveIntensity]);

  const { actions, names } = useAnimations(animations, animRootRef);

  useEffect(() => {
    if (!names || names.length === 0 || stripSkin) return;

    let chosenName = names[0];
    if (isExcited) {
      const excitedMatch = names.find((n) => /dance|wave|jump|thumbs|yes|run|gallop/i.test(n));
      if (excitedMatch) chosenName = excitedMatch;
    } else {
      const idleMatch = names.find((n) => /idle|walk|survey|stand|fly/i.test(n));
      if (idleMatch) chosenName = idleMatch;
    }

    Object.values(actions).forEach((act) => act?.fadeOut(0.2));
    const currentAction = actions[chosenName];
    if (currentAction) {
      currentAction.reset().fadeIn(0.25).play();
    }
  }, [actions, names, isExcited, stripSkin]);

  const finalRot: [number, number, number] = rotation || [0, rotationY, 0];

  return (
    <group ref={animRootRef} rotation={finalRot}>
      <primitive object={cloned} scale={normScale} position={offset} />
    </group>
  );
};

// ============================================================================
// BẢNG TỌA ĐỘ KHỚP XƯƠNG 3D ĐO ĐẠC CHUẨN XÁC CHO TỪNG NHÂN VẬT (.GLB)
// Đảm bảo Mũ, Kính, Động cơ Lưng & Vũ khí luôn bám khít từng nhân vật!
// ============================================================================
interface CharacterSocketConfig {
  charTargetSize: number;
  hatPos: [number, number, number];
  hatScale: number;
  glassesPos: [number, number, number];
  glassesScale: number;
  backPos: [number, number, number];
  backRot: [number, number, number];
  backScale: number;
  handPos: [number, number, number];
  handRot: [number, number, number];
  handScale: number;
  outfitPos: [number, number, number];
}

export const CHARACTER_SOCKET_MAP: Record<AvatarBaseId, CharacterSocketConfig> = {
  // Bé Phù Thủy 3D Cute (PhuThuy.glb)
  phuthuy: {
    charTargetSize: 1.9,
    hatPos: [0, 0.48, 0.1],
    hatScale: 0.5,
    glassesPos: [0, 0.22, 0.18],
    glassesScale: 0.45,
    backPos: [0, 0.05, -0.32],
    backRot: [0, Math.PI, 0],
    backScale: 0.65,
    handPos: [0.42, 0.02, 0.2],
    handRot: [0.25, 0, -0.2],
    handScale: 1.0,
    outfitPos: [-0.45, 0.35, 0.18],
  },
  // 0. Bé Trai Dũng Cảm (Boy Hero Chibi Modular)
  boy: {
    charTargetSize: 1.85,
    hatPos: [0, 1.25, 0],
    hatScale: 0.55,
    glassesPos: [0, 0.92, 0.42],
    glassesScale: 0.48,
    backPos: [0, 0.45, -0.32],
    backRot: [0, Math.PI, 0],
    backScale: 0.65,
    handPos: [0.48, 0.35, 0.18],
    handRot: [0.25, 0, -0.2],
    handScale: 1.0,
    outfitPos: [-0.55, 0.75, 0.18],
  },
  // 0. Bé Gái Đáng Yêu (Girl Hero Chibi Modular)
  girl: {
    charTargetSize: 1.85,
    hatPos: [0, 1.25, 0],
    hatScale: 0.55,
    glassesPos: [0, 0.92, 0.42],
    glassesScale: 0.48,
    backPos: [0, 0.45, -0.32],
    backRot: [0, Math.PI, 0],
    backScale: 0.65,
    handPos: [0.48, 0.35, 0.18],
    handRot: [0.25, 0, -0.2],
    handScale: 1.0,
    outfitPos: [-0.55, 0.75, 0.18],
  },
  // 1. Robo Buddy (/models/RobotExpressive.glb)
  bear: {
    charTargetSize: 1.88,
    hatPos: [0, 1.38, 0.04],
    hatScale: 0.56,
    glassesPos: [0, 1.12, 0.34],
    glassesScale: 0.52,
    backPos: [0, 0.68, -0.26],
    backRot: [0, Math.PI, 0],
    backScale: 0.68,
    handPos: [0.58, 0.58, 0.25],
    handRot: [0.25, 0, -0.25],
    handScale: 1.05,
    outfitPos: [-0.62, 0.85, 0.18],
  },
  // 2. Foxy Wilder (/models/Fox.glb - thú 4 chân, đầu ở phía trước +Z, lưng nằm ngang)
  rabbit: {
    charTargetSize: 2.28,
    hatPos: [0, 0.68, 0.46],
    hatScale: 0.42,
    glassesPos: [0, 0.52, 0.58],
    glassesScale: 0.36,
    backPos: [0, 0.44, -0.05],
    backRot: [0.35, Math.PI, 0],
    backScale: 0.55,
    handPos: [0.38, 0.48, 0.28],
    handRot: [0.35, 0.2, -0.15],
    handScale: 0.85,
    outfitPos: [-0.42, 0.62, 0.22],
  },
  // 3. Yeti Guardian (/models/Yeti.glb - có cặp sừng cao trên đỉnh, đầu thật ở y=0.92, mắt ở y=0.74)
  dino: {
    charTargetSize: 1.88,
    hatPos: [0, 0.92, 0.14],
    hatScale: 0.52,
    glassesPos: [0, 0.74, 0.40],
    glassesScale: 0.48,
    backPos: [0, 0.58, -0.34],
    backRot: [0, Math.PI, 0],
    backScale: 0.75,
    handPos: [0.64, 0.40, 0.28],
    handRot: [0.2, 0, -0.3],
    handScale: 1.15,
    outfitPos: [-0.68, 0.78, 0.2],
  },
  // 4. Arthur Paladin (/models/KnightHero.glb)
  cat: {
    charTargetSize: 1.88,
    hatPos: [0, 1.32, 0.02],
    hatScale: 0.54,
    glassesPos: [0, 1.10, 0.24],
    glassesScale: 0.46,
    backPos: [0, 0.72, -0.22],
    backRot: [0, Math.PI, 0],
    backScale: 0.65,
    handPos: [0.54, 0.62, 0.25],
    handRot: [0.2, 0, -0.22],
    handScale: 1.08,
    outfitPos: [-0.58, 0.82, 0.2],
  },
  // 5. Astro Hero (/models/Astronaut.glb)
  knight: {
    charTargetSize: 1.88,
    hatPos: [0, 1.56, 0.0],
    hatScale: 0.58,
    glassesPos: [0, 1.32, 0.34],
    glassesScale: 0.52,
    backPos: [0, 0.88, -0.34],
    backRot: [0, Math.PI, 0],
    backScale: 0.72,
    handPos: [0.54, 0.72, 0.25],
    handRot: [0.2, 0, -0.25],
    handScale: 1.05,
    outfitPos: [-0.62, 0.92, 0.2],
  },
  // 6. Mustang Stallion (/models/Horse.glb - chiến mã 4 chân, đầu cao phía trước +Z)
  wizard: {
    charTargetSize: 2.32,
    hatPos: [0, 0.90, 0.54],
    hatScale: 0.44,
    glassesPos: [0, 0.76, 0.66],
    glassesScale: 0.38,
    backPos: [0, 0.56, -0.06],
    backRot: [0.3, Math.PI, 0],
    backScale: 0.62,
    handPos: [0.42, 0.62, 0.28],
    handRot: [0.3, 0.15, -0.2],
    handScale: 0.95,
    outfitPos: [-0.45, 0.72, 0.22],
  },
};

interface Character3DProps {
  avatarBase: AvatarBaseId;
  equippedSkin: EquippedSkin;
  petState?: PetState;
  scale?: number;
  position?: [number, number, number];
  isJumping?: boolean;
  onClickCharacter?: () => void;
  showPet?: boolean;
}

export const Character3DModel: React.FC<Character3DProps> = ({
  avatarBase,
  equippedSkin,
  petState,
  scale = 1,
  position = [0, -0.5, 0],
  isJumping = false,
  onClickCharacter,
  showPet = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Group>(null);
  const outfitArtifactRef = useRef<THREE.Group>(null);
  const petRef = useRef<THREE.Group>(null);

  const [clickedBounce, setClickedBounce] = useState(0);

  const meta = AVATAR_CHARACTERS.find((c) => c.id === avatarBase) || AVATAR_CHARACTERS[0];
  const customGlbUrl = useGameStore((s) => s.customGlbUrl);
  const accessoryOffsets = useGameStore((s) => s.accessoryOffsets);

  const activeGlbUrl = customGlbUrl || meta.glbUrl;
  const socket = CHARACTER_SOCKET_MAP[avatarBase] || CHARACTER_SOCKET_MAP.bear;
  const userOffset = accessoryOffsets?.[avatarBase] || { y: 0, z: 0, scale: 1 };

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      const baseBounce = Math.sin(t * 2.8) * 0.035;
      const jumpOffset = isJumping || clickedBounce > 0 ? Math.abs(Math.sin(t * 10)) * 0.3 : 0;
      groupRef.current.position.y = position[1] + baseBounce + jumpOffset;
      groupRef.current.rotation.y = Math.sin(t * 0.85) * 0.18;
    }

    if (clickedBounce > 0) {
      setClickedBounce((prev) => Math.max(0, prev - delta * 1.6));
    }

    if (auraRef.current) {
      auraRef.current.rotation.y = t * 1.6;
    }

    if (outfitArtifactRef.current) {
      outfitArtifactRef.current.position.y =
        socket.outfitPos[1] + userOffset.y + Math.sin(t * 3.5) * 0.09;
      outfitArtifactRef.current.rotation.y = t * 1.8;
    }

    if (petRef.current) {
      petRef.current.position.y = 1.05 + Math.sin(t * 4.2) * 0.12;
      petRef.current.position.x = 1.22 + Math.cos(t * 1.8) * 0.08;
      petRef.current.rotation.y = -0.25 + Math.sin(t * 2.2) * 0.25;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setClickedBounce(1);
    sound.playPop();
    if (onClickCharacter) onClickCharacter();
  };

  const petGlbUrl =
    petState?.pet_id === 'dragon_sky'
      ? '/models/DragonPet3D.glb'
      : petState?.pet_id === 'cloud_pet'
      ? '/models/Parrot.glb'
      : '/models/Duck.glb';

  // Tính tọa độ sau khi cộng tinh chỉnh của người chơi
  const hatPosition: [number, number, number] = [
    socket.hatPos[0],
    socket.hatPos[1] + userOffset.y,
    socket.hatPos[2] + userOffset.z,
  ];
  const glassesPosition: [number, number, number] = [
    socket.glassesPos[0],
    socket.glassesPos[1] + userOffset.y,
    socket.glassesPos[2] + userOffset.z,
  ];
  const backPosition: [number, number, number] = [
    socket.backPos[0],
    socket.backPos[1] + userOffset.y * 0.5,
    socket.backPos[2],
  ];
  const handPosition: [number, number, number] = [
    socket.handPos[0],
    socket.handPos[1] + userOffset.y * 0.5,
    socket.handPos[2],
  ];

  const isGirl =
    avatarBase === 'girl' ||
    avatarBase === 'rabbit' ||
    avatarBase === 'cat' ||
    avatarBase === 'wizard';
  const gender: 'boy' | 'girl' = isGirl ? 'girl' : 'boy';

  // ==========================================================================
  // NHÂN VẬT PHÙ THỦY 3D MẶC ĐỊNH (PHUTHUY.GLB) ĐƯỢC TÔ MÀU ANIME KẸO NGỌT CỰC CUTE
  // CÓ SẴN CÁC KHỚP SOCKET SẴN SÀNG CHO HỆ THỐNG TRANG PHỤC VÀ ITEM TRONG TƯƠNG LAI
  // ==========================================================================
  if (!customGlbUrl) {
    return (
      <group ref={groupRef} position={position} scale={scale} onClick={handleClick}>
        <ThreeErrorBoundary>
          <Suspense fallback={null}>
            <PhuThuyCharacter3D
              scale={1.12}
              position={[0, 0.38, 0]}
              isJumping={isJumping || clickedBounce > 0}
              onClickCharacter={handleClick}
              equippedSkin={equippedSkin}
              petId={petState?.pet_id}
              showPet={showPet}
            />
          </Suspense>
        </ThreeErrorBoundary>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} scale={scale} onClick={handleClick}>
      {/* ================= 1. MÔ HÌNH NHÂN VẬT 3D .GLB CHÍNH ================= */}
      <group position={[0, -0.18, 0]}>
        <Suspense fallback={null}>
          <NormalizedGlbModel
            url={activeGlbUrl}
            targetSize={socket.charTargetSize}
            alignBottom={true}
            isExcited={isJumping || clickedBounce > 0}
          />
        </Suspense>
      </group>

      {/* ================= 2. PHỤ KIỆN MŨ / VƯƠNG MIỆN / MŨ GIÁP 3D (.GLB THẬT) ================= */}
      {equippedSkin.hat !== 'none' && (
        <group position={hatPosition} scale={userOffset.scale}>
          <Suspense fallback={null}>
            {equippedSkin.hat === 'crown_gold' && (
              <NormalizedGlbModel
                url="/models/Crown3D.glb"
                targetSize={socket.hatScale}
                alignBottom={true}
                rotation={[-Math.PI / 2, 0, 0]}
                tintColor="#facc15"
                emissiveColor="#f59e0b"
                emissiveIntensity={0.35}
              />
            )}
            {equippedSkin.hat === 'wizard_hat' && (
              <NormalizedGlbModel
                url="/models/WizardHat3D.glb"
                targetSize={socket.hatScale * 1.15}
                alignBottom={true}
              />
            )}
            {equippedSkin.hat === 'astro_helmet' && (
              <NormalizedGlbModel
                url="/models/SciFiHelmet3D.glb"
                targetSize={socket.hatScale * 1.15}
                alignBottom={true}
              />
            )}
            {equippedSkin.hat === 'bunny_ears' && (
              <NormalizedGlbModel
                url="/models/KnightHelmet3D.glb"
                targetSize={socket.hatScale * 1.18}
                alignBottom={true}
                tintColor="#facc15"
                emissiveColor="#eab308"
                emissiveIntensity={0.2}
              />
            )}
          </Suspense>
        </group>
      )}

      {/* ================= 3. KÍNH MẮT THỜI TRANG & KÍNH ĐIỆN TỬ 3D (.GLB THẬT) ================= */}
      {equippedSkin.glasses !== 'none' && (
        <group position={glassesPosition} scale={userOffset.scale}>
          <Suspense fallback={null}>
            <NormalizedGlbModel
              url="/models/Glasses3D.glb"
              targetSize={socket.glassesScale}
              alignBottom={false}
              stripSkin={true}
              tintColor={equippedSkin.glasses === 'cyber_visor' ? '#22d3ee' : '#f43f5e'}
              emissiveColor={equippedSkin.glasses === 'cyber_visor' ? '#06b6d4' : '#e11d48'}
              emissiveIntensity={equippedSkin.glasses === 'cyber_visor' ? 0.75 : 0.25}
            />
          </Suspense>
        </group>
      )}

      {/* ================= 4. BẢO VẬT HỘ THÂN / GIÁP PHÉP THUẬT 3D (.GLB THẬT) ================= */}
      {equippedSkin.outfit !== 'none' && (
        <group
          ref={outfitArtifactRef}
          position={[socket.outfitPos[0], socket.outfitPos[1] + userOffset.y, socket.outfitPos[2]]}
          scale={userOffset.scale}
        >
          <Suspense fallback={null}>
            {equippedSkin.outfit === 'cape_royal' && (
              <NormalizedGlbModel url="/models/Heart.glb" targetSize={0.48} alignBottom={false} />
            )}
            {equippedSkin.outfit === 'knight_armor' && (
              <NormalizedGlbModel
                url="/models/Crystal3D.glb"
                targetSize={0.58}
                alignBottom={false}
                tintColor="#38bdf8"
                emissiveColor="#0284c7"
                emissiveIntensity={0.5}
              />
            )}
            {equippedSkin.outfit === 'wizard_robe' && (
              <NormalizedGlbModel url="/models/PlantSword3D.glb" targetSize={0.72} alignBottom={false} />
            )}
            {equippedSkin.outfit === 'dress_fairy' && (
              <NormalizedGlbModel url="/models/TreasureChest3D.glb" targetSize={0.48} alignBottom={false} />
            )}
          </Suspense>
        </group>
      )}

      {/* ================= 5. PHỤ KIỆN LƯNG: ĐỘNG CƠ JETPACK / VÁN BAY / RỒNG HỘ VỆ (.GLB THẬT) ================= */}
      {equippedSkin.wing !== 'none' && (
        <group position={backPosition} rotation={socket.backRot} scale={userOffset.scale}>
          <Suspense fallback={null}>
            {equippedSkin.wing === 'jetpack_3d' && (
              <NormalizedGlbModel
                url="/models/Jetpack3D.glb"
                targetSize={socket.backScale}
                alignBottom={false}
              />
            )}
            {equippedSkin.wing === 'angel_wings' && (
              <NormalizedGlbModel
                url="/models/Hoverboard3D.glb"
                targetSize={socket.backScale * 1.25}
                alignBottom={false}
              />
            )}
            {equippedSkin.wing === 'dragon_wings' && (
              <group position={[0, 0.35, 0]} rotation={[0, Math.PI, 0]}>
                <NormalizedGlbModel
                  url="/models/DragonPet3D.glb"
                  targetSize={socket.backScale * 1.2}
                  alignBottom={false}
                />
              </group>
            )}
          </Suspense>
        </group>
      )}

      {/* ================= 6. VŨ KHÍ & PHÁP KHÍ CẦM TAY (.GLB THẬT) ================= */}
      {equippedSkin.hand_item !== 'none' && (
        <group position={handPosition} rotation={socket.handRot} scale={userOffset.scale}>
          <Suspense fallback={null}>
            {equippedSkin.hand_item === 'magic_wand' && (
              <NormalizedGlbModel
                url="/models/MagicSword3D.glb"
                targetSize={socket.handScale}
                alignBottom={false}
              />
            )}
            {equippedSkin.hand_item === 'laser_sword' && (
              <NormalizedGlbModel
                url="/models/RuneSword.glb"
                targetSize={socket.handScale}
                alignBottom={false}
              />
            )}
            {equippedSkin.hand_item === 'balloon_heart' && (
              <NormalizedGlbModel
                url="/models/Bow3D.glb"
                targetSize={socket.handScale * 0.95}
                alignBottom={false}
              />
            )}
          </Suspense>
        </group>
      )}

      {/* ================= 7. VÒNG HÀO QUANG PHÉP THUẬT DƯỚI CHÂN (.GLB THẬT) ================= */}
      {equippedSkin.aura !== 'none' && (
        <group ref={auraRef} position={[0, -0.15, 0]}>
          <Suspense fallback={null}>
            <NormalizedGlbModel
              url={
                equippedSkin.aura === 'rainbow_ring'
                  ? '/models/RedMagicRing.glb'
                  : equippedSkin.aura === 'cyber_pulse'
                  ? '/models/GreenMagicRing.glb'
                  : '/models/OrangeMagicRing.glb'
              }
              targetSize={1.75}
              alignBottom={false}
            />
          </Suspense>
        </group>
      )}

      {/* ================= 8. THÚ CƯNG 3D .GLB TIẾN HÓA BAY BÊN CẠNH ================= */}
      {showPet && petState && (
        <group ref={petRef} position={[1.22, 1.05, 0.2]}>
          {petState.stage === 1 ? (
            <group>
              <Suspense fallback={null}>
                <NormalizedGlbModel
                  url="/models/Crystal3D.glb"
                  targetSize={0.55}
                  alignBottom={false}
                  tintColor="#fde047"
                  emissiveColor="#f59e0b"
                  emissiveIntensity={0.45}
                />
              </Suspense>
            </group>
          ) : (
            <group scale={petState.stage === 3 ? 1.25 : 1}>
              <Suspense fallback={null}>
                <NormalizedGlbModel url={petGlbUrl} targetSize={0.78} alignBottom={false} />
              </Suspense>
              {petState.stage === 3 && (
                <group position={[0, 0.42, 0]}>
                  <Suspense fallback={null}>
                    <NormalizedGlbModel
                      url="/models/Crown3D.glb"
                      targetSize={0.28}
                      alignBottom={true}
                      rotation={[-Math.PI / 2, 0, 0]}
                      tintColor="#facc15"
                    />
                  </Suspense>
                </group>
              )}
            </group>
          )}
        </group>
      )}
    </group>
  );
};

// ================= CANVAS HIỂN THỊ NHÂN VẬT 3D TRONG STUDIO / TỦ ĐỒ =================
export const AvatarStudioCanvas: React.FC<{
  avatarBase: AvatarBaseId;
  equippedSkin: EquippedSkin;
  petState?: PetState;
  isJumping?: boolean;
  onClickCharacter?: () => void;
}> = ({ avatarBase, equippedSkin, petState, isJumping, onClickCharacter }) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 1.05, 3.85], fov: 40 }}>
        <ambientLight intensity={0.95} />
        <hemisphereLight args={['#ffffff', '#6366f1', 0.7]} />
        <directionalLight position={[4, 7, 5]} intensity={1.5} castShadow />
        <pointLight position={[-4, 3, -3]} intensity={0.95} color="#f472b6" />
        <pointLight position={[3, 2, -3]} intensity={0.85} color="#38bdf8" />
        <Sparkles count={38} scale={4.2} size={3} speed={0.4} color="#fde047" />

        <ThreeErrorBoundary>
          <Suspense fallback={null}>
            <Float speed={1.8} rotationIntensity={0.05} floatIntensity={0.12}>
              <Character3DModel
                avatarBase={avatarBase}
                equippedSkin={equippedSkin}
                petState={petState}
                position={[0, -0.62, 0]}
                scale={1.05}
                isJumping={isJumping}
                onClickCharacter={onClickCharacter}
              />
            </Float>
          </Suspense>
        </ThreeErrorBoundary>

        {/* Bục Sân Khấu 3D Đa Tầng Phát Sáng */}
        <group position={[0, -0.92, 0]}>
          <mesh receiveShadow>
            <cylinderGeometry args={[1.25, 1.42, 0.22, 40]} />
            <ToyMaterial color="#f8fafc" clearcoat={0.8} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <cylinderGeometry args={[1.42, 1.55, 0.12, 40]} />
            <ToyMaterial color="#6366f1" />
          </mesh>
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.22, 0.04, 16, 48]} />
            <ToyMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.65} />
          </mesh>
        </group>

        <ContactShadows position={[0, -0.78, 0]} opacity={0.45} scale={4.2} blur={2.2} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.95}
        />
      </Canvas>
    </div>
  );
};

// ================= BẢN ĐỒ QUẦN ĐẢO BAY 3D LIÊN HOÀN 80 ĐẢO (KÉO MƯỢT TỪ ĐẦU ĐẾN CUỐI) =================
interface WorldMap3DProps {
  islands: IslandLesson[];
  completedLessons: string[];
  lessonStars: Record<string, number>;
  selectedIslandId: string;
  onSelectIsland: (island: IslandLesson, isUnlocked: boolean) => void;
  avatarBase: AvatarBaseId;
  equippedSkin: EquippedSkin;
  petState: PetState;
  cameraTargetX?: number;
  onCameraTargetXChange?: (newX: number) => void;
  hideHtmlOverlays?: boolean;
}

// Preload toàn bộ 5 mẫu đảo 3D .GLB và Cầu Treo Dây Văng suspension_bridge.glb để hiển thị tức thì
[
  '/models/floating_island_expanse_v7.glb',
  '/models/andrews_floating_island_unity_v2.glb',
  '/models/floating_island.glb',
  '/models/floating_island_with_roots_and_rocks.glb',
  '/models/floating_island_peak.glb',
  '/models/suspension_bridge.glb',
].forEach((url) => useGLTF.preload(url));

// ================= CẦU TREO DÂY VĂNG 3D (SUSPENSION_BRIDGE.GLB) NỐI GIỮA CÁC ĐẢO =================
const IslandSuspensionBridge3D: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  isUnlocked: boolean;
  isCompleted: boolean;
}> = ({ start, end, isUnlocked, isCompleted }) => {
  const { scene } = useGLTF('/models/suspension_bridge.glb');

  const { position, rotationY, scale } = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dist = a.distanceTo(b);
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    // suspension_bridge.glb dài theo trục X (~10.86 units). Góc xoay chuẩn:
    const rotY = -Math.atan2(dz, dx);
    const bridgeScale = (dist * 0.98) / 10.86;

    return {
      position: [mid.x, mid.y - 0.15, mid.z] as [number, number, number],
      rotationY: rotY,
      scale: [bridgeScale, bridgeScale * 0.92, bridgeScale] as [number, number, number],
    };
  }, [start, end]);

  const cloned = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone();
          if (!isUnlocked) {
            mat.color = new THREE.Color('#475569');
            mat.roughness = 0.85;
          }
          child.material = mat;
        }
      }
    });
    return clone;
  }, [scene, isUnlocked, isCompleted]);

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={scale}
    />
  );
};

// Camera Controller cho phép kéo ngang mượt mà từ Đảo 1 -> Đảo 80
const ContinuousMapCameraRig: React.FC<{
  targetX: number;
  targetZ: number;
}> = ({ targetX, targetZ }) => {
  const lookAtVec = useRef(new THREE.Vector3(targetX, 0.4, 0));

  useFrame((state, delta) => {
    const damp = Math.min(1, delta * 5.5);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, damp);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 6.6, damp);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 13.8 + targetZ * 0.22, damp);

    lookAtVec.current.x = THREE.MathUtils.lerp(lookAtVec.current.x, targetX, damp);
    lookAtVec.current.y = THREE.MathUtils.lerp(lookAtVec.current.y, 0.5, damp);
    lookAtVec.current.z = THREE.MathUtils.lerp(lookAtVec.current.z, targetZ * 0.35, damp);
    state.camera.lookAt(lookAtVec.current);
  });

  return null;
};

// Cổng Chào Vùng Đất 3D Đặt Tự Nhiên Giữa Bầu Trời (Mỗi 10 Đảo Là 1 Vùng Phong Cách Riêng)
const ZoneSkyArchway3D: React.FC<{
  position: [number, number, number];
  zoneIndex: number;
  vietnameseTitle: string;
  emoji: string;
  themeColor: string;
  isZoneUnlocked: boolean;
  hideHtmlOverlays?: boolean;
}> = ({ position, vietnameseTitle, emoji, themeColor, isZoneUnlocked, hideHtmlOverlays }) => {
  return (
    <Float speed={1.4} rotationIntensity={0.03} floatIntensity={0.18}>
      <group position={[position[0] - 3.3, position[1] + 0.5, 0]}>
        <Suspense fallback={null}>
          <NormalizedGlbModel
            url="/models/Gate3D.glb"
            targetSize={3.6}
            alignBottom={true}
            rotationY={Math.PI / 2}
            tintColor={isZoneUnlocked ? undefined : '#475569'}
          />
        </Suspense>
        {!hideHtmlOverlays && (
          <Html position={[0, 3.6, 0]} center distanceFactor={14} zIndexRange={[15, 0]}>
            <div
              style={{ borderColor: isZoneUnlocked ? themeColor : '#64748b' }}
              className={`px-3.5 py-1 rounded-2xl border-2 shadow-2xl whitespace-nowrap font-display font-extrabold text-xs flex items-center gap-1.5 pointer-events-none ${
                isZoneUnlocked
                  ? 'bg-slate-900/90 text-white'
                  : 'bg-slate-900/80 text-slate-400'
              }`}
            >
              <span>{isZoneUnlocked ? emoji : '🔒'}</span>
              <span>{vietnameseTitle}</span>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

const FloatingIslandMesh: React.FC<{
  island: IslandLesson;
  isSelected: boolean;
  isCompleted: boolean;
  isUnlocked: boolean;
  isFrontier: boolean;
  earnedStars: number;
  isNearCamera: boolean;
  hideHtmlOverlays?: boolean;
  onSelect: () => void;
}> = ({
  island,
  isSelected,
  isCompleted,
  isUnlocked,
  isFrontier,
  earnedStars,
  isNearCamera,
  hideHtmlOverlays,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);

  // Sử dụng nguyên bản 100% các mẫu Hòn Đảo .GLB người dùng đã tải về (không gắn miếng nền tròn nhân tạo)
  const islandTerrainGlb = island.islandGlbUrl || '/models/floating_island_expanse_v7.glb';

  return (
    <Float speed={1.8} rotationIntensity={0.03} floatIntensity={0.2}>
      <group
        position={island.position3D}
        scale={hovered || isSelected ? 1.1 : 1}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* 1. Mô Hình Hòn Đảo Bay 3D .GLB Tự Nhiên Nguyên Bản */}
        <group position={[0, -0.25, 0]}>
          <Suspense fallback={null}>
            <NormalizedGlbModel
              url={islandTerrainGlb}
              targetSize={island.isBossIsland ? 3.85 : 3.25}
              alignBottom={false}
              rotationY={(island.islandNumber * 1.15) % (Math.PI * 2)}
              tintColor={isUnlocked ? undefined : '#64748b'}
            />
          </Suspense>
        </group>

        {/* 2. Công Trình Kiến Trúc .GLB Đặc Trưng Đặt Trực Tiếp Lên Mặt Đảo */}
        {isNearCamera && island.landmarkGlb && (
          <group position={[0, 0.22, -0.08]}>
            <Suspense fallback={null}>
              <NormalizedGlbModel
                url={island.landmarkGlb}
                targetSize={island.isBossIsland ? 1.45 : 1.08}
                alignBottom={true}
                tintColor={isUnlocked ? undefined : '#475569'}
              />
            </Suspense>
          </group>
        )}

        {/* 3. Nhãn 3D Nổi Trên Đảo: Hiển thị Số Sao Đạt Được (1-3 Sao) hoặc Khóa 🔒 */}
        {isNearCamera && !hideHtmlOverlays && (
          <Html
            position={[0, island.isBossIsland ? 2.05 : 1.72, 0]}
            center
            distanceFactor={12}
            zIndexRange={[15, 0]}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="flex flex-col items-center cursor-pointer select-none group"
            >
              {/* Hàng Ngôi Sao Đánh Giá (1-3 Sao) hoặc Trạng Thái Mở Khóa */}
              {isCompleted ? (
                <div className="mb-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-amber-300 shadow-lg flex items-center gap-0.5 text-xs">
                  {[1, 2, 3].map((starIdx) => (
                    <span
                      key={starIdx}
                      className={starIdx <= earnedStars ? 'text-amber-300 drop-shadow' : 'text-slate-600'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              ) : isFrontier ? (
                <div className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-display font-extrabold text-[10px] border border-white shadow-lg animate-bounce">
                  📍 HỌC NGAY
                </div>
              ) : null}

              {/* Thẻ Tên Đảo */}
              <div
                className={`px-3.5 py-1.5 rounded-2xl font-display font-extrabold text-xs whitespace-nowrap shadow-xl border-2 transition-transform flex items-center gap-1.5 ${
                  !isUnlocked
                    ? 'bg-slate-900/85 text-slate-300 border-slate-600/80 opacity-90 group-hover:scale-105'
                    : isSelected
                    ? 'bg-amber-400 text-slate-950 border-white scale-110 ring-4 ring-amber-300/60'
                    : isFrontier
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-amber-300 scale-105 ring-2 ring-amber-300/50'
                    : island.isBossIsland
                    ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white border-amber-200 group-hover:scale-105'
                    : isCompleted
                    ? 'bg-emerald-500 text-white border-emerald-200 group-hover:scale-105'
                    : 'bg-white/95 text-slate-800 border-sky-200 group-hover:scale-105'
                }`}
              >
                <span className="text-base">{!isUnlocked ? '🔒' : island.badgeEmoji}</span>
                <span>Đảo {island.islandNumber}</span>
                {island.isBossIsland && (
                  <span className="bg-amber-300 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full">
                    BOSS
                  </span>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

export const KingdomWorldMap3D: React.FC<WorldMap3DProps> = ({
  islands,
  completedLessons,
  lessonStars,
  selectedIslandId,
  onSelectIsland,
  avatarBase,
  equippedSkin,
  petState,
  cameraTargetX,
  onCameraTargetXChange,
  hideHtmlOverlays = false,
}) => {
  const activeIsland = islands.find((i) => i.id === selectedIslandId) || islands[0];
  const minX = 0;
  const maxX = islands.length > 0 ? islands[islands.length - 1].position3D[0] : 560;

  const [internalCamX, setInternalCamX] = useState<number>(activeIsland?.position3D[0] || 0);
  const currentCamX = cameraTargetX !== undefined ? cameraTargetX : internalCamX;

  const updateCamX = (nextX: number) => {
    const clamped = Math.max(minX - 4, Math.min(maxX + 4, nextX));
    setInternalCamX(clamped);
    if (onCameraTargetXChange) onCameraTargetXChange(clamped);
  };

  // Khi người chơi bấm chọn đảo mới, di chuyển camera mượt tới đảo đó
  useEffect(() => {
    if (activeIsland) {
      updateCamX(activeIsland.position3D[0]);
    }
  }, [selectedIslandId]);

  // Hỗ trợ kéo chuột ngang (Drag) & lăn chuột (Wheel) để lướt dọc toàn bộ 80 Hòn Đảo 3D
  // Đồng thời phân biệt rõ KÉO BẢN ĐỒ vs BẤM CHỌN ĐẢO để không bị mở nhầm đảo khi đang kéo!
  const isDraggingRef = useRef(false);
  const lastClientXRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // Tìm đảo gần tâm camera nhất để định hướng độ sâu Z nhẹ nhàng
  const closestIslandToCam = useMemo(() => {
    let best = activeIsland;
    let bestDist = Infinity;
    for (const isl of islands) {
      const d = Math.abs(isl.position3D[0] - currentCamX);
      if (d < bestDist) {
        bestDist = d;
        best = isl;
      }
    }
    return best;
  }, [islands, currentCamX, activeIsland]);

  const charPos: [number, number, number] = activeIsland
    ? [activeIsland.position3D[0], activeIsland.position3D[1] + 0.48, activeIsland.position3D[2] + 0.42]
    : [0, 0.5, 0];

  // Kiểm tra trạng thái Mở Khóa của từng đảo: Đảo 1 luôn mở, Đảo N mở khi Đảo N-1 đã hoàn thành
  const unlockedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (let i = 0; i < islands.length; i++) {
      const isl = islands[i];
      if (i === 0 || isl.islandNumber === 1) {
        map[isl.id] = true;
      } else {
        const prevIsl = islands[i - 1];
        map[isl.id] = completedLessons.includes(prevIsl.id);
      }
    }
    return map;
  }, [islands, completedLessons]);

  // Cầu treo dây văng 3D (suspension_bridge.glb) nối liên hoàn 80 Đảo
  const bridgeSegments = useMemo(() => {
    const segs: {
      key: string;
      start: [number, number, number];
      end: [number, number, number];
      completed: boolean;
      unlocked: boolean;
    }[] = [];
    for (let i = 0; i < islands.length - 1; i++) {
      if (Math.abs(islands[i].position3D[0] - currentCamX) > 48) continue;
      const isDone = completedLessons.includes(islands[i].id);
      const isUnl = unlockedMap[islands[i].id];
      segs.push({
        key: `bridge-${islands[i].id}-${islands[i + 1].id}`,
        start: islands[i].position3D,
        end: islands[i + 1].position3D,
        completed: isDone,
        unlocked: isUnl,
      });
    }
    return segs;
  }, [islands, completedLessons, unlockedMap, currentCamX]);

  // Các Cổng Vùng Đất 3D đặt tự nhiên tại Đảo 1, 11, 21, 31, 41, 51, 61, 71
  const currentTier = islands[0]?.tier || 1;
  const zonesMeta = KINGDOM_ZONES[currentTier] || KINGDOM_ZONES[1];

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing isolate z-0"
      onPointerDown={(e) => {
        isDraggingRef.current = true;
        lastClientXRef.current = e.clientX;
        dragDistanceRef.current = 0;
      }}
      onPointerMove={(e) => {
        if (!isDraggingRef.current) return;
        const deltaPx = e.clientX - lastClientXRef.current;
        lastClientXRef.current = e.clientX;
        dragDistanceRef.current += Math.abs(deltaPx);
        // Kéo sang trái -> tiến tới các đảo tiếp theo
        updateCamX(currentCamX - deltaPx * 0.045);
      }}
      onPointerUp={() => {
        isDraggingRef.current = false;
      }}
      onPointerLeave={() => {
        isDraggingRef.current = false;
      }}
      onWheel={(e) => {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        updateCamX(currentCamX + delta * 0.025);
      }}
    >
      <Canvas shadows camera={{ position: [currentCamX, 6.6, 13.8], fov: 44 }}>
        <ContinuousMapCameraRig
          targetX={currentCamX}
          targetZ={closestIslandToCam?.position3D[2] || 0}
        />

        <ambientLight intensity={0.95} />
        <hemisphereLight args={['#ffffff', '#38bdf8', 0.65]} />
        <directionalLight
          position={[currentCamX + 6, 14, 8]}
          intensity={1.45}
          castShadow
        />
        <pointLight position={[currentCamX - 6, 6, 4]} intensity={0.8} color="#38bdf8" />
        <Sparkles
          position={[currentCamX, 1, 0]}
          count={85}
          scale={28}
          size={3.5}
          speed={0.35}
          color="#ffffff"
        />

        {/* Những đám mây 3D bay dọc theo camera */}
        <FluffyCloud3D position={[currentCamX - 9, 4.2, -5.5]} scale={1.25} />
        <FluffyCloud3D position={[currentCamX + 1, 4.6, -6.2]} scale={1.35} />
        <FluffyCloud3D position={[currentCamX + 10, 4.0, -5.0]} scale={1.15} />

        {/* Cổng Chào 3D Phân Chia Từng Vùng Phong Cách Ngay Trong Không Gian 3D */}
        {zonesMeta.map((z) => {
          const firstIslInZone = islands.find((isl) => isl.zoneIndex === z.zoneIndex);
          if (!firstIslInZone) return null;
          if (Math.abs(firstIslInZone.position3D[0] - currentCamX) > 48) return null;
          const isZoneUnlocked = unlockedMap[firstIslInZone.id];
          return (
            <ZoneSkyArchway3D
              key={z.zoneIndex}
              position={firstIslInZone.position3D}
              zoneIndex={z.zoneIndex}
              vietnameseTitle={z.vietnameseTitle}
              emoji={z.emoji}
              themeColor={z.themeColor}
              isZoneUnlocked={isZoneUnlocked}
              hideHtmlOverlays={hideHtmlOverlays}
            />
          );
        })}

        {/* Cầu Treo Dây Văng 3D (suspension_bridge.glb) Nối Liền Giữa Các Đảo */}
        {bridgeSegments.map((seg) => (
          <Suspense key={seg.key} fallback={null}>
            <IslandSuspensionBridge3D
              start={seg.start}
              end={seg.end}
              isUnlocked={seg.unlocked}
              isCompleted={seg.completed}
            />
          </Suspense>
        ))}

        {/* Chuỗi 80 Đảo Bay 3D (.GLB) Cách Biệt Rộng Rãi */}
        {islands.map((island) => {
          const distFromCam = Math.abs(island.position3D[0] - currentCamX);
          if (distFromCam > 54) return null;
          const isCompleted = completedLessons.includes(island.id);
          const isUnlocked = unlockedMap[island.id];
          const isFrontier = isUnlocked && !isCompleted;
          const earnedStars = lessonStars[island.id] || (isCompleted ? 3 : 0);

          return (
            <FloatingIslandMesh
              key={island.id}
              island={island}
              isSelected={island.id === activeIsland?.id}
              isCompleted={isCompleted}
              isUnlocked={isUnlocked}
              isFrontier={isFrontier}
              earnedStars={earnedStars}
              isNearCamera={distFromCam < 38}
              hideHtmlOverlays={hideHtmlOverlays}
              onSelect={() => {
                if (dragDistanceRef.current > 6) return;
                sound.playClick();
                onSelectIsland(island, isUnlocked);
              }}
            />
          );
        })}

        {/* Nhân vật 3D .GLB của bé đứng trên Đảo đang chọn */}
        {activeIsland && Math.abs(activeIsland.position3D[0] - currentCamX) < 38 && (
          <ThreeErrorBoundary>
            <Suspense fallback={null}>
              <Character3DModel
                avatarBase={avatarBase}
                equippedSkin={equippedSkin}
                petState={petState}
                position={charPos}
                scale={0.65}
                onClickCharacter={() =>
                  sound.speakEnglish(`Island ${activeIsland.islandNumber}: ${activeIsland.title}!`)
                }
              />
            </Suspense>
          </ThreeErrorBoundary>
        )}
      </Canvas>
    </div>
  );
};

// ================= MÔ HÌNH ĐỒ CHƠI TỪ VỰNG 3D TRONG MINI-GAME KHÁM PHÁ =================
export const ToyObject3DCanvas: React.FC<{
  shape: string;
  color: string;
  emoji: string;
  word: string;
  glbModelUrl?: string;
  onInteract: () => void;
}> = ({ color, word, glbModelUrl, onInteract }) => {
  const [pulse, setPulse] = useState(false);

  return (
    <div
      onClick={() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 450);
        onInteract();
      }}
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
    >
      <Canvas shadows camera={{ position: [0, 0.65, 3.8], fov: 40 }}>
        <ambientLight intensity={0.95} />
        <hemisphereLight args={['#ffffff', '#6366f1', 0.65]} />
        <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow />
        <pointLight position={[-3, 2, 2]} intensity={0.8} color="#f472b6" />
        <Sparkles count={32} scale={3.8} size={3} speed={0.5} color="#fde047" />

        <Float speed={2.4} rotationIntensity={0.2} floatIntensity={0.28}>
          <group scale={pulse ? 1.18 : 1}>
            {glbModelUrl ? (
              <Suspense fallback={null}>
                <NormalizedGlbModel
                  url={glbModelUrl}
                  targetSize={1.95}
                  alignBottom={false}
                  isExcited={pulse}
                />
              </Suspense>
            ) : (
              <SculptedVocabulary3D itemId={word} word={word} color={color} />
            )}
          </group>
        </Float>

        <ContactShadows position={[0, -1.05, 0]} opacity={0.4} scale={3.5} blur={2} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
