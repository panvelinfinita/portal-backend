const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Definir a rota do proxy
app.get('/api/produtos', async (req, res) => {
    try {
        // Pegando o valor do SKU da query string
        const sku = req.query.sku;

        // Garantir que o SKU foi passado
        if (!sku) {
            return res.status(400).send('O parâmetro SKU é obrigatório.');
        }

        // Configurar a URL da API VTEX com o SKU correto
        const url = `https://panvelprd.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;
        
        // Fazer a requisição à API da VTEX
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppKey': 'SUA_APP_KEY',
                'X-VTEX-API-AppToken': 'SEU_APP_TOKEN'
            }
        });

        // Retornar os dados da API VTEX para o front-end
        res.json(response.data);

    } catch (error) {
        res.status(500).send('Erro ao consultar a API VTEX');
    }
});

app.listen(port, () => {
    console.log(`Servidor proxy rodando na porta ${port}`);
});