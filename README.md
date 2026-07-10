# EscapeWeb (EG Company)

웹 기반 방탈출 게임 사이트입니다. 겉보기에는 "EG Company"라는 가상의 기업 웹사이트(회사소개, 규정, 뉴스, 채용, 문의 등)이지만, 회원가입 후 사이트 곳곳의 단서를 따라가면 사내 보안 시스템을 해킹하는 터미널 ARG(Alternate Reality Game)로 이어지는 구조입니다.

플레이어는 회사 웹사이트를 둘러보며 규정 페이지에 숨겨진 서명 테스트를 통과하고, 보안 터미널에 접속해 PIN 조합, 3D 큐브 조작, 손상된 명령어 복구, 커서 반응형 텍스트 퍼즐(pretext) 등 순차적인 챌린지를 풀어나가며 이야기를 진행합니다.

## 프로젝트 성격

- 표면 콘텐츠: 기업 웹사이트 형태의 정적/동적 페이지(회사소개, 규정, 뉴스, 부서 소개, HR, 문의)
- 핵심 게임플레이: `portals/security/terminal` 경로의 터미널 UI에서 진행되는 순차형 퍼즐 체인
  - PIN 조합 선택(pin-select)
  - 3D 큐브 홀드 조작(cube-hold, react-three-fiber 기반)
  - 손상된 명령어 복구(corrupted-command)
  - 커서 반응형 은닉 텍스트 찾기(pretext-ending)
- 진행도는 계정(로그인 세션) 단위로 서버에 저장되며, 같은 브라우저에서 다른 계정으로 로그인하면 진행도가 항상 초기 상태로 리셋됩니다. 브라우저 단위 저장(localStorage)에 의존하지 않습니다.

## 기술 스택

프레임워크 / 언어

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4

데이터 / 백엔드

- Prisma 7, `@prisma/adapter-libsql` 드라이버 어댑터 경유로 Turso(libSQL) 원격 DB에 연결
- Zod로 입력 검증
- 인증은 next-auth 등 외부 라이브러리 없이 자체 구현: httpOnly 쿠키에 랜덤 토큰을 저장하고 `Session` 테이블에서 조회하는 방식(`src/lib/auth/session.ts`)

3D / 인터랙션

- three.js, `@react-three/fiber`, `@react-three/drei` — 터미널의 3D 큐브 퍼즐
- `@chenglou/pretext` — pretext 챌린지의 커서 반응형 텍스트 레이아웃
- GSAP, Framer Motion — 일부 UI 애니메이션

기타

- nodemailer(Gmail SMTP) / resend — 사원증 발송 등 이메일 기능
- qrcode — QR 코드 생성
- sharp — 이미지 처리(아이콘 생성 등)
- Vercel Analytics, Vercel Speed Insights

배포 / 인프라

- Vercel에 배포(`escapeweb.vercel.app`)
- 데이터베이스는 Turso(libSQL)의 원격 인스턴스를 사용하며, 로컬 개발 시에도 기본적으로 원격 DB에 접속하도록 설정되어 있음(`prisma/dev.db` 파일 DB는 `DATABASE_URL`이 없을 때의 fallback)

## 프로젝트 구조

```
src/
  app/
    (auth)/            로그인, 회원가입
    (corporate)/       회사소개, 규정, 뉴스, 부서, HR, 문의 등 표면 웹사이트 페이지
    (game)/            범용 방탈출 템플릿(Room/Puzzle 모델 기반). 현재 서비스에서는 사용되지 않는 잔존 코드
    portals/
      security/terminal/  실제 게임 본체인 보안 터미널 UI와 챌린지 로직
      [dept]/             부서별 포털 상세 페이지
    api/               서버 라우트(인증, 터미널 진행도, 힌트 등)
  components/          공용 UI 컴포넌트(레이아웃, 퍼즐 모달 등)
  lib/                 도메인 로직, 데이터 상수, 인증, 이메일, i18n 등
  hooks/               클라이언트 훅(언어 설정 등)
  theme/               라이트/다크 테마 토큰 및 클래스 매핑
  store/               zustand 스토어(범용 방탈출 템플릿용)
prisma/
  schema.prisma        DB 스키마
  migrations/          마이그레이션 이력
```

Next.js 라우트 그룹 중 `(game)`과 그에 딸린 `Room`/`Puzzle`/`Progress` Prisma 모델은 이 프로젝트 초기에 만들어진 범용 방탈출 템플릿의 잔존 코드로, 실제 서비스되는 게임(터미널 ARG)과는 무관합니다. 삭제하지 않고 남아 있을 뿐 현재 플레이 경로에서는 도달하지 않습니다.

## 데이터베이스

주요 모델(`prisma/schema.prisma`):

- `User` / `Session` — 계정과 로그인 세션
- `TerminalState` — 계정별 터미널 진행도(현재 단계, 해금된 메일, 완료한 챌린지, 관리자 테스트 통과 여부). 로그인할 때마다 초기값으로 리셋됨
- `HintLog` — 힌트 사용 기록(외부에서 관리하는 테이블과 매핑, 이 프로젝트 코드에서 직접 생성하지 않음)
- `Room` / `Puzzle` / `Progress` — 앞서 설명한 미사용 범용 템플릿용 모델

Turso(libSQL)를 사용하기 때문에 Prisma CLI의 `migrate dev` / `migrate deploy` / `db push`가 `libsql://` 스킴을 직접 지원하지 않는 경우가 있습니다(P1013 오류). 이 경우 마이그레이션 SQL을 직접 작성한 뒤 `@libsql/client`로 실행해야 합니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

빌드:

```bash
pnpm build
pnpm start
```

`pnpm build`는 `prisma generate`를 먼저 실행한 뒤 `next build`를 수행합니다.

## 환경 변수

`.env.local`에 다음 값이 필요합니다.

```
DATABASE_URL=            # Turso(libSQL) 접속 URL, 예: libsql://...
TURSO_AUTH_TOKEN=        # Turso 인증 토큰
GMAIL_USER=               # 사원증 발송 등에 사용하는 Gmail 계정
GMAIL_APP_PASSWORD=       # 위 계정의 앱 비밀번호
NEXT_PUBLIC_SITE_URL=     # 배포된 사이트의 절대 URL
```

`DATABASE_URL`이 없으면 로컬 `prisma/dev.db` 파일을 사용하도록 fallback 처리되어 있지만, 이 프로젝트는 기본적으로 원격 Turso DB를 기준으로 개발되어 왔습니다.

## 다국어 지원

한국어/영어를 지원합니다. 번역 문자열은 `src/lib/i18n.ts`에 하나의 사전으로 관리되며, `useLanguage()` 훅으로 현재 언어를, `t(key, lang)` 함수로 번역 문자열을 가져옵니다. 언어 선택값은 `localStorage`에 저장되고, 사이트 전역이 아니라 일부 페이지(회사소개, 규정, 문의, 뉴스, HR, 터미널 일부 등)에 한해 적용되어 있습니다.

## 테마

라이트/다크/시스템 설정 세 가지 모드를 지원합니다. 테마 토큰은 `src/theme/tokens.css`에 CSS 커스텀 프로퍼티로 정의되어 있고, `html` 엘리먼트의 `light-mode`/`dark-mode`/`system-mode` 클래스로 전환됩니다. 일부 페이지는 Tailwind 색상 유틸리티(`bg-gray-100` 등)를 직접 사용하고 있어, `globals.css`에 다크모드 전용 오버라이드 규칙을 별도로 두고 있습니다.
