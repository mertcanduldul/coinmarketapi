//--------//
const express = require('express')
const axios = require('axios');
const fs = require('fs');

//--------//

//*********//
const PORT = process.env.PORT || 3001
const app = express()

//********//
app.listen(PORT)

const TRY_id = 2810
const EUR_id = 2790
const USD_id = 2781
const unique = TRY_id


app.get('/all', async (req, res) => {
    let coinArr = []
    for (let id = 1; id <= 100; id++) {
        await axios.get(`https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}`)
            .then(response => {
                let item = response.data.data[id]
                let coin = {}
                coin['id'] = id
                coin['name'] = item.name
                coin['price'] = item.quote.USD.price
                coinArr.push(coin)
                console.log(coin)
                fs.appendFile("db.txt", JSON.stringify(coinArr),
                    (err) => {
                        if (err) throw err
                    }
                )

            })
            .catch(err => {})
    }
    res.send(coinArr)
})
app.get('/:id', (req, res) => {
    axios.get(`https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${req.params.id}`)
        .then((response) => {
            axios.get(`https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${unique}`)
                .then((ress) => {
                    const _TRY = 1 / ress.data.data[`${unique}`].quote.USD.price
                    res.send(response.data.data[req.params.id].name + " : " + Math.floor(response.data.data[req.params.id].quote.USD.price * _TRY * 1000000) / 1000000 + " " + ress.data.data[`${unique}`].symbol)
                })
                .catch((err) => {})
        })
        .catch((err) => {})
})
app.use((req, res) => {
    res.status(404).send('404')
})
//1 btc
//1027 eth
//74 doge
//2810 try