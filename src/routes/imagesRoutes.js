import express from "express";
import { executarConsulta } from "../controllers/executConsulta.js";

const router = express.Router();

// Rota para exibir imagens
router.get("/images", (req, res) => {
  const sql = "SELECT imagem FROM atacado;";
  executarConsulta(sql, res);
});

export default router;
