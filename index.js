const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Definir a rota do proxy
app.get('/api/produtos', async (req, res) => {
    try {
        const sku = req.query.sku;  // Pega o SKU da query string
        
        // Configurar a URL da API VTEX
        const response = await axios.get(`https://panvelprd.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUD'
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