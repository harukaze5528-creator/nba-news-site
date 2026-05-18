export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      {/* 背景 */}
      <rect width="32" height="32" rx="6" fill="#003DA5" />

      {/* バスケットボールのライン（白） */}
      <circle cx="16" cy="16" r="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <line x1="16" y1="6" x2="16" y2="26" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <line x1="6" y1="16" x2="26" y2="16" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

      {/* 「PA」テキスト */}
      <text x="16" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="1">PA</text>
    </svg>
  );
}