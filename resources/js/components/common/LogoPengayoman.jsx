import React from 'react';

/**
 * Official Logo Pengayoman dengan Kotak Biru Navy dan Lambang Kuning
 * Persis sesuai template resmi naskah dinas Kementerian Hukum RI
 */
export const LogoPengayoman = ({
  className = "w-20 h-24",
  bgColor = "#0F2042",
  symbolColor = "#FFDE00"
}) => {
  return (
    <div className={`relative overflow-hidden flex flex-col items-center justify-between p-2 shrink-0 ${className}`} style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 400 360"
        className="w-full h-auto flex-1"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Logo Pengayoman"
      >
        {/* Background Box for Vector Print Compatibility */}
        <rect width="400" height="360" fill={bgColor} />
        <g
          fill="none"
          stroke={symbolColor}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* 1. Top Central Arch (Puncak Utama) */}
          <path d="M 148 115 A 52 52 0 0 1 252 115" />

          {/* 2. Middle Left Arch (Lengkungan Tengah Kiri) */}
          <path d="M 98 156 A 50 50 0 0 1 198 156" />

          {/* 3. Middle Right Arch (Lengkungan Tengah Kanan) */}
          <path d="M 202 156 A 50 50 0 0 1 302 156" />

          {/* 4. Outer Bottom Left Arch (Lengkungan Bawah Kiri) */}
          <path d="M 52 195 A 48 48 0 0 1 146 195" />

          {/* 5. Outer Bottom Right Arch (Lengkungan Bawah Kanan) */}
          <path d="M 254 195 A 48 48 0 0 1 348 195" />

          {/* Batang Kiri & Akar Horizontal Kiri */}
          <path d="M 85 305 L 168 305 L 168 156" />

          {/* Batang Tengah Kiri */}
          <path d="M 189 312 L 189 115" />

          {/* Batang Tengah Kanan */}
          <path d="M 211 312 L 211 115" />

          {/* Batang Kanan & Akar Horizontal Kanan */}
          <path d="M 315 305 L 232 305 L 232 156" />
        </g>

        {/* Teks PENGAYOMAN */}
        <text
          x="200"
          y="350"
          textAnchor="middle"
          fill={symbolColor}
          fontSize="30"
          fontWeight="900"
          fontFamily="Arial, Helvetica, sans-serif"
          letterSpacing="4"
        >
          PENGAYOMAN
        </text>
      </svg>
    </div>
  );
};

export default LogoPengayoman;
