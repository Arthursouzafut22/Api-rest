import { app } from "./src/app";
import conexao from "./infra/conexao";

const PORT = 3000;

conexao.connect();

app.listen(PORT, () => console.log("servidor rodando"));
// CREATE SCHEMA `dbatacado` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
// CREATE TABLE `dbatacado`.`atacado` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `nome` VARCHAR(80) NOT NULL,
//     `preco` FLOAT NOT NULL,
//     PRIMARY KEY (`id`));

// INSERT INTO `dbatacado`.`atacado` (`nome`, `preco`) VALUES ('Vaper', '150');
// INSERT INTO `dbatacado`.`atacado` (`nome`, `preco`) VALUES ('Pod', '120');
// INSERT INTO `dbatacado`.`atacado` (`nome`, `preco`) VALUES ('Liquido', '130');
