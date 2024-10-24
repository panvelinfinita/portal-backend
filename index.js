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