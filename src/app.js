import conexao from "../infra/conexao.js";
import express from "express";
import cors from "cors";
import path from "path";

export const app = express();
app.use(cors());

// Configuração para servir arquivos estáticos da pasta imgs/imsPods
app.use("/images", express.static(path.resolve("imgs/imsPods")));

// Rota para exibir "Ok" e listar imagens no index
app.get("/", (req, res) => {
  const sql = "SELECT imagem FROM atacado;";

  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      res.status(500).json({ erro: "Erro ao buscar imagens." });
    } else {
      res.status(200);
    }
  });
});

// Rota para listar todos os dados de atacado
app.get("/atacado", (req, res) => {
  const sql = "SELECT * FROM atacado;";

  conexao.query(sql, (erro, resultado) => {
    if (erro) {
      res.status(404).json({ erro: erro });
    } else {
      res.status(200).json(resultado);
    }
  });
});

// Rota para líquidos (vazia por enquanto)
app.get("/liquidos", (req, res) => {
  res.status(200).send();
});

const PORT = 3000;
app.listen(PORT, () => console.log("servidor rodando"));
