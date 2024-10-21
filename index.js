const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/produtos/:sku', async (req, res) => {
    const sku = req.params.sku; // Pega o SKU enviado pelo front-end
    const vtexUrl = `https://panvelprd.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;

    try {
        const response = await axios.get(vtexUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUD',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN'
            }
        });

        res.json(response.data); // Retorna o JSON recebido da VTEX para o front-end
    } catch (error) {
        console.error('Erro na requisição para a VTEX:', error);
        res.status(500).json({ error: 'Erro ao consultar produto na VTEX.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor proxy rodando na porta ${PORT}`);
});
