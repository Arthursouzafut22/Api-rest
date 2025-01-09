import dotenv from "dotenv";
import conexao from "../infra/conexao.js";
import express from "express";
import cors from "cors";
import path from "path";
import { executarConsulta } from "./controllers/executConsulta.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
export const app = express();
app.use(express.json());
app.use(cors());
app.use(paymentRoutes);

// Configuração para servir arquivos estáticos
app.use("/images", express.static(path.resolve("imgs/imsPods")));

// Rota para exibir imagens
app.get("/images", (req, res) => {
  const sql = "SELECT imagem FROM atacado;";
  executarConsulta(sql, res);
});

// Rota para listar todos os produtos
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM atacado;";
  executarConsulta(sql, res);
});

// Rota para listar produtos por tipo
app.get("/:tipo", (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
