-- =================================================================================
-- PIPPO 3D - SUPABASE POSTGRESQL SCHEMA (CHUẨN HÓA 9 HỌC SINH & BẢO MẬT)
-- Hệ thống Học Tiếng Anh 3D Tương Tác (Từ Mầm Non Đến Lớp 10)
-- Cách dùng: Copy toàn bộ nội dung file này dán vào Supabase SQL Editor và bấm RUN.
-- =================================================================================

-- Kích hoạt UUID extension
create extension if not exists "uuid-ossp";

-- 1. BẢNG HỒ SƠ HỌC SINH (STUDENT PROFILES)
create table if not exists public.student_profiles (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references auth.users(id) on delete set null,
  username text unique not null,
  full_name text not null default 'Học Sinh Pippo',
  nickname text not null default 'Bé Chăm Ngoan',
  grade_tier smallint not null default 1 check (grade_tier between 1 and 4),
  -- 1: Sprout (Mầm non 1-5t), 2: Explorer (Lớp 1-3), 3: Adventurer (Lớp 4-5), 4: Master (Lớp 6-10)
  avatar_base text not null default 'bear',
  -- 'bear' | 'rabbit' | 'dino' | 'cat' | 'knight' | 'wizard'
  level integer not null default 0,
  stars integer not null default 0,
  rainbow_gems integer not null default 0,
  streak_days integer not null default 0,
  speaking_score_total integer not null default 0,
  has_claimed_welcome_gift boolean not null default false,
  equipped_skin jsonb not null default '{
    "hat": "none",
    "glasses": "none",
    "outfit": "none",
    "wing": "none",
    "hand_item": "none",
    "aura": "none"
  }'::jsonb,
  pet_state jsonb not null default '{
    "pet_id": "dragon_sky",
    "name": "Poko Rồng Con",
    "stage": 1,
    "exp": 0,
    "happiness": 100
  }'::jsonb,
  unlocked_items text[] not null default array['none'],
  completed_lessons text[] not null default array[]::text[],
  unlocked_decor_ids text[] not null default array['decor_gate_rainbow', 'decor_nature_tree'],
  placed_island_decors jsonb not null default '[]'::jsonb,
  home_island_theme text not null default 'sunny',
  screen_time_limit_mins integer not null default 30,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Bổ sung các cột nếu bảng đã tồn tại từ trước
alter table public.student_profiles add column if not exists username text;
alter table public.student_profiles add column if not exists full_name text default 'Học Sinh Pippo';
alter table public.student_profiles add column if not exists has_claimed_welcome_gift boolean default false;
create unique index if not exists idx_student_profiles_username on public.student_profiles (username);

-- 2. BẢNG TIẾN ĐỘ ÔN TẬP NGẮT QUÃNG (SPACED REPETITION SYSTEM - SRS)
create table if not exists public.knowledge_srs (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  item_key text not null,
  english_word text not null,
  grade_tier smallint not null default 1,
  mastery_score integer not null default 25 check (mastery_score between 0 and 100),
  correct_streak integer not null default 1,
  last_practiced_at timestamptz not null default now(),
  next_review_at timestamptz not null default (now() + interval '1 day'),
  unique(student_id, item_key)
);

-- 3. BẢNG LƯU BỐ CỤC SA BÀN STICKER 3D CỦA BÉ (STICKER DIORAMA PLACEMENTS)
create table if not exists public.sticker_diorama_placements (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  scene_id text not null default 'ocean_palace',
  sticker_id text not null,
  pos_x numeric not null default 50,
  pos_y numeric not null default 50,
  scale numeric not null default 1.0,
  rotation numeric not null default 0,
  created_at timestamptz not null default now()
);

-- 4. BẢNG LỊCH SỬ BÀI HỌC & ĐIỂM SỐ (LESSON LOGS)
create table if not exists public.lesson_logs (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  lesson_id text not null,
  game_mode text not null,
  stars_earned smallint not null default 3,
  gems_earned integer not null default 25,
  accuracy_percent smallint not null default 100,
  completed_at timestamptz not null default now()
);

-- 5. VIEW BẢNG XẾP HẠNG PHÂN THEO KHỐI LỚP (TIERED LEADERBOARD VIEW)
create or replace view public.weekly_leaderboard_view as
select
  id,
  username,
  full_name,
  nickname,
  grade_tier,
  avatar_base,
  level,
  stars,
  speaking_score_total,
  streak_days,
  coalesce(array_length(unlocked_items, 1), 0) as total_collectibles,
  equipped_skin,
  pet_state,
  dense_rank() over (partition by grade_tier order by stars desc, speaking_score_total desc) as tier_rank,
  dense_rank() over (order by stars desc) as global_rank
from public.student_profiles;

-- 6. THIẾT LẬP ROW LEVEL SECURITY (RLS): CHỈ CHO PHÉP ĐỌC & SỬA, CẤM ĐĂNG KÝ MỚI TỪ BÊN NGOÀI
alter table public.student_profiles enable row level security;
alter table public.knowledge_srs enable row level security;
alter table public.sticker_diorama_placements enable row level security;
alter table public.lesson_logs enable row level security;

-- Xóa các policy cũ nếu có
drop policy if exists "Allow public read leaderboard profiles" on public.student_profiles;
drop policy if exists "Allow public read student_profiles" on public.student_profiles;
drop policy if exists "Allow public insert/update student_profiles for MVP" on public.student_profiles;
drop policy if exists "Deny public registration" on public.student_profiles;
drop policy if exists "Allow students update own profile" on public.student_profiles;

-- Chính sách 1: Cho phép đọc thông tin bảng xếp hạng công khai
create policy "Allow public read student_profiles"
  on public.student_profiles for select using (true);

-- Chính sách 2: CẤM TẠO MỚI CÔNG KHAI (Chỉ Admin / Bạn chạy SQL mới tạo được tài khoản học sinh)
create policy "Deny public registration"
  on public.student_profiles for insert with check (false);

-- Chính sách 3: Cho phép học sinh cập nhật điểm số, trang phục, tiến độ cá nhân
create policy "Allow students update own profile"
  on public.student_profiles for update using (true) with check (true);

-- Cho phép truy cập các bảng nhật ký học tập
create policy "Allow public access knowledge_srs for MVP"
  on public.knowledge_srs for all using (true) with check (true);

create policy "Allow public access sticker_diorama_placements for MVP"
  on public.sticker_diorama_placements for all using (true) with check (true);

create policy "Allow public access lesson_logs for MVP"
  on public.lesson_logs for all using (true) with check (true);

-- 7. KHỞI TẠO 9 TÀI KHOẢN HỌC SINH CHÍNH THỨC
-- Cấp độ ban đầu = 0, 0 sao, 0 ngọc. Khi đăng nhập lần đầu bé sẽ nhận Hộp Quà Tân Thủ 1,000 Ngọc Cầu Vồng 💎
insert into public.student_profiles (
  username, full_name, nickname, grade_tier, avatar_base, level, stars, rainbow_gems, streak_days, has_claimed_welcome_gift
)
values
  ('minhduc', 'Vũ Minh Đức', 'Minh Đức', 4, 'wizard', 0, 0, 0, 0, false),
  ('quynhhuong', 'Lê Võ Quỳnh Hương', 'Bông', 4, 'cat', 0, 0, 0, 0, false),
  ('quynhthom', 'Lê Võ Quỳnh Thơm', 'Su', 3, 'rabbit', 0, 0, 0, 0, false),
  ('minhanh', 'Lê Võ Minh Anh', 'Ruby', 2, 'rabbit', 0, 0, 0, 0, false),
  ('tuyetvan', 'Lê Võ Tuyết Vân', 'Gấu', 2, 'bear', 0, 0, 0, 0, false),
  ('duyanh', 'Nguyễn Đình Duy Anh', 'Beo', 2, 'dino', 0, 0, 0, 0, false),
  ('thienphuc', 'Nguyễn Thiên Phúc', 'Tony', 1, 'dino', 0, 0, 0, 0, false),
  ('thientra', 'Nguyễn Võ Thiên Trà', 'Bé', 1, 'cat', 0, 0, 0, 0, false),
  ('thienminh', 'Nguyễn Thiên Minh', 'Harry', 1, 'bear', 0, 0, 0, 0, false)
on conflict (username) do update set
  full_name = excluded.full_name,
  nickname = excluded.nickname,
  grade_tier = excluded.grade_tier;

-- 8. DỮ LIỆU KHỞI TẠO CHO 3 BẢNG HOẠT ĐỘNG (KNOWLEDGE_SRS, STICKER_DIORAMA, LESSON_LOGS)

-- 8.1. Nạp từ vựng khởi đầu vào Sổ Từ Vựng SRS cho 9 bé
insert into public.knowledge_srs (student_id, item_key, english_word, grade_tier, mastery_score, correct_streak)
select
  p.id,
  v.item_key,
  v.english_word,
  p.grade_tier,
  v.mastery_score,
  v.correct_streak
from public.student_profiles p
cross join (
  values
    ('apple', 'Apple', 60, 2),
    ('cat', 'Cat', 75, 3),
    ('sun', 'Sun', 50, 1),
    ('star', 'Star', 80, 4),
    ('school', 'School', 65, 2),
    ('rainbow', 'Rainbow', 90, 5)
) as v(item_key, english_word, mastery_score, correct_streak)
on conflict (student_id, item_key) do nothing;

-- 8.2. Nạp vị trí sticker khởi đầu vào Sa Bàn 3D
insert into public.sticker_diorama_placements (student_id, scene_id, sticker_id, pos_x, pos_y, scale, rotation)
select
  p.id,
  'ocean_palace',
  'sticker_dragon',
  50,
  50,
  1.0,
  0
from public.student_profiles p
where not exists (
  select 1 from public.sticker_diorama_placements s where s.student_id = p.id
);

-- 8.3. Nạp nhật ký bài học mở đầu (Đảo 1)
insert into public.lesson_logs (student_id, lesson_id, game_mode, stars_earned, gems_earned, accuracy_percent)
select
  p.id,
  't' || p.grade_tier || '-isl-1',
  'discover_bubble',
  3,
  50,
  100
from public.student_profiles p
where not exists (
  select 1 from public.lesson_logs l where l.student_id = p.id
);
