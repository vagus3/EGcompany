# EG Company — Design Reference

AI가 컴포넌트를 작성하거나 수정할 때 이 문서를 기준으로 삼는다.
**실제 토큰 정의**: `src/theme/tokens.css` · `src/theme/classes.ts`
**실제 예시 코드**: `src/components/layout/Navbar.tsx`, `src/app/(corporate)/page.tsx`

---

## 1. 어떤 테마를 쓸지 먼저 결정한다

| 만들고 있는 것 | 사용 테마 |
|---------------|-----------|
| 홈, 뉴스, 로그인, 회원가입, 회사 소개 등 corporate 계열 페이지 | **corporate** |
| `/portals/security/terminal` 하위 게임 페이지 | **terminal** |

```
src/app/(corporate)/   → corporate 테마
src/app/(auth)/        → corporate 테마
src/app/portals/       → terminal 테마
```

---

## 2. 절대 하지 말 것 (Anti-patterns)

```tsx
// ❌ 브라우저 기본 select 사용 금지
<select>...</select>

// ✅ 대신 커스텀 드롭다운 패턴 사용 (아래 §6 참고)
```

```tsx
// ❌ 색상 하드코딩 금지 (corporate 페이지)
<div className="bg-white text-gray-900 border-gray-200">

// ✅ theme 토큰 사용
const { classes: theme } = useCorporateTheme();
<div className={cx(theme.surface, theme.text, theme.border)}>
```

```tsx
// ❌ terminal 페이지에서 corporate 토큰 사용 금지
<div className="bg-corporate-surface">

// ✅ terminal 토큰 사용
<div className="bg-terminal-panel">
```

```tsx
// ❌ corporate 페이지에서 색상 하드코딩
<p className="text-[#737373]">

// ✅ 시맨틱 토큰 사용
<p className={theme.textMuted}>
```

```tsx
// ❌ font-mono를 본문 텍스트에 사용
<p className="font-mono text-base">본문 내용...</p>

// ✅ font-mono는 레이블, 배지, 상태값, 코드에만
<p className="font-mono text-[10px] tracking-[0.18em] uppercase">LABEL</p>
```

---

## 3. Corporate 테마 — 토큰 & 클래스

### 3-1. 훅 및 임포트

```tsx
import { cx } from "@/theme/classes";
import { useCorporateTheme } from "@/theme/ThemeProvider";

const { classes: theme } = useCorporateTheme();
```

### 3-2. theme 객체 전체 참조

```ts
theme.page          → "bg-corporate-bg text-corporate-text"
theme.surface       → "bg-corporate-surface"
theme.surfaceMuted  → "bg-corporate-surface-muted"   // 호버 배경, 선택된 아이템
theme.surfaceSubtle → "bg-corporate-surface-subtle"  // 구분 배경
theme.border        → "border-corporate-border"
theme.borderStrong  → "border-corporate-border-strong"
theme.text          → "text-corporate-text"
theme.textMuted     → "text-corporate-text-muted"    // 보조 텍스트
theme.textSubtle    → "text-corporate-text-subtle"   // 푸터, 힌트
theme.linkMuted     → "text-corporate-text-muted transition-colors hover:text-corporate-text"
theme.buttonPrimary → "bg-corporate-text text-corporate-bg transition-colors hover:bg-corporate-text-muted"
theme.input         → "border-corporate-border bg-corporate-surface-muted text-corporate-text placeholder:text-corporate-text-subtle focus:border-corporate-border-strong focus:outline-none"
```

### 3-3. 색상 값 참조 (light 기준)

| 토큰 | Light | Dark |
|------|-------|------|
| `corporate-bg` | `#ffffff` | `#0a0a0a` |
| `corporate-surface` | `#ffffff` | `#111111` |
| `corporate-surface-muted` | `#f7f7f6` | `#171717` |
| `corporate-text` | `#111111` | `#ededed` |
| `corporate-text-muted` | `#737373` | `#a3a3a3` |
| `corporate-text-subtle` | `#a3a3a3` | `#737373` |
| `corporate-border` | `#e5e5e5` | `#262626` |
| `corporate-border-strong` | `#111111` | `#ededed` |

---

## 4. Terminal 테마 — 토큰

Terminal 테마는 항상 Dark (color-scheme 고정). `theme.*` 객체 없이 Tailwind 클래스를 직접 쓴다.

```tsx
import { cx, terminalTheme } from "@/theme/classes";

// 페이지 루트에 적용
<main className={cx("...", terminalTheme.page)}>
```

### 4-1. 자주 쓰는 클래스

```
배경:   bg-terminal-bg (#050505)  bg-terminal-panel (#0b0b0b)  bg-terminal-tile (#181818)
테두리: border-terminal-border (#202020)  border-terminal-border-warm (#604844)
텍스트: text-terminal-text (#f2f0ec)  text-terminal-text-muted (#94a3b8)  text-terminal-text-dim (#64748b)
복사:   text-terminal-copy (#d6c8c2)  text-terminal-copy-strong (#d8d2ce)
강조:   text-terminal-accent (#b00000)  bg-terminal-accent-strong (#9d0000)
강조텍: text-terminal-accent-text (#ffc0b8)  text-terminal-accent-muted (#e5aaa0)
```

---

## 5. 폰트 & 타이포그래피

**폰트**: Geist (sans) / Geist Mono (mono) — 두 가지만 쓴다.

### 크기 패턴

| 용도 | 클래스 |
|------|--------|
| 페이지 대제목 | `text-[clamp(3.4rem,13vw,9.5rem)] font-black leading-none` |
| 섹션 제목 | `text-[clamp(2.2rem,6vw,4.8rem)] font-black leading-none` |
| 카드 제목 | `text-2xl font-black` |
| 본문 | `text-sm leading-6` / `text-xs leading-5` |
| 모노 레이블 (corporate) | `font-mono text-[9px] tracking-[0.18em] uppercase` |
| 모노 레이블 (terminal) | `font-mono text-[10px] font-black tracking-[0.22em~0.42em]` |
| 모노 배지/상태 | `font-mono text-[10px] font-black tracking-[0.12em]` |

`font-mono`는 레이블·배지·상태·코드에만. 본문(prose)에는 쓰지 않는다.

---

## 6. 컴포넌트 패턴 — 복붙 가능한 코드

### 6-1. 커스텀 드롭다운 (Corporate)

실제 구현: `src/components/layout/Navbar.tsx` → `HeaderControls`

```tsx
// 상태 및 ref
const [menuOpen, setMenuOpen] = useState(false);
const menuRef = useRef<HTMLDivElement>(null);

// 외부 클릭 닫기
useEffect(() => {
  function handlePointerDown(e: PointerEvent) {
    if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  }
  window.addEventListener("pointerdown", handlePointerDown);
  return () => window.removeEventListener("pointerdown", handlePointerDown);
}, []);

// JSX
<div className="relative" ref={menuRef}>
  {/* 트리거 버튼 */}
  <button
    type="button"
    onClick={() => setMenuOpen((o) => !o)}
    className={cx(
      "flex items-center gap-1.5 border px-2 py-1.5 text-[11px] font-bold",
      theme.border, theme.textMuted
    )}
    aria-expanded={menuOpen}
    aria-haspopup="menu"
  >
    <Icon className="h-3.5 w-3.5" />
    <span>{currentLabel}</span>
    <ChevronDown className={cx("h-3.5 w-3.5 transition-transform", menuOpen && "rotate-180")} />
  </button>

  {/* 드롭다운 패널 — w-full로 트리거 버튼과 동일한 너비 */}
  {menuOpen && (
    <div
      className={cx(
        "bg-corporate-surface absolute top-[calc(100%+4px)] right-0 z-20 w-full border shadow-lg",
        theme.border
      )}
      role="menu"
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => { onSelect(option.value); setMenuOpen(false); }}
          className={cx(
            "hover:bg-corporate-surface-muted flex w-full items-center gap-3 px-4 py-3 text-left text-[11px] font-bold transition-colors",
            theme.textMuted,
            option.value === current && theme.surfaceMuted
          )}
          role="menuitemradio"
          aria-checked={option.value === current}
        >
          <option.icon className="h-4 w-4" /> {/* 아이콘 없으면 생략 */}
          {option.label}
          {/* check 아이콘 사용하지 않음 — 선택 상태는 surfaceMuted 배경으로 표시 */}
        </button>
      ))}
    </div>
  )}
</div>
```

### 6-2. 버튼

```tsx
// Primary (반전 — 배경 검정, 텍스트 흰색)
<button className={cx("px-4 py-2 text-sm font-black", theme.buttonPrimary)}>

// 텍스트 링크 스타일
<button className={cx("px-2 py-1.5 text-sm font-semibold", theme.linkMuted)}>

// Terminal 강조 버튼
<button className="bg-terminal-accent-strong hover:bg-terminal-accent-active px-5 py-3 font-mono text-[10px] font-black tracking-[0.2em] text-white transition-colors">
```

### 6-3. 카드

```tsx
// Corporate 카드
<article className={cx("border p-6", theme.border, theme.surface)}>

// Corporate 이미지 카드 (배경 이미지 + 텍스트 오버레이)
<article className="relative min-h-72 overflow-hidden border border-corporate-border bg-black text-white">
  <div className="absolute inset-0" style={imageStyle} />
  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/70 to-transparent p-5">
    <p className="text-2xl font-black uppercase">제목</p>
  </div>
</article>

// Terminal 카드
<article className="border border-terminal-border bg-terminal-panel p-6">
```

### 6-4. 인풋 (Corporate)

```tsx
<input
  className={cx("w-full border px-4 py-3 text-sm", theme.input)}
  placeholder="..."
/>
```

### 6-5. 섹션 헤더 (Corporate)

```tsx
// 하단 구분선 있는 버전
<div className="border-b border-corporate-border pb-4">
  <h2 className="text-[clamp(2.2rem,6vw,4.8rem)] leading-none font-black tracking-normal uppercase">
    제목
  </h2>
</div>
```

### 6-6. Terminal 완료 / 대기 패널

```tsx
import { CompletedPanel, QueuedPanel } from "../ui/TerminalPanels";

<CompletedPanel label="LABEL_UPPERCASE" />   // 완료 상태
<QueuedPanel label="NEXT_SECTION_LOCKED" />  // 잠금 상태
```

---

## 7. 레이아웃 & 파일 구조

### Corporate 페이지 추가 시

1. `src/app/(corporate)/새페이지/page.tsx` 생성
2. `src/app/(corporate)/layout.tsx`가 `CorporateShell`을 자동 적용 — 추가 작업 없음
3. 페이지 안에서 `useLanguage()` + `t(key, lang)` 사용

```tsx
// 최소 Corporate 페이지 템플릿
"use client";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { cx } from "@/theme/classes";
import { useCorporateTheme } from "@/theme/ThemeProvider";

export default function Page() {
  const lang = useLanguage();
  const { classes: theme } = useCorporateTheme();

  return (
    <div className={cx("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20", theme.text)}>
      {/* 콘텐츠 */}
    </div>
  );
}
```

### Terminal 페이지 구조

```
src/app/portals/security/terminal/
  TerminalClient.tsx          ← 상태 관리, 이벤트 핸들러, 레이아웃 오케스트레이터
  TerminalSidebar.tsx         ← 사이드 네브 (Section 타입 export)
  EndingFlow.tsx              ← 엔딩 영상, QR 페이지, EmployeeCardDelivery 타입
  sections/
    ArchiveSection.tsx        ← WESEN 아카이브 목록 + 상세
    MessengerSection.tsx      ← 메일 목록 + 상세 + 챌린지 렌더링
    ContainmentSection.tsx    ← 격리 로그
  challenges/
    PinSelectChallenge.tsx    ← 핀 선택 문제
    CorruptedCommandChallenge.tsx ← 명령어 입력 문제
    PretextChallenge.tsx      ← Pretext 풀스크린 링크
  ui/
    TerminalPanels.tsx        ← CompletedPanel, QueuedPanel (공유 UI)
```

### 섹션 여백 & 너비 기준

```
Corporate 페이지 콘텐츠 최대 너비: max-w-6xl mx-auto
Corporate 섹션 패딩:               px-4 py-16 sm:px-6 sm:py-20
Corporate 섹션 구분:               border-b border-corporate-border
Terminal 콘텐츠 최대 너비:         max-w-920px mx-auto (상세) / 제한 없음 (전체)
```

---

## 8. 다국어 (i18n)

- 모든 사용자 노출 텍스트는 `t(key, lang)` 사용 — 하드코딩 금지
- 키는 `src/lib/i18n.ts`에 추가
- 언어 상태: `localStorage("eg-language")` = `"ko"` | `"en"`

```tsx
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

const lang = useLanguage();
<p>{t("section_title", lang)}</p>
```

> Terminal 게임 내부 텍스트(메일 본문, WESEN 데이터 등)는 `src/lib/terminal-data.ts`에 직접 작성. i18n 불필요.

---

## 9. 핵심 파일 위치

| 파일 | 역할 |
|------|------|
| `src/theme/tokens.css` | CSS 변수 정의 (모든 색상 원천) |
| `src/theme/classes.ts` | `corporateTheme`, `terminalTheme` 객체, `cx()` 유틸 |
| `src/theme/ThemeProvider.tsx` | `ThemeProvider`, `useCorporateTheme`, `ThemedFrame` |
| `src/lib/i18n.ts` | 다국어 키-값 및 `t()` 함수 |
| `src/lib/terminal-data.ts` | WESEN 데이터, 메일 데이터, 게임 진행 타입 |
| `src/components/layout/Navbar.tsx` | 드롭다운 패턴 레퍼런스 구현 |
| `src/app/globals.css` | Tailwind 토큰 연결, 터미널 애니메이션 CSS |
