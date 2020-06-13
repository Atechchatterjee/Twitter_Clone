import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db_database: string =
  process.env.DB_DATABASE === undefined ? "" : process.env.DB_DATABASE;
const db_username: string =
  process.env.DB_USERNAME === undefined ? "" : process.env.DB_USERNAME;
const db_password: string =
  process.env.DB_PASSWORD === undefined ? "" : process.env.DB_PASSWORD;

const sequelize = new Sequelize(db_database, db_username, db_password, {
  dialect: "mysql",
});

const models = {
  Users: sequelize.import("./user"),
  Follows: sequelize.import("./follows"),
};

export default sequelize.models;
