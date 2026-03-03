import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export const getDb = async () => {
    const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
    return drizzle(env.portfolio_db, { schema });
};
