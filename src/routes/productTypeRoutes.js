import express from "express";
import conexao from "../../infra/conexao.js";
import { executarConsulta } from "../controllers/executConsulta.js";

const router = express.Router();

// Rota para listar todos os produtos
router.get("/products", (req, res) => {
    const sql = "SELECT * FROM atacado;";
    executarConsulta(sql, res);
  });

// Rota para listar produtos por tipo
router.get("/:tipo", (req, res) => {
  const { tipo } = req.params;
  const page = parseInt(req.query.page) || 1; // Página atual, padrão 1
  const limit = parseInt(req.query.limit) || 10; // Itens por página, padrão 10
  const offset = (page - 1) * limit; // Calcular o deslocamento

  // Tipos permitidos
  const tiposPermitidos = ["atacado", "liquido", "vendidos"];
  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({ erro: "Tipo inválido." });
  }

  // Consultas ao banco
  const sqlCount = `SELECT COUNT(*) AS total FROM atacado WHERE tipo = '${tipo}';`;
  const sqlQuery = `SELECT * FROM atacado WHERE tipo = '${tipo}' LIMIT ${limit} OFFSET ${offset};`;

  // Consultar o total de registros do tipo
  conexao.query(sqlCount, (erroContagem, resultadosContagem) => {
    if (erroContagem) {
      return res.status(500).json({ erro: "Erro ao contar produtos." });
    }

    const totalProdutos = resultadosContagem[0].total;

    // Consultar os produtos paginados
    conexao.query(sqlQuery, (erroConsulta, resultadosConsulta) => {
      if (erroConsulta) {
        return res.status(500).json({ erro: "Erro ao buscar produtos." });
      }

      // Formatar os resultados
      const produtos = resultadosConsulta.map((produto) => ({
        ...produto,
        imagem: produto.imagem ? JSON.parse(produto.imagem) : [],
        sabores: produto.sabores ? JSON.parse(produto.sabores) : [],
      }));

      // Retornar os dados paginados
      res.status(200).json({
        totalProdutos,
        totalPaginas: Math.ceil(totalProdutos / limit),
        paginaAtual: page,
        produtos,
      });
    });
  });
});
export default router;
