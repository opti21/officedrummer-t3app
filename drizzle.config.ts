import { type Config } from "drizzle-kit";
import "dotenv/config";
import { env } from "~/env.mjs";


export default {
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db",
  driver: "mysql2",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["officedrummer_*"],
} satisfies Config;
