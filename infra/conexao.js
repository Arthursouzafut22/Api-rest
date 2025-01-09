import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const conexao = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORTDB,
  user: process.env.ROOT,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export default conexao;
