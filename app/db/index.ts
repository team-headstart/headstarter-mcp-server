import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Logger } from "@/app/utils/logger";
import { env } from "@/app/config/env";

const logger = new Logger("db");

// Initialize Neon client with connection string
const sql = neon(env.DATABASE_URL);

// Initialize Drizzle with Neon client
export const db = drizzle(sql);

logger.info("Database connection initialized");

// Export all schema objects
export * from "./hs-linkedin-network.sql";
