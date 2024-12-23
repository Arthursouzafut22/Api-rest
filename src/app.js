import conexao from "../infra/conexao.js";
import express from "express";
import cors from "cors";
import path from "path";

export const app = express();
app.use(cors());

// Configuração para servir arquivos estáticos
app.use("/images", express.static(path.resolve("imgs/imsPods")));

// Função genérica para processar consultas ao banco
const executarConsulta = (sql, res) => {
  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      res.status(500).json({ erro: "Erro ao realizar a consulta." });
    } else {
      const produtos = resultados.map((produto) => ({
        ...produto,
        imagem: produto.imagem ? JSON.parse(produto.imagem) : [],
        sabores: produto.sabores ? JSON.parse(produto.sabores) : [],
      }));
      res.status(200).json(produtos);
    }
  });
};

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
  const tiposPermitidos = ["atacado", "liquido", "vendidos"];

  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({ erro: "Tipo inválido." });
  }

  const sql = `SELECT * FROM atacado WHERE tipo = '${tipo}';`;
  executarConsulta(sql, res);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
