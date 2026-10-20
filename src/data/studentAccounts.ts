import { AvatarBaseId, GradeTier } from './curriculumData';

export interface PreconfiguredStudent {
  id: string;
  fullName: string;
  nickname: string;
  username: string;
  aliases?: string[];
  defaultPassword: string;
  gradeTier: GradeTier;
  gradeLabel: string;
  ageLabel: string;
  avatarBase: AvatarBaseId;
  badgeEmoji: string;
  quote: string;
}

export const WELCOME_GIFT_REWARD = {
  gems: 1000,
  stars: 50,
  title: '🎁 Hộp Quà Tân Thủ Pippo English',
  subtitle: 'Món quà đặc biệt dành tặng bé khi lần đầu đăng nhập!',
  description:
    'Chúc mừng bé đã gia nhập thế giới Pippo English! Bạn nhận được 1,000 Ngọc Cầu Vồng 💎 và 50 Sao ⭐ để thỏa sức vào Túi Đồ và Cửa Hàng sắm trang phục hoàng gia và thú cưng đồng hành nhé!',
};

export const PRECONFIGURED_STUDENTS: PreconfiguredStudent[] = [
  {
    id: 'std_minhduc',
    fullName: 'Vũ Minh Đức',
    nickname: 'Minh Đức',
    username: 'minhduc',
    defaultPassword: 'duc123@',
    gradeTier: 4,
    gradeLabel: 'Lớp 10',
    ageLabel: '15 – 16 Tuổi',
    avatarBase: 'wizard',
    badgeEmoji: '🪐',
    quote: 'Chinh phục tiếng Anh học thuật & ngữ pháp nâng cao!',
  },
  {
    id: 'std_quynhhuong',
    fullName: 'Lê Võ Quỳnh Hương',
    nickname: 'Bông',
    username: 'quynhhuong',
    defaultPassword: 'huong123@',
    gradeTier: 4,
    gradeLabel: 'Lớp 7',
    ageLabel: '12 – 13 Tuổi',
    avatarBase: 'cat',
    badgeEmoji: '🌸',
    quote: 'Bé Bông đáng yêu, học giỏi từ vựng mỗi ngày!',
  },
  {
    id: 'std_quynhthom',
    fullName: 'Lê Võ Quỳnh Thơm',
    nickname: 'Su',
    username: 'quynhthom',
    defaultPassword: 'thom123@',
    gradeTier: 3,
    gradeLabel: 'Lớp 5',
    ageLabel: '10 – 11 Tuổi',
    avatarBase: 'rabbit',
    badgeEmoji: '⭐',
    quote: 'Bé Su thông minh, tự tin giao tiếp tiếng Anh!',
  },
  {
    id: 'std_minhanh',
    fullName: 'Lê Võ Minh Anh',
    nickname: 'Ruby',
    username: 'minhanh',
    defaultPassword: 'anh123@',
    gradeTier: 2,
    gradeLabel: 'Lớp 3',
    ageLabel: '8 – 9 Tuổi',
    avatarBase: 'rabbit',
    badgeEmoji: '💎',
    quote: 'Ruby rực rỡ, sẵn sàng vượt qua 80 hòn đảo thám hiểm!',
  },
  {
    id: 'std_tuyetvan',
    fullName: 'Lê Võ Tuyết Vân',
    nickname: 'Gấu',
    username: 'tuyetvan',
    aliases: ['vogau', 'gau', 'van', 'levotuyetvan'],
    defaultPassword: 'van123@',
    gradeTier: 2,
    gradeLabel: 'Lớp 1',
    ageLabel: '6 – 7 Tuổi',
    avatarBase: 'bear',
    badgeEmoji: '🐻',
    quote: 'Bé Gấu Tuyết Vân năng động, học phát âm cực chuẩn!',
  },
  {
    id: 'std_duyanh',
    fullName: 'Nguyễn Đình Duy Anh',
    nickname: 'Beo',
    username: 'duyanh',
    aliases: ['dinhduyanh'],
    defaultPassword: 'anh123@',
    gradeTier: 2,
    gradeLabel: 'Lớp 1',
    ageLabel: '6 – 7 Tuổi',
    avatarBase: 'dino',
    badgeEmoji: '🦖',
    quote: 'Chú Beo dũng mãnh, săn sao và ngọc cầu vồng!',
  },
  {
    id: 'std_thienphuc',
    fullName: 'Nguyễn Thiên Phúc',
    nickname: 'Tony',
    username: 'thienphuc',
    defaultPassword: 'phuc123@',
    gradeTier: 1,
    gradeLabel: 'Mầm Non (5 tuổi)',
    ageLabel: '5 Tuổi',
    avatarBase: 'dino',
    badgeEmoji: '🌟',
    quote: 'Tony khám phá thế giới nông trại & động vật vui vẻ!',
  },
  {
    id: 'std_thientra',
    fullName: 'Nguyễn Võ Thiên Trà',
    nickname: 'Bé',
    username: 'thientra',
    defaultPassword: 'tra123@',
    gradeTier: 1,
    gradeLabel: 'Mầm Non (4 tuổi)',
    ageLabel: '4 Tuổi',
    avatarBase: 'cat',
    badgeEmoji: '🎀',
    quote: 'Thiên Trà dễ thương, mê hoa quả và âm thanh Phonics!',
  },
  {
    id: 'std_thienminh',
    fullName: 'Nguyễn Thiên Minh',
    nickname: 'Harry',
    username: 'thienminh',
    defaultPassword: 'minh123@',
    gradeTier: 1,
    gradeLabel: 'Mầm Non (1 tuổi)',
    ageLabel: '1 Tuổi',
    avatarBase: 'bear',
    badgeEmoji: '🍼',
    quote: 'Bé út Harry đáng yêu, làm quen màu sắc & bài hát vui nhộn!',
  },
];

/**
 * Chuẩn hóa chuỗi tìm kiếm (không dấu, thường)
 */
function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/@pippo\.app$/i, '')
    .replace(/@pippo\.edu\.vn$/i, '')
    .replace(/@wonderverse\.edu\.vn$/i, '');
}

/**
 * Tìm kiếm học sinh theo username hoặc alias
 */
export function findStudentByUsername(usernameInput: string): PreconfiguredStudent | undefined {
  const clean = normalizeStr(usernameInput);
  return PRECONFIGURED_STUDENTS.find(
    (s) =>
      normalizeStr(s.username) === clean ||
      (s.aliases && s.aliases.some((alias) => normalizeStr(alias) === clean))
  );
}

/**
 * Xác thực thông tin đăng nhập học sinh
 */
export function authenticatePreconfiguredStudent(
  usernameInput: string,
  passwordInput: string,
  storedPasswords?: Record<string, string>
): { success: boolean; student?: PreconfiguredStudent; message?: string } {
  const student = findStudentByUsername(usernameInput);
  if (!student) {
    return {
      success: false,
      message: 'Không tìm thấy tài khoản học sinh này trong danh sách!',
    };
  }

  // Kiểm tra mật khẩu (ưu tiên mật khẩu đã đổi trong bộ nhớ, nếu chưa đổi thì dùng mật khẩu mặc định)
  const currentPassword = (storedPasswords && storedPasswords[student.username]) || student.defaultPassword;
  const isMatch =
    passwordInput.trim() === currentPassword ||
    (student.username === 'tuyetvan' && passwordInput.trim() === 'gau123@');
  if (!isMatch) {
    return {
      success: false,
      message: 'Mật khẩu chưa chính xác! Vui lòng thử lại hoặc liên hệ giáo viên/phụ huynh.',
    };
  }

  return {
    success: true,
    student,
  };
}
