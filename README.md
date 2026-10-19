# 🌟 WonderVerse 3D – Hệ Thống Web Học Tiếng Anh 3D Tương Tác (Mầm Non – Lớp 7)

Nền tảng học tiếng Anh 3D phong cách **Cute Claymorphism / Toy 3D** dành cho trẻ từ **Mầm non (4–6 tuổi), Tiểu học (Lớp 1–5) đến Đầu Cấp 2 (Lớp 6–7)**.

## 🚀 Cách Chạy Dự Án Ngay Trên Máy

```bash
npm install --legacy-peer-deps
npm run dev
```
Sau đó mở trình duyệt tại: **http://localhost:5173**

## 🎮 Các Phân Khu Chức Năng Đã Hoàn Thiện

1. **🗺️ Bản Đồ Vũ Trụ 3D & 4 Vương Quốc Độ Tuổi (`src/components/three/Avatar3DScene.tsx`):**
   - **🌱 Vương Quốc 1 (Mầm non 4–6 tuổi):** *Pre-Starters & Phonics A–Z* (Animals, Fruits, Toys).
   - **🏝️ Vương Quốc 2 (Lớp 1–3):** *Cambridge Starters & SGK Lớp 1–3* (School Supplies, Action Talents, Space & Weather).
   - **🏰 Vương Quốc 3 (Lớp 4–5):** *Cambridge Movers & Flyers* (Mystery Town Detective, Time-Machine Past Simple, Nature & Superlatives).
   - **🪐 Vương Quốc 4 (Lớp 6–7):** *Cambridge KET (A2) & Global Success 6–7* (Green Planet & First Conditional, Phrasal Verbs & Idioms Lab, Future AI City).

2. **⚔️ Tổ Hợp 6 Mini-Games Tương Tác Trong Mỗi Đảo (`src/components/games/MiniGameArena.tsx`):**
   - **1. Khám Phá Mô Hình 3D (3D Toy Studio):** Xoay 360° khối 3D, nghe phát âm chuẩn bản xứ + câu giao tiếp + ghi chú Phonics/Ngữ pháp.
   - **2. Đập Bong Bóng 3D (Bubble Pop):** Lắng nghe phát âm và đập đúng quả bong bóng 3D đang bay.
   - **3. Đầu Bếp Quái Vật (Hungry Monster Chef):** Đút đúng món ăn/từ vựng theo yêu cầu của Khủng Long 3D.
   - **4. Đấu Trùm Slime (Slime Boss Grammar & Sentence Raid):** Lắp bánh răng từ vựng & ngữ pháp để nhân vật 3D tung chiêu đánh Boss.
   - **5. Thám Tử Nhí (3D Mystery Detective):** Giải mã manh mối đọc hiểu & tình huống tiếng Anh.
   - **6. Xây Cầu Giọng Nói AI (Magic Voice Bridge):** Luyện phát âm qua Microphone (chấm điểm 0–100%) để xây cầu Cầu Vồng mở Rương Kho Báu.

3. **👗 Tủ Đồ 3D, Tiến Hóa Thú Cưng & Đập Túi Mù (`src/components/wardrobe/WardrobePetStudio.tsx`):**
   - 6 Nhân vật 3D gốc (*Gấu Bơ, Thỏ Kem, Khủng Long Rex, Mèo Vũ Trụ, Hiệp Sĩ Leo, Phù Thủy Luna*).
   - 6 Khe phụ kiện 3D gắn trực tiếp lên nhân vật (*Mũ, Kính, Áo/Giáp, Cánh/Jetpack, Vũ khí/Đũa phép, Hào quang Aura*).
   - Hệ thống **Ấp Trứng & Tiến Hóa Thú Cưng 3D** qua 3 cấp độ + **Máy Đập Túi Mù (Blind Box Gacha)**.

4. **📒 Sổ Sa Bàn Sticker Động Kéo Thả (`src/components/diorama/StickerDioramaBook.tsx`):**
   - 4 Khung cảnh Sa bàn (*Nông Trại Cầu Vồng, Thủy Cung Đại Dương, Vương Quốc Phép Thuật, Trạm Vũ Trụ*).
   - Kéo thả, phóng to/thu nhỏ, xoay góc các Sticker đã mở khóa và bấm vào Sticker để nghe phát âm tiếng Anh.

5. **🏆 Bảng Xếp Hạng Sân Khấu 3D & Góc Phụ Huynh (`src/components/leaderboard/Leaderboard3DPodium.tsx`):**
   - Phân hạng theo Khối lớp và 3 hạng mục (*Siêu Sao Học Tập, Chiến Thần Phát Âm, Nhà Sưu Tập*).
   - Bấm vào bất kỳ bạn nào trên bảng xếp hạng để xem trực tiếp mô hình Nhân vật 3D & Trang phục của bạn đó.

## 🗄️ Kết Nối Database Supabase
1. Mở **Supabase SQL Editor** trong dự án Supabase của bạn.
2. Copy nội dung file [`supabase/schema.sql`](./supabase/schema.sql) và bấm **RUN**.
3. Dán `Project URL` và `Anon Key` vào mục **Phụ Huynh & DB** ngay trên góc phải giao diện web (mật khẩu cổng phụ huynh: `7 x 3 = 21`) hoặc điền vào file `.env`.
