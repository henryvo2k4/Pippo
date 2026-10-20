import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export interface PhuThuyCharacterProps {
  scale?: number;
  position?: [number, number, number];
  isJumping?: boolean;
  onClickCharacter?: (e?: any) => void;
  // Sockets chờ sẵn cho hệ thống item / trang phục sau này
  equippedSkin?: {
    hat?: string;
    hand_item?: string;
    shield?: string;
    wing?: string;
    glasses?: string;
    aura?: string;
  };
  petId?: string;
  showPet?: boolean;
}

// Bảng màu anime kẹo ngọt cho Bé Phù Thủy (Cute Anime Witch Palette)
const COLOR_PALETTE = {
  hatDeep: new THREE.Color('#4c1d95'),    // Tím đậm huyền bí đỉnh nón
  hatMid: new THREE.Color('#6b21a8'),     // Tím ma thuật thân nón
  hatBrim: new THREE.Color('#7e22ce'),    // Vành nón rộng
  ribbonGold: new THREE.Color('#f59e0b'), // Ruy băng vàng quanh nón
  faceSkin: new THREE.Color('#ffe4d6'),   // Da mặt anime hồng hào mịn màng
  faceBlush: new THREE.Color('#fb7185'),  // Má hồng e ấp hai bên
  hairPink: new THREE.Color('#f472b6'),   // Mái tóc hồng pastel bồng bềnh
  robePurple: new THREE.Color('#8b5cf6'), // Váy áo phù thủy tím ngọt
  robeCape: new THREE.Color('#6d28d9'),   // Áo choàng sau lưng
  beltLeather: new THREE.Color('#451a03'),// Thắt lưng da nâu
  buckleGold: new THREE.Color('#facc15'), // Mặt khóa thắt lưng vàng
  bootsDark: new THREE.Color('#1e1b4b'),  // Đôi bốt phù thủy cổ cao
};

export const PhuThuyCharacter3D: React.FC<PhuThuyCharacterProps> = ({
  scale = 1,
  position = [0, 0, 0],
  isJumping = false,
  onClickCharacter,
  equippedSkin = {},
  petId,
  showPet = true,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Group>(null);

  // Tải mô hình 3D PhuThuy.glb gốc
  const { scene } = useGLTF('/models/PhuThuy.glb');

  // Xử lý nạp màu thủ công (Coloring & Shading) cho mô hình
  const coloredScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);

    clone.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        const geo = child.geometry.clone();

        // 1. Tính toán vector pháp tuyến mượt mà cho ánh sáng phản chiếu 3D
        geo.computeVertexNormals();

        // 2. Phủ màu Vertex Colors dựa trên toạ độ hình học thực tế của Bé Phù Thủy
        const pos = geo.getAttribute('position');
        const count = pos.count;
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);
          const r = Math.hypot(x, z);

          let chosenColor = COLOR_PALETTE.robePurple;

          // A. NÓN PHÙ THỦY (Y >= 0.35)
          if (y >= 0.55) {
            // Chóp nón cao
            chosenColor = y > 0.75 ? COLOR_PALETTE.hatDeep : COLOR_PALETTE.hatMid;
          } else if (y >= 0.44 && y < 0.55 && r < 0.32) {
            // Đai ruy băng thắt quanh chân nón
            chosenColor = COLOR_PALETTE.ribbonGold;
          } else if (y >= 0.34) {
            // Vành nón xòe rộng
            chosenColor = COLOR_PALETTE.hatBrim;
          }
          // B. KHUÔN MẶT VÀ MÁI TÓC (0.12 <= Y < 0.34)
          else if (y >= 0.12 && y < 0.34) {
            if (z > 0.08 && Math.abs(x) < 0.18) {
              // Khuôn mặt anime phía trước
              if (Math.abs(x) > 0.08 && y < 0.24) {
                // Đôi má hồng baby
                chosenColor = COLOR_PALETTE.faceBlush;
              } else {
                chosenColor = COLOR_PALETTE.faceSkin;
              }
            } else {
              // Tóc dài phủ hai bên và phía sau
              chosenColor = COLOR_PALETTE.hairPink;
            }
          }
          // C. ĐAI THẮT LƯNG (-0.11 <= Y <= -0.04)
          else if (y >= -0.11 && y <= -0.04) {
            if (z > 0.12 && Math.abs(x) < 0.08) {
              // Khóa vàng kim sáng bóng
              chosenColor = COLOR_PALETTE.buckleGold;
            } else {
              chosenColor = COLOR_PALETTE.beltLeather;
            }
          }
          // D. ÁO CHOÀNG & THÂN VÁY (-0.65 <= Y < 0.12)
          else if (y >= -0.65) {
            if (z < -0.05) {
              // Áo choàng sau lưng màu tím đậm
              chosenColor = COLOR_PALETTE.robeCape;
            } else {
              // Váy tím mộng mơ
              chosenColor = COLOR_PALETTE.robePurple;
            }
          }
          // E. ĐÔI BỐT CỔ CAO (Y < -0.65)
          else {
            if (y > -0.72 && z > 0.08) {
              // Viền khóa vàng ở cổ bốt
              chosenColor = COLOR_PALETTE.buckleGold;
            } else {
              chosenColor = COLOR_PALETTE.bootsDark;
            }
          }

          colors[i * 3] = chosenColor.r;
          colors[i * 3 + 1] = chosenColor.g;
          colors[i * 3 + 2] = chosenColor.b;
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // 3. Chất liệu PBR mượt mà chuẩn phong cách anime vinyl
        child.geometry = geo;
        child.material = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.36,
          metalness: 0.10,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  // Hoạt ảnh cử động thở nhẹ nhàng và nhún nhảy tự nhiên
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rootGroupRef.current) {
      const breathing = Math.sin(t * 2.8) * 0.025;
      const jump = isJumping ? Math.abs(Math.sin(t * 10)) * 0.28 : 0;
      rootGroupRef.current.position.y = position[1] + breathing + jump;
      rootGroupRef.current.rotation.y = Math.sin(t * 0.85) * 0.12;
    }

    if (auraRef.current) {
      auraRef.current.rotation.y = t * 1.4;
    }
  });

  return (
    <group ref={rootGroupRef} position={position} scale={scale} onClick={onClickCharacter}>
      {/* 1. MÔ HÌNH NHÂN VẬT CHÍNH: BÉ PHÙ THỦY ĐƯỢC TÔ MÀU ANIME XINH XẮN */}
      <group position={[0, 0, 0]} scale={0.95}>
        <primitive object={coloredScene} />
      </group>

      {/* 2. HIỆU ỨNG BỤI SAO MA THUẬT LẤP LÁNH QUANH BÉ PHÙ THỦY */}
      <Sparkles
        count={32}
        scale={2.2}
        size={3.2}
        speed={0.5}
        color="#facc15"
      />
      <Sparkles
        count={20}
        scale={2.6}
        size={2.5}
        speed={0.4}
        color="#c084fc"
      />

      {/* =====================================================================
          CÁC KHỚP SOCKET CHỜ SẴN CHO HỆ THỐNG PHỤ KIỆN / TRANG PHỤC SAU NÀY:
          Khi bạn có thêm file .glb mới, chỉ cần gắn vào các socket này là khớp ngay!
          ===================================================================== */}

      {/* Socket Nón / Vương Miện (Headgear Socket): y ~ 0.45 */}
      {equippedSkin.hat && equippedSkin.hat !== 'none' && (
        <group position={[0, 0.48, 0.1]}>
          {/* Vị trí gắn nón trong tương lai */}
        </group>
      )}

      {/* Socket Tay Phải (Vũ Khí / Đũa Phép / Kiếm): x ~ 0.45, y ~ 0.02, z ~ 0.2 */}
      {equippedSkin.hand_item && equippedSkin.hand_item !== 'none' && (
        <group position={[0.42, 0.02, 0.2]}>
          {/* Vị trí gắn gậy phép / kiếm trong tương lai */}
        </group>
      )}

      {/* Socket Tay Trái (Khiên Hộ Thân): x ~ -0.45, y ~ 0.02, z ~ 0.2 */}
      {equippedSkin.shield && equippedSkin.shield !== 'none' && (
        <group position={[-0.42, 0.02, 0.2]}>
          {/* Vị trí gắn khiên trong tương lai */}
        </group>
      )}

      {/* Socket Đeo Lưng (Cánh Thiên Thần / Balo): z ~ -0.35 */}
      {equippedSkin.wing && equippedSkin.wing !== 'none' && (
        <group position={[0, 0.05, -0.32]}>
          {/* Vị trí gắn cánh / balo trong tương lai */}
        </group>
      )}

      {/* Socket Kính Mắt Thời Trang */}
      {equippedSkin.glasses && equippedSkin.glasses !== 'none' && (
        <group position={[0, 0.22, 0.18]}>
          {/* Vị trí gắn kính mắt trong tương lai */}
        </group>
      )}

      {/* Socket Hào Quang Aura */}
      {equippedSkin.aura && equippedSkin.aura !== 'none' && (
        <group ref={auraRef} position={[0, 0, 0]}>
          <Sparkles count={40} scale={2.8} size={4.5} speed={0.8} color="#ec4899" />
        </group>
      )}

      {/* Socket Thú Cưng Đi Dưới Chân */}
      {showPet && petId && petId !== 'none' && (
        <group position={[0.62, -0.88, 0.25]}>
          {/* Vị trí thú cưng lon ton đi dưới chân bé */}
        </group>
      )}
    </group>
  );
};
