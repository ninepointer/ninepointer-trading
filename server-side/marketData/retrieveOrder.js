const axios = require("axios")
const TradeData = require("../models/TradeDetails/allTradeSchema");
const express = require("express");
const router = express.Router();

  const getOrderData = async (apiKey, accessToken, res) => {
  const url = "https://api.kite.trade/orders";
  const api_key = apiKey;
  const access_token = accessToken;
  let auth = 'token' + api_key + ':' + access_token;

  let authOptions = {
    headers: {
      'X-Kite-Version': '3',
      Authorization: auth,
    },
  };
  const response = await axios.get(url, authOptions);
  // console.log("its json data", JSON.stringify(res.data));
  const orderData = (response.data).data;
  console.log("order data", orderData[orderData.length - 1]);
  const {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
         order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
         pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by}
          = orderData[orderData.length - 1];
        


        if(exchange_order_id === null){
          const tradeData = (new TradeData({order_id, status, average_price, quantity, product, transaction_type,
            order_timestamp, variety, validity, exchange, order_type, price, filled_quantity, 
            pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by}))
      
            console.log("this is trade data", tradeData, typeof(tradeData));
            tradeData.save()
            .then(()=>{
                console.log("data enter succesfully")
            }).catch((err)=> {
              res.status(500).json({error:"Failed to Trade"});
              console.log("failed to enter data of order");
            })

        }else{
            const tradeData = (new TradeData({order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
              order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
              pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by}))

            console.log("this is trade data", tradeData, typeof(tradeData));
            tradeData.save()
            .then(()=>{
                console.log("data enter succesfully")
            }).catch((err)=> {
              res.status(500).json({error:"Failed to enter data"});
              console.log("failed to enter data of order");
            })
        }
      console.log("data save hona chahiye....");
};

module.exports = getOrderData;