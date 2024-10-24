const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware para permitir JSON no body das requisições
app.use(express.json());

// Configuração do CORS para permitir todas as origens
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-type', 'Authorization']
}));

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Rota de teste para garantir que o servidor está respondendo
app.get('/teste', (req, res) => {
    res.send('Servidor está funcionando');
});

// Rota para a API de produtos (SKU Front)
app.get('/api/produtos', async (req, res) => {
    const sku = req.query.sku;  // SKU recebido pela query string
    const url = `https://panvelprd.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUD',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN'
            }
        });
        console.log("Resposta da VTEX:", response.data);  // Log da resposta
        
        // Enviar resposta ao cliente
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao consultar a API VTEX:', error);
        res.status(500).send('Erro na consulta');
    }
});

// NOVA ROTA: Rota para consultar preço e estoque
app.post('/api/preco-estoque', async (req, res) => {
    const { id, seller, quantity = "1" } = req.body;

    const url = 'http://panvelprd.vtexcommercestable.com.br/api/checkout/pvt/orderForms/simulation?sc=1';
    const body = JSON.stringify({
        items: [
            {
                id: id,
                quantity: quantity,
                seller: seller
            }
        ],
        country: "BRA",
        postalCode: "92310150"
    });

    console.log("Body da requisição:", body); // Debug do body para verificar se está correto

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUD',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN'
            }
        });

        console.log("Resposta da VTEX:", response.data); // Log da resposta para verificar o resultado
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao consultar preço/estoque:', error.response?.data || error.message); // Melhor debug do erro
        res.status(500).json({ message: 'Erro ao consultar preço/estoque' });
    }
});