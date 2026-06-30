import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve("."),
  },
  // 서버리스 함수 빌드 시 fs로 직접 읽는 사원증 템플릿/폰트 파일이
  // standalone 출력에서 누락되지 않도록 명시적으로 포함시킨다.
  outputFileTracingIncludes: {
    "/api/terminal/completion": ["./public/employee_card/**/*", "./src/lib/fonts/**/*"],
  },
};

export default nextConfig;
