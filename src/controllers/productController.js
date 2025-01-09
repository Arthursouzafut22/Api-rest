import conexao from "../../infra/conexao";

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

export const listarProdutos = (req, res) => {
  const sql = "SELECT * FROM atacado;";
  executarConsulta(sql, res);
};

export const listarProdutosPorTipo = (req, res) => {
  const { tipo } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const tiposPermitidos = ["atacado", "liquido", "vendidos"];
  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({ erro: "Tipo inválido." });
  }

  const sqlCount = `SELECT COUNT(*) AS total FROM atacado WHERE tipo = '${tipo}';`;
  const sqlQuery = `SELECT * FROM atacado WHERE tipo = '${tipo}' LIMIT ${limit} OFFSET ${offset};`;

  conexao.query(sqlCount, (erroContagem, resultadosContagem) => {
    if (erroContagem) {
      return res.status(500).json({ erro: "Erro ao contar produtos." });
    }

    const totalProdutos = resultadosContagem[0].total;

    conexao.query(sqlQuery, (erroConsulta, resultadosConsulta) => {
      if (erroConsulta) {
        return res.status(500).json({ erro: "Erro ao buscar produtos." });
      }

      const produtos = resultadosConsulta.map((produto) => ({
        ...produto,
        imagem: produto.imagem ? JSON.parse(produto.imagem) : [],
        sabores: produto.sabores ? JSON.parse(produto.sabores) : [],
      }));

      res.status(200).json({
        totalProdutos,
        totalPaginas: Math.ceil(totalProdutos / limit),
        paginaAtual: page,
        produtos,
      });
    });
  });
};
