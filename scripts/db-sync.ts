import "dotenv/config"; // ✅ Self-executing dotenv import to resolve ESM hoisting

import { sequelize } from "../lib/db";
import "../models/User"; // Import models so they are registered with Sequelize

async function syncDatabase() {
  console.log("🔄 Syncing database schema with models...");
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database schema synced successfully with all models!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to sync database schema:", error);
    process.exit(1);
  }
}

syncDatabase();
