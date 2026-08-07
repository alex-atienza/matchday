export default function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="glyphs">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="#f5f7f4" />
          <rect x="5" y="5" width="3" height="7" rx="1" fill="#f5f7f4" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" fill="#f5f7f4" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="#f5f7f4" opacity="0.4" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" fill="none" stroke="#f5f7f4" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1 4.5a11 11 0 0 1 14 0" />
          <path d="M3.5 7a7 7 0 0 1 9 0" />
          <path d="M6 9.5a3 3 0 0 1 4 0" />
        </svg>
        {/* battery */}
        <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3" fill="none" stroke="#f5f7f4" strokeOpacity="0.5" />
          <rect x="2" y="2" width="15" height="8" rx="1.5" fill="#f5f7f4" />
          <rect x="22" y="4" width="1.5" height="4" rx="0.75" fill="#f5f7f4" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}
