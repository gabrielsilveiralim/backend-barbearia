import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schemas/index";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Confira o arquivo .env");
}

const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });