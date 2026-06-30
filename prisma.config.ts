import path from "node:path";
import { defineConfig } from "prisma/config";

const dbUrl =
  process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "prisma", "dev.db")}`;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: dbUrl,
    // Turso(libSQL) 원격 DB 마이그레이션용 토큰. 로컬 file: URL에서는 무시됨.
    ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
  },
});
