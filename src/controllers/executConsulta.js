import conexao from "../../infra/conexao.js";

// Função genérica para processar consultas ao banco
export const executarConsulta = (sql, res) => {
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
