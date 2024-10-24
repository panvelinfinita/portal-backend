const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configuração do CORS para permitir todas as origens
app.use(cors({
    origin:'*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-type', 'Authorization'] 
}));

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Rota de teste para garantir que o servidor está respondendo
app.get('/teste', (req, res) => {
    res.send('Servidor está funcionando');
});

// Rota para a API
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

app.listen(PORT, () => {
    console.log(`Servidor proxy rodando na porta ${PORT}`);
});

// Nova rota para consultar preço e estoque de um SKU com POST
app.post('/api/produtos/preco-estoque', async (req, res) => {
    const { sku, seller } = req.body;  // Recebe SKU e Seller do corpo da requisição

    // Defina o endpoint para consultar preço e estoque
    const url = 'http://panvelprd.vtexcommercestable.com.br/api/checkout/pvt/orderForms/simulation?sc=1'; // Substitua pela URL correto da API de preço e estoque da VTEX

    // Corpo da requisição que será enviado no POST
    const data = {
        "items": [
            {
                "id": sku,  // SKU que será enviado
                "quantity": "1",  // Quantidade padrão (estática)
                "seller": seller  // Seller ID que será enviado
            }
        ],
        "country": "BRA",  // Código do país
        "postalCode": "03371000"  // CEP padrão (estático)
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUD',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN'
            }
        });

        // Enviar a resposta com os dados de preço e estoque
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao consultar a API de Preço e Estoque:', error);
        res.status(500).send('Erro na consulta de preço e estoque');
    }
});