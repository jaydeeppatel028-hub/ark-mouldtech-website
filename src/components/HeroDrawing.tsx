/** Line drawing of an injection mould cross-section, used behind the hero text. */
export function HeroDrawing({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 440" fill="none" stroke="#FFFFFF" strokeWidth="1.4" aria-hidden="true">
      <rect x="60" y="30" width="480" height="40" />
      <rect x="90" y="70" width="420" height="90" />
      <rect x="90" y="160" width="420" height="90" />
      <rect x="90" y="250" width="420" height="34" />
      <rect x="90" y="284" width="44" height="84" />
      <rect x="466" y="284" width="44" height="84" />
      <rect x="160" y="304" width="280" height="22" />
      <rect x="160" y="326" width="280" height="22" />
      <rect x="60" y="368" width="480" height="40" />
      <path d="M200 130h200v60h-30v-30H230v30h-30z" fill="#FFFFFF" fillOpacity=".14" />
      <path d="M290 30v100M310 30v100" />
      <path d="M270 30l20 18h20l20-18" />
      <path d="M215 190v114M300 160v144M385 190v114" strokeDasharray="4 4" />
      <circle cx="140" cy="115" r="9" />
      <circle cx="460" cy="115" r="9" />
      <circle cx="140" cy="205" r="9" />
      <circle cx="460" cy="205" r="9" />
      <path d="M112 70v180M488 70v180" strokeDasharray="10 5" />
      <g strokeOpacity=".6" strokeWidth="1">
        <path d="M540 100h40M540 205h40M510 315h70" />
      </g>
      <g fill="#FFFFFF" stroke="none" fontFamily="Inter, Arial, sans-serif" fontSize="11" letterSpacing="1.2" fillOpacity=".85">
        <text x="548" y="94">CAVITY</text>
        <text x="548" y="199">CORE</text>
        <text x="516" y="309">EJECTOR</text>
        <text x="152" y="138">COOLING</text>
      </g>
    </svg>
  );
}
