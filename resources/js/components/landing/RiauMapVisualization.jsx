import React, { useState, useMemo, useRef } from 'react';
import {
  MapPin,
  Building2,
  Landmark,
  Sparkles,
  TrendingUp,
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Info,
  CheckCircle2,
  Award,
  Palette,
  Compass,
  Eye,
} from 'lucide-react';
import RIAU_REGIONS_GEO from './riau_regions_geo.json';

/**
 * Tim Kerja Kanwil Color Themes
 * Tim 1: Ocean Azure Royal Blue
 * Tim 2: Sunburst Amber Gold
 * Tim 3: Lush Emerald Jade
 */
const TIM_KERJA_THEMES = {
  1: {
    nama: 'Tim Kerja 1',
    labelColor: 'text-blue-900',
    bgBadge: 'bg-blue-100 text-blue-950 border-blue-300',
    accentColor: '#1D4ED8',
    gradientId: 'grad-tim-1',
    wilayahNames: 'Pemprov Riau, Siak, Kampar, Inhil, Bengkalis',
    totalWilayah: 5,
  },
  2: {
    nama: 'Tim Kerja 2',
    labelColor: 'text-amber-950',
    bgBadge: 'bg-amber-100 text-amber-950 border-amber-300',
    accentColor: '#D97706',
    gradientId: 'grad-tim-2',
    wilayahNames: 'Rohul, Inhu, Kep. Meranti, Kota Dumai',
    totalWilayah: 4,
  },
  3: {
    nama: 'Tim Kerja 3',
    labelColor: 'text-emerald-950',
    bgBadge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    accentColor: '#059669',
    gradientId: 'grad-tim-3',
    wilayahNames: 'Kuansing, Pelalawan, Rohil, Kota Pekanbaru',
    totalWilayah: 4,
  },
};

/**
 * Format helper for Indonesian decimals (e.g. 51,6%)
 */
const fmtPct = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0,0';
  return Number(val).toFixed(1).replace('.', ',');
};

export const RiauMapVisualization = ({
  wilayahList = [],
  selectedWilayahId = 3,
  onSelectWilayah = () => {},
  activeRegulasi = 'gabungan',
  isLive = false,
}) => {
  const [hoveredWilayahId, setHoveredWilayahId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false });
  const [zoomLevel, setZoomLevel] = useState(1);
  const mapContainerRef = useRef(null);

  // Map Data lookup dictionary by kabupaten_id (covers all 13 entities)
  const wilayahMap = useMemo(() => {
    const map = new Map();
    wilayahList.forEach((w) => {
      map.set(Number(w.kabupaten_id), w);
    });
    return map;
  }, [wilayahList]);

  // Province Level Data (kabupaten_id: 1 - Pemerintah Provinsi Riau)
  const provData = useMemo(() => {
    return wilayahMap.get(1) || null;
  }, [wilayahMap]);

  // Active hover/selected target object
  const activeWilayah = useMemo(() => {
    const targetId = hoveredWilayahId || selectedWilayahId;
    return wilayahMap.get(Number(targetId)) || null;
  }, [hoveredWilayahId, selectedWilayahId, wilayahMap]);

  // Mouse move handler for reactive floating tooltip
  const handleMouseMove = (e, geo) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltipPos({
      x,
      y,
      visible: true,
    });
    setHoveredWilayahId(geo.id);
  };

  const handleMouseLeave = () => {
    setHoveredWilayahId(null);
    setTooltipPos((prev) => ({ ...prev, visible: false }));
  };

  // Determine fill for region path based on Tim Kerja Kanwil
  const getFillId = (geoId) => {
    const w = wilayahMap.get(geoId);
    const timId = Number(w?.tim_kerja_id) || (geoId === 2 || geoId === 3 || geoId === 4 || geoId === 5 ? 1 : geoId === 6 || geoId === 7 || geoId === 8 || geoId === 9 ? 2 : 3);
    if (timId === 1) return 'url(#grad-tim-1)';
    if (timId === 2) return 'url(#grad-tim-2)';
    return 'url(#grad-tim-3)';
  };

  return (
    <div className="w-full space-y-4">
      {/* =========================================================================
          PROVINCE-LEVEL FLAGSHIP BANNER (PEMERINTAH PROVINSI RIAU - ID: 1)
          Ensures the 13th entity is prominently integrated with 100% data fidelity!
          ========================================================================= */}
      {provData && (
        <div
          onClick={() => onSelectWilayah(1)}
          onMouseEnter={() => setHoveredWilayahId(1)}
          onMouseLeave={() => setHoveredWilayahId(null)}
          tabIndex={0}
          role="button"
          aria-label="Pilih data tingkat Pemerintah Provinsi Riau"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectWilayah(1);
            }
          }}
          className={`group relative overflow-hidden rounded-2xl p-4 sm:p-4.5 border transition-all duration-300 cursor-pointer ${
            selectedWilayahId === 1
              ? 'bg-gradient-to-r from-[#1E2342] via-[#2B3056] to-[#1E2342] border-[#FFD82B] text-white shadow-lg ring-2 ring-[#FFD82B]/40'
              : 'bg-gradient-to-r from-white via-slate-50 to-white border-slate-200/90 hover:border-slate-300 text-slate-800 shadow-2xs hover:shadow-sm'
          }`}
        >
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-[#FFD82B]/10 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                  selectedWilayahId === 1
                    ? 'bg-[#FFD82B] text-[#2B3056] shadow-xs'
                    : 'bg-[#2B3056] text-[#FFD82B]'
                }`}
              >
                <Landmark className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-sm sm:text-base font-black leading-tight ${
                      selectedWilayahId === 1 ? 'text-white' : 'text-[#2B3056]'
                    }`}
                  >
                    Pemerintah Provinsi Riau
                  </h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${
                      selectedWilayahId === 1
                        ? 'bg-[#FFD82B]/20 text-[#FFD82B] border border-[#FFD82B]/40'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    Tingkat Provinsi
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    selectedWilayahId === 1 ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Entitas Provinsi ke-13 • Binaan {provData.tim_kerja_nama}
                </p>
              </div>
            </div>

            {/* Quick Metrics for Provinsi Riau */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div
                className={`text-right px-3 py-1.5 rounded-xl border ${
                  selectedWilayahId === 1
                    ? 'bg-white/10 border-white/15'
                    : 'bg-slate-100/80 border-slate-200'
                }`}
              >
                <span
                  className={`text-[10px] font-bold block uppercase tracking-wider ${
                    selectedWilayahId === 1 ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {activeRegulasi === 'ranperda'
                    ? 'Ranperda (ProPem)'
                    : activeRegulasi === 'ranperkada'
                    ? 'Ranperkada (Progsun)'
                    : 'Total Gabungan'}
                </span>
                <div className="flex items-baseline gap-1 justify-end font-mono">
                  <span
                    className={`text-sm sm:text-base font-black ${
                      selectedWilayahId === 1 ? 'text-white' : 'text-[#2B3056]'
                    }`}
                  >
                    {activeRegulasi === 'ranperda'
                      ? `${provData.ranperda.harmonisasi}/${provData.ranperda.rencana}`
                      : activeRegulasi === 'ranperkada'
                      ? `${provData.ranperkada.harmonisasi}/${provData.ranperkada.rencana}`
                      : `${provData.total.harmonisasi}/${provData.total.rencana}`}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      selectedWilayahId === 1 ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    selesai
                  </span>
                </div>
              </div>

              {/* Rasio Badge */}
              <span
                className={`px-3 py-2 rounded-xl text-xs font-black font-mono shadow-xs border ${
                  selectedWilayahId === 1
                    ? 'bg-[#FFD82B] text-[#2B3056] border-[#FFD82B]'
                    : 'bg-[#2B3056] text-[#FFD82B] border-[#2B3056]'
                }`}
              >
                Rasio{' '}
                {fmtPct(
                  activeRegulasi === 'ranperda'
                    ? provData.ranperda.rasio
                    : activeRegulasi === 'ranperkada'
                    ? provData.ranperkada.rasio
                    : provData.total.rasio
                )}
                %
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAP CONTROLS TOOLBAR: INFO & NAVIGATION ZOOM
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Left: Tim Kerja Kanwil Information Title */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-2xs">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <span className="text-xs sm:text-sm font-black text-[#2B3056] block leading-tight">
              Peta Pembagian Wilayah Tim Kerja Kanwil Kemenkum Riau
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              3 Tim Kerja Perancang memfasilitasi pembentukan regulasi di 13 entitas daerah
            </span>
          </div>
        </div>

        {/* Right: Map Navigation Tools */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.12))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
            title="Perbesar Peta"
            aria-label="Perbesar Peta"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.88, z - 0.12))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
            title="Perkecil Peta"
            aria-label="Perkecil Peta"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition cursor-pointer"
            title="Kembalikan Tampilan Normal"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN MAP CANVAS WITH TIM KERJA KANWIL GRADIENTS
          ========================================================================= */}
      <div
        ref={mapContainerRef}
        className="relative w-full rounded-3xl border border-slate-200/90 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] p-4 sm:p-6 shadow-sm overflow-hidden min-h-[520px] sm:min-h-[620px] select-none"
      >
        {/* Soft Decorative Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#2B3056 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Coastal Ocean Watermark / Compass Badge */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3.5 py-1.5 border border-slate-200 text-xs font-bold text-slate-600 shadow-2xs pointer-events-none">
          <Compass className="h-4 w-4 text-blue-600" />
          <span>Selat Malaka &amp; Pesisir Riau</span>
        </div>

        {/* Dynamic Zoom Wrapper */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 900 820"
            className="w-full h-auto max-h-[660px]"
            style={{ filter: 'drop-shadow(0 16px 30px rgba(43,48,86,0.15))' }}
          >
            <defs>
              {/* Tim Kerja 1: Ocean Azure Royal Blue (5 Wilayah) */}
              <linearGradient id="grad-tim-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>

              {/* Tim Kerja 2: Sunburst Warm Gold Amber (4 Wilayah) */}
              <linearGradient id="grad-tim-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Tim Kerja 3: Lush Emerald Jade Green (4 Wilayah) */}
              <linearGradient id="grad-tim-3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Active Region Glow Filters */}
              <filter id="regionHoverGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.4" />
              </filter>
              <filter id="regionSelectedGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1E2342" floodOpacity="0.8" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFD82B" floodOpacity="0.95" />
              </filter>
            </defs>

            {/* Render all 12 Kabupaten / Kota Regions */}
            {RIAU_REGIONS_GEO.map((geo) => {
              const w = wilayahMap.get(geo.id);
              const isSelected = selectedWilayahId === geo.id;
              const isHovered = hoveredWilayahId === geo.id;
              const fillId = getFillId(geo.id);

              const regData = w
                ? activeRegulasi === 'ranperda'
                  ? w.ranperda
                  : activeRegulasi === 'ranperkada'
                  ? w.ranperkada
                  : w.total
                : null;

              return (
                <g
                  key={geo.id}
                  className="cursor-pointer group transition-all duration-200"
                  onClick={() => onSelectWilayah(geo.id)}
                  onMouseMove={(e) => handleMouseMove(e, geo)}
                  onMouseLeave={handleMouseLeave}
                  tabIndex={0}
                  role="button"
                  aria-label={`${geo.name}: Rasio ${regData ? fmtPct(regData.rasio) : 0}%`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectWilayah(geo.id);
                    }
                  }}
                >
                  {/* Base Region Polygon Path */}
                  <path
                    d={geo.d}
                    fill={fillId}
                    stroke={isSelected ? '#FFD82B' : isHovered ? '#FFFFFF' : '#FFFFFF'}
                    strokeWidth={isSelected ? 3.8 : isHovered ? 2.6 : 1.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeOpacity={isSelected ? 1 : isHovered ? 0.98 : 0.85}
                    className="transition-all duration-300 ease-out"
                    style={{
                      filter: isSelected
                        ? 'url(#regionSelectedGlow)'
                        : isHovered
                        ? 'url(#regionHoverGlow)'
                        : undefined,
                      transform: isSelected ? 'scale(1.008)' : undefined,
                      transformOrigin: `${geo.labelX}px ${geo.labelY}px`,
                    }}
                  />

                  {/* Modern Glass Center Label Badge */}
                  <g
                    transform={`translate(${geo.labelX}, ${geo.labelY})`}
                    className="pointer-events-none select-none"
                  >
                    {/* Outer Pill Container */}
                    <rect
                      x="-48"
                      y="-16"
                      width="96"
                      height="32"
                      rx="10"
                      fill={isSelected ? '#1E2342' : isHovered ? '#2B3056' : 'rgba(255, 255, 255, 0.96)'}
                      stroke={isSelected ? '#FFD82B' : isHovered ? '#94A3B8' : 'rgba(203, 213, 225, 0.95)'}
                      strokeWidth={isSelected ? '2.2' : '1.2'}
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.16))',
                      }}
                      className="transition-all duration-200"
                    />

                    {/* Region Short Name */}
                    <text
                      x="0"
                      y="-3.5"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isSelected || isHovered ? '#FFFFFF' : '#0F172A'}
                      fontSize="9.8"
                      fontWeight="800"
                      letterSpacing="-0.2px"
                    >
                      {geo.shortName}
                    </text>

                    {/* Percentage Indicator */}
                    <text
                      x="0"
                      y="8"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={
                        isSelected
                          ? '#FFD82B'
                          : isHovered
                          ? '#93C5FD'
                          : regData?.surplus
                          ? '#059669'
                          : '#334155'
                      }
                      fontSize="8.8"
                      fontWeight="900"
                      fontFamily="monospace"
                    >
                      {regData ? `${fmtPct(regData.rasio)}%` : '0%'}
                      {regData?.surplus ? ' ★' : ''}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* =========================================================================
            FLOATING CURSOR TOOLTIP (ACTIVE ON HOVER)
            ========================================================================= */}
        {tooltipPos.visible && activeWilayah && (
          <div
            className="pointer-events-none absolute z-40 w-72 -translate-x-1/2 -translate-y-full transform pb-3 transition-all duration-75"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md space-y-2.5 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
              {/* Header: Name & Group */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="min-w-0">
                  <h5 className="text-xs font-black text-[#2B3056] leading-tight truncate">
                    {activeWilayah.nama_kabupaten}
                  </h5>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {activeWilayah.tim_kerja_nama} • {activeWilayah.kelompok}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono shrink-0 ${
                    (activeRegulasi === 'ranperda'
                      ? activeWilayah.ranperda.surplus
                      : activeRegulasi === 'ranperkada'
                      ? activeWilayah.ranperkada.surplus
                      : activeWilayah.total.surplus)
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  Rasio{' '}
                  {fmtPct(
                    activeRegulasi === 'ranperda'
                      ? activeWilayah.ranperda.rasio
                      : activeRegulasi === 'ranperkada'
                      ? activeWilayah.ranperkada.rasio
                      : activeWilayah.total.rasio
                  )}
                  %
                </span>
              </div>

              {/* Dynamic Stats for Current Regulation Mode */}
              {(() => {
                const reg =
                  activeRegulasi === 'ranperda'
                    ? activeWilayah.ranperda
                    : activeRegulasi === 'ranperkada'
                    ? activeWilayah.ranperkada
                    : activeWilayah.total;

                return (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {isLive ? 'Permohonan' : 'Target Rencana'}
                        </span>
                        <span className="text-sm font-black font-mono text-[#2B3056]">
                          {reg.rencana}
                        </span>
                      </div>
                      <div className="rounded-lg bg-amber-50/70 p-2 border border-amber-100">
                        <span className="text-[10px] font-bold text-amber-800 block">
                          Harmonisasi Selesai
                        </span>
                        <span className="text-sm font-black font-mono text-amber-950">
                          {reg.harmonisasi}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar in Tooltip (Solid Yellow) */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            reg.surplus
                              ? 'bg-emerald-500'
                              : 'bg-[#FFD82B]'
                          }`}
                          style={{ width: `${Math.min(reg.rasio, 100)}%` }}
                        />
                      </div>
                    </div>

                    {reg.surplus && (
                      <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Sparkles className="h-3 w-3 text-emerald-600" />
                        <span>+{reg.surplus_selisih} regulasi di atas rencana</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              <p className="text-[10px] text-slate-400 font-medium text-center pt-1 border-t border-slate-100">
                Klik wilayah untuk mengunci rincian
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            BOTTOM MAP LEGEND: PEMBAGIAN ZONA TIM KERJA KANWIL
            ========================================================================= */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2.5 border border-slate-200 text-xs font-bold text-slate-700 shadow-md max-w-[94%]">
          <span className="text-[11px] font-black text-[#2B3056] uppercase tracking-wider shrink-0">
            Zona Tim Kerja Kanwil:
          </span>

          <div className="flex flex-wrap items-center gap-4">
            {/* Tim 1 */}
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-sm bg-gradient-to-br from-blue-400 to-blue-700 shadow-2xs" />
              <span className="text-[11px] text-slate-800">
                <strong className="text-blue-900 font-black">Tim Kerja 1</strong>
              </span>
            </div>

            {/* Tim 2 */}
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-sm bg-gradient-to-br from-amber-300 to-amber-600 shadow-2xs" />
              <span className="text-[11px] text-slate-800">
                <strong className="text-amber-950 font-black">Tim Kerja 2</strong>
              </span>
            </div>

            {/* Tim 3 */}
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-sm bg-gradient-to-br from-emerald-300 to-emerald-600 shadow-2xs" />
              <span className="text-[11px] text-slate-800">
                <strong className="text-emerald-950 font-black">Tim Kerja 3</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          QUICK REGION SELECTOR CHIPS (COVERS ALL 13 ENTITIES)
          ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-[#2B3056] font-black">
            <Layers className="h-3.5 w-3.5 text-[#FFC800]" />
            Daftar Lengkap 13 Wilayah di Riau:
          </span>
          <span className="text-[11px] text-slate-400">
            {wilayahList.length} Entitas Terdaftar
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          {wilayahList.map((w) => {
            const isSelected = selectedWilayahId === w.kabupaten_id;
            const regData =
              activeRegulasi === 'ranperda'
                ? w.ranperda
                : activeRegulasi === 'ranperkada'
                ? w.ranperkada
                : w.total;

            const timId = Number(w.tim_kerja_id) || 1;

            return (
              <button
                key={w.kabupaten_id}
                type="button"
                onClick={() => onSelectWilayah(w.kabupaten_id)}
                onMouseEnter={() => setHoveredWilayahId(w.kabupaten_id)}
                onMouseLeave={() => setHoveredWilayahId(null)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#2B3056] text-[#FFD82B] shadow-xs ring-2 ring-[#2B3056]/20 font-black'
                    : w.kelompok === 'Provinsi'
                    ? 'bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-700 hover:bg-slate-100 hover:text-[#2B3056]'
                }`}
              >
                {/* Tim Kerja Color Dot */}
                <span
                  className={`h-2 w-2 rounded-full ${
                    timId === 1 ? 'bg-blue-600' : timId === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  title={`Zona Tim Kerja ${timId}`}
                />
                <span>{w.nama_singkat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : regData?.surplus
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {fmtPct(regData?.rasio)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RiauMapVisualization;
