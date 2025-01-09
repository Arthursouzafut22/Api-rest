import express from "express";
import productRoutes from "./productRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/payment", paymentRoutes);

export default router;
