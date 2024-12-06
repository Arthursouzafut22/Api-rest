import { app } from "./src/app";
import conexao from "./infra/conexao";

const PORT = 3000;

conexao.connect();

app.listen(PORT, () => console.log("servidor rodando"));
