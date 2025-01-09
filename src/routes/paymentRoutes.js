import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/payment", async (req, res) => {
  const { amount, description } = req.body;
  try {
    const response = await fetch(process.env.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
      body: JSON.stringify({
        reference_id: "ex-00001",
        description,
        customer: {
          name: "Jose da Silva",
          email: "email@test.com",
          tax_id: "12345678909",
          phones: [
            {
              country: "55",
              area: "11",
              number: "999999999",
              type: "MOBILE",
            },
          ],
        },
        items: [
          {
            name: "nome do item",
            quantity: 1,
            unit_amount: 500,
          },
        ],
        qr_codes: [
          {
            amount: {
              value: amount || 40,
            },
            expiration_date: "2025-01-12T12:00:00-03:00",
          },
        ],
        shipping: {
          address: {
            street: "Avenida Brigadeiro Faria Lima",
            number: "1384",
            complement: "apto 12",
            locality: "Pinheiros",
            city: "São Paulo",
            region_code: "SP",
            country: "BRA",
            postal_code: "01452002",
          },
        },
        notification_urls: ["https://meusite.com/notificacoes"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da API PagSeguro:", errorData);
      return res.status(response.status).json(errorData);
    }

    const responseData = await response.json();
    console.log("Resposta do PagSeguro:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Erro na requisição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;
