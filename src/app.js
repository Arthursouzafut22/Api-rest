import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import paymentRoutes from "./routes/paymentRoutes.js";
import productTypeRoutes from "./routes/productTypeRoutes.js";
import imagesRoutes from "./routes/imagesRoutes.js";

dotenv.config();
export const app = express();
app.use(express.json());

app.use(cors());

app.use(productTypeRoutes);
app.use(paymentRoutes);
app.use(imagesRoutes);

// Configuração para servir arquivos estáticos
app.use("/images", express.static(path.resolve("imgs/imsPods")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
