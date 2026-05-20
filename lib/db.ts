import pg from "pg";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set in environment variables");
}

export const sequelize = new Sequelize(databaseUrl || "", {
  dialect: "postgres",
  dialectModule: pg,
  logging: false, // Set to console.log to see SQL queries in the console
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // This is often needed for cloud hosted PostgreSQL like Supabase
    },
  },
});
