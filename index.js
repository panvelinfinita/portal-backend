const express = require('express');
const axios = require('axios');
const app = express();

// Porta do servidor
const PORT = process.env.PORT || 3000;

app.get('/api/produtos', async (req, res) => {
    try {
        const sku = '30850';  // SKU fixo para teste
        
        // Configurar a URL da API VTEX
        const url = `https://panvelprd.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUD'
            }
        });

        // Retornar os dados da API VTEX
        res.json(response.data);

    } catch (error) {
        console.error('Erro na consulta à API:', error);
        res.status(500).send('Erro ao consultar a API VTEX');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy rodando na porta ${PORT}`);
});