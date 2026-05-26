function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 text-[10px] tracking-widest text-gray-400 uppercase">{label}</p>
      <p className="border-l-2 border-black pl-3 text-base leading-snug font-semibold text-black">
        {value}
      </p>
    </div>
  );
}

function HQMap() {
  return (
    <svg viewBox="0 0 370 120" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {/* Background */}
      <rect width="370" height="120" fill="#f0eeeb" />

      {/* Grid streets — horizontal */}
      {[15, 30, 45, 60, 75, 90, 105].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="370" y2={y} stroke="#ddd" strokeWidth="0.6" />
      ))}
      {/* Grid streets — vertical */}
      {[25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="120" stroke="#ddd" strokeWidth="0.6" />
      ))}

      {/* Main roads */}
      <line x1="0" y1="60" x2="370" y2="60" stroke="#ccc" strokeWidth="2.5" />
      <line x1="185" y1="0" x2="185" y2="120" stroke="#ccc" strokeWidth="2.5" />

      {/* Blocks */}
      <rect x="52" y="32" width="46" height="26" fill="#e0ddd8" rx="1" />
      <rect x="107" y="18" width="66" height="38" fill="#e0ddd8" rx="1" />
      <rect x="200" y="25" width="36" height="30" fill="#e0ddd8" rx="1" />
      <rect x="247" y="32" width="58" height="24" fill="#e0ddd8" rx="1" />
      <rect x="52" y="67" width="46" height="28" fill="#e0ddd8" rx="1" />
      <rect x="107" y="67" width="35" height="32" fill="#e0ddd8" rx="1" />
      <rect x="200" y="67" width="55" height="28" fill="#e0ddd8" rx="1" />
      <rect x="265" y="67" width="40" height="32" fill="#e0ddd8" rx="1" />

      {/* Pin */}
      <circle cx="185" cy="52" r="5" fill="black" />
      <line x1="185" y1="52" x2="185" y2="60" stroke="black" strokeWidth="1.5" />

      {/* Label box */}
      <rect
        x="153"
        y="62"
        width="64"
        height="16"
        fill="white"
        stroke="#bbb"
        strokeWidth="0.8"
        rx="2"
      />
      <text
        x="185"
        y="73"
        textAnchor="middle"
        fontSize="6.5"
        fill="#333"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.5"
      >
        HQ TOWER E
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Heading */}
        <h1 className="mb-12 text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-black">
          Company Information
        </h1>

        {/* Card */}
        <div className="border border-gray-200 bg-white p-5 sm:p-8 lg:p-10">
          <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] lg:gap-10">
            {/* Left: building image */}
            <div className="bg-gradient-linear-to-b aspect-3/4 shrink-0 overflow-hidden from-gray-700 via-gray-800 to-gray-950">
              {/* public/images/hq-night.jpg 로 교체 가능 */}
              <div className="h-full w-full" />
            </div>

            {/* Right: info fields */}
            <div className="space-y-7">
              {/* Row 1 */}
              <div className="grid gap-6 sm:grid-cols-2">
                <InfoField label="Company Name" value="EG Company" />
                <InfoField label="CEO" value="Director E.G." />
              </div>

              {/* Row 2 */}
              <InfoField label="Business Registration Number" value="123-45-67890" />

              {/* Row 3 */}
              <div className="grid gap-6 sm:grid-cols-2">
                <InfoField label="Phone" value="02-123-4567" />
                <InfoField label="Fax" value="02-123-4568" />
              </div>

              {/* Row 4 */}
              <InfoField label="Email" value="contact@egcompany.co.kr" />

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* Address */}
              <div>
                <p className="mb-2 text-[10px] tracking-widest text-gray-400 uppercase">Address</p>
                <p className="mb-4 text-sm text-black">
                  대한민국 서울 종로구 사랑국로 52, 이빌 빌딩 타워 E 44층
                </p>
                {/* Map */}
                <div className="overflow-hidden border border-gray-200">
                  <HQMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
