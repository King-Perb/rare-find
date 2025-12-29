
/**
 * Prisma 7 Configuration
 *
 * This file manages database connection and Prisma settings.
 * The DATABASE_URL is configured here instead of in schema.prisma.
 */

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_DIRECT_URL"),
  },
});
