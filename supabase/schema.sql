-- =================================================================================
-- WONDERVERSE 3D - SUPABASE POSTGRESQL SCHEMA
-- Hệ thống Học Tiếng Anh 3D Tương Tác (Từ Mầm Non Đến Lớp 6 - 7)
-- Cách dùng: Copy toàn bộ nội dung file này dán vào Supabase SQL Editor và bấm RUN.
-- =================================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. BẢNG HỒ SƠ HỌC SINH (STUDENT PROFILES)
create table if not exists public.student_profiles (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references auth.users(id) on delete cascade,
  nickname text not null default 'Bé Chăm Ngoan',
  grade_tier smallint not null default 1 check (grade_tier between 1 and 4),
  -- 1: Sprout (Mầm non 4-6t), 2: Explorer (Lớp 1-3), 3: Adventurer (Lớp 4-5), 4: Master (Lớp 6-7)
  avatar_base text not null default 'bear',
  -- 'bear' | 'rabbit' | 'dino' | 'cat' | 'knight' | 'wizard'
  level integer not null default 1,
  stars integer not null default 120,
  rainbow_gems integer not null default 350,
  streak_days integer not null default 3,
  speaking_score_total integer not null default 85,
  equipped_skin jsonb not null default '{
    "hat": "crown_gold",
    "glasses": "none",
    "outfit": "cape_royal",
    "wing": "angel_wings",
    "hand_item": "magic_wand",
    "aura": "starlight"
  }'::jsonb,
  pet_state jsonb not null default '{
    "pet_id": "dragon_sky",
    "name": "Poko Dragon",
    "stage": 2,
    "exp": 65,
    "happiness": 95
  }'::jsonb,
  unlocked_items text[] not null default array[
    'crown_gold', 'wizard_hat', 'cape_royal', 'angel_wings', 'magic_wand', 'starlight',
    'sticker_lion', 'sticker_apple', 'sticker_rocket', 'sticker_dragon', 'sticker_castle'
  ],
  completed_lessons text[] not null default array['t1-isl-1'],
  unlocked_decor_ids text[] not null default array[
    'decor_gate_rainbow', 'decor_statue_yeti', 'decor_bldg_cottage', 'decor_nature_tree', 'decor_nature_lamp'
  ],
  placed_island_decors jsonb not null default '[]'::jsonb,
  home_island_theme text not null default 'sunny',
  screen_time_limit_mins integer not null default 30,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

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

-- 3. BẢNG LƯU Bố CỤC SA BÀN STICKER 3D CỦA BÉ (STICKER DIORAMA PLACEMENTS)
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

-- 6. THIẾT LẬP ROW LEVEL SECURITY (RLS) CHO DEMO & PRODUCTION
alter table public.student_profiles enable row level security;
alter table public.knowledge_srs enable row level security;
alter table public.sticker_diorama_placements enable row level security;
alter table public.lesson_logs enable row level security;

create policy "Allow public read leaderboard profiles"
  on public.student_profiles for select using (true);

create policy "Allow public insert/update student_profiles for MVP"
  on public.student_profiles for all using (true) with check (true);

create policy "Allow public access knowledge_srs for MVP"
  on public.knowledge_srs for all using (true) with check (true);

create policy "Allow public access sticker_diorama_placements for MVP"
  on public.sticker_diorama_placements for all using (true) with check (true);

create policy "Allow public access lesson_logs for MVP"
  on public.lesson_logs for all using (true) with check (true);

-- 7. SEED DATA MẪU CHO BẢNG XẾP HẠNG 4 KHỐI LỚP
insert into public.student_profiles (nickname, grade_tier, avatar_base, level, stars, rainbow_gems, streak_days, speaking_score_total, equipped_skin, pet_state)
values
  ('Bé Bơ Siêu Cấp', 1, 'bear', 8, 420, 580, 12, 310, '{"hat":"crown_gold","glasses":"star_shades","outfit":"cape_royal","wing":"angel_wings","hand_item":"magic_wand","aura":"rainbow_ring"}', '{"pet_id":"dragon_sky","name":"Rồng Sữa","stage":3,"exp":100,"happiness":100}'),
  ('Mimi Thỏ Hồng', 1, 'rabbit', 6, 350, 410, 8, 280, '{"hat":"bunny_ears","glasses":"none","outfit":"dress_fairy","wing":"butterfly_wings","hand_item":"balloon_heart","aura":"starlight"}', '{"pet_id":"cloud_pet","name":"Mây Kẹo","stage":2,"exp":80,"happiness":95}'),
  ('Minh Khôi Lớp 2A', 2, 'dino', 11, 590, 720, 15, 450, '{"hat":"astro_helmet","glasses":"cyber_visor","outfit":"space_suit","wing":"jetpack_3d","hand_item":"laser_sword","aura":"cyber_pulse"}', '{"pet_id":"robo_pup","name":"Cún Robo","stage":3,"exp":100,"happiness":98}'),
  ('Bảo Ngọc Starters', 2, 'cat', 9, 480, 530, 10, 390, '{"hat":"wizard_hat","glasses":"star_shades","outfit":"cape_royal","wing":"angel_wings","hand_item":"magic_wand","aura":"starlight"}', '{"pet_id":"dragon_sky","name":"Meo Tinh Vân","stage":2,"exp":75,"happiness":92}'),
  ('Hiệp Sĩ Leo Lớp 5', 3, 'knight', 16, 840, 1100, 21, 690, '{"hat":"crown_gold","glasses":"cyber_visor","outfit":"knight_armor","wing":"dragon_wings","hand_item":"laser_sword","aura":"fire_flame"}', '{"pet_id":"dragon_sky","name":"Hỏa Long","stage":3,"exp":100,"happiness":100}'),
  ('Luna Phù Thủy 6A', 4, 'wizard', 22, 1250, 1680, 30, 980, '{"hat":"wizard_hat","glasses":"star_shades","outfit":"wizard_robe","wing":"angel_wings","hand_item":"magic_wand","aura":"rainbow_ring"}', '{"pet_id":"dragon_sky","name":"Thần Long Ngân Hà","stage":3,"exp":100,"happiness":100}');
