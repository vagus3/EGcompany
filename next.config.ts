import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve("."),
  },
  // sharp는 네이티브(libvips) 바이너리를 포함하는 패키지라 번들링하지 않고
  // node_modules에서 그대로 로드해야 한다. 번들링 시 .so 파일이 누락되어
  // "Could not load the sharp module using the linux-x64 runtime" 에러 발생.
  serverExternalPackages: ["sharp"],
  // 서버리스 함수 빌드 시 fs로 직접 읽는 사원증 템플릿/폰트 파일과,
  // serverExternalPackages만으로는 누락되는 sharp의 네이티브(.so) 바이너리를
  // 명시적으로 포함시킨다. pnpm-lock.yaml에 고정된 버전 기준 경로.
  outputFileTracingIncludes: {
    "/api/terminal/completion": [
      "./public/employee_card/**/*",
      "./src/lib/fonts/**/*",
      "./node_modules/.pnpm/@img+sharp-linux-x64@0.35.2/node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.3.1/node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
};

export default nextConfig;
