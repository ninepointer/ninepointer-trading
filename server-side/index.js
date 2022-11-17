const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const kiteConnect = require('./marketData/kiteConnect');
const fetch = require('./marketData/placeOrder');

dotenv.config({ path: './config.env' });

console.log(kiteConnect);
app.get('/ws', kiteConnect);
app.get('/data', fetch);
app.use(cors());

app.use(express.json());

app.use(require("./routes/user/userLogin"));
app.use(require('./routes/TradeData/getUserTrade'));
app.use(require('./routes/TradeData/getCompanyTrade'));
app.use(require('./routes/AlgoBox/exchangeMappingAuth'));
app.use(require('./routes/AlgoBox/instrumentAlgoAuth'));
app.use(require('./routes/AlgoBox/productMappingAuth'));
app.use(require('./routes/AlgoBox/tradingAlgoAuth'));
app.use(require("./marketData/getRetrieveOrder"));
app.use(require('./marketData/placeOrder'));
app.use(require('./routes/instrument/instrumentAuth'));
app.use(require('./routes/TradingAccountAuth/accountAuth'));
app.use(require('./routes/TradingAccountAuth/brokerageAuth'));
app.use(require('./routes/TradingAccountAuth/parameterAuth'));
app.use(require('./routes/TradingAccountAuth/requestTokenAuth'));
app.use(require('./routes/user/userDetailAuth'));
require('./db/conn');

const PORT = 5000;

app.get('/', (req, res) => {
  res.send('running');
});
app.listen(PORT);