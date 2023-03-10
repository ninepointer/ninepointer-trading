import React, { useContext, useState } from "react";
import "./ByModel.css";
import { useEffect } from 'react';
import axios from "axios"
import uniqid from "uniqid"
import { userContext } from "../../AuthContext";

export default function SellModel({marketData, uIdProps, Render, isCompany, symbol, ltp, maxlot, lotsize }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const { reRender, setReRender } = Render;
    const getDetails = useContext(userContext);
    let uId = uniqid();
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    let createdBy = getDetails.userDetails.name;
    let userId = getDetails.userDetails.email;
    let totalAmount = 0;
    let tradeBy = getDetails.userDetails.name;
    let dummyOrderId = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`

   

    const [userPermission, setUserPermission] = useState([]);
    const [bsBtn, setBsBtn] = useState(true)
    const [modal, setModal] = useState(false);
    const [Details, setDetails] = useState({
        exchange: "",
        symbol: "",
        ceOrPe: "",
        buyOrSell: "",
        variety: "",
        Product: "",
        Quantity: "",
        Price: "",
        OrderType: "",
        TriggerPrice: "",
        stopLoss: "",
        validity: "",
        last_price: "",
        brokerageCharge: "",
        totalAmount: "",
        instrumentToken: ""
    })

    const [selected, setSelected] = useState("NRML");
    Details.Product = selected;
    const radioHandler = (e) => {
        console.log(e.target.value);
        setSelected(e.target.value);
        Details.Product = e.target.value
        console.log(Details.Product);
    }

    const [marketselected, setMarketselected] = useState("MARKET");
    Details.OrderType = marketselected
    const radioHandlerTwo = (e) => {
        setMarketselected(e.target.value);
        Details.OrderType = e.target.value;
    }

    const [validitySelected, setValiditySelected] = useState("DAY");
    Details.validity = validitySelected
    const radioHandlerthree = (e) => {
        setValiditySelected(e.target.value);
        Details.validity = e.target.value;
    }

    let [accessTokenDetails, setAccessToken] = useState([]);
    let [apiKeyDetails, setApiKey] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    const [brokerageData, setBrokerageData] = useState([]);
    const [tradingAlgoData, setTradingAlgoData] = useState([]);
    const [instrumentAlgoData, setInstrumentAlgoData] = useState([]);
    const [companyTrade, setCompanyTrade] = useState({
        realBuyOrSell: "",
        realSymbol: "",
        realQuantity: "",
        realInstrument: "",
        realBrokerage: "",
        realAmount: "",
        real_last_price: "",
    })
 
    let lotSize = lotsize;
    let maxLot = maxlot;
    let finalLot = maxLot/lotSize;
    let optionData = [];
    for(let i =1; i<= finalLot; i++){
        optionData.push( <option value={i * lotSize}>{ i * lotSize}</option>)
        
    }
    
    const toggleModal = () => {
        console.log("in toggle",modal)
        if(!modal){
            console.log("in modal")
            axios.get(`${baseUrl}api/v1/readpermission`)
            .then((res) => {
                let perticularUser = (res.data).filter((elem) => {
                    //console.log(elem.userId, userId);
                    return elem.userId === userId;
                })
                setUserPermission(perticularUser);
            }).catch((err) => {
                // window.alert("Server Down");
                return new Error(err);
            })
    
            axios.get(`${baseUrl}api/v1/readtradingAlgo`)
            .then((res) => {
                setTradingAlgoData(res.data);
            }).catch((err) => {
                return new Error(err);
            })

        }


        setModal(!modal);
        console.log(modal)
    };

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    useEffect(() => {

        // axios.get(`${baseUrl}api/v1/readpermission`)
        //     .then((res) => {
        //         let perticularUser = (res.data).filter((elem) => {
        //             console.log(elem.userId, userId);
        //             return elem.userId === userId;
        //         })
        //         setUserPermission(perticularUser);
        //     }).catch((err) => {
        //         // window.alert("Server Down");
        //         return new Error(err);
        //     })

        axios.get(`${baseUrl}api/v1/readRequestToken`)
            .then((res) => {
                let activeAccessToken = (res.data).filter((elem) => {
                    return elem.status === "Active"
                })
                setAccessToken(activeAccessToken);
            }).catch((err) => {

                return new Error(err);
            })
        axios.get(`${baseUrl}api/v1/readAccountDetails`)
            .then((res) => {
                let activeApiKey = (res.data).filter((elem) => {
                    return elem.status === "Active"
                })
                setApiKey(activeApiKey);
            }).catch((err) => {

                return new Error(err);
            })

        // axios.get(`${baseUrl}api/v1/readtradingAlgo`)
        //     .then((res) => {
        //         setTradingAlgoData(res.data);
        //     }).catch((err) => {
        //         return new Error(err);
        //     })

        axios.get(`${baseUrl}api/v1/readBrokerage`)
            .then((res) => {
                setBrokerageData(res.data)
            }).catch((err) => {

                return new Error(err);
            })

          

        axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
            .then((res) => {
                let dataArr = (res.data).filter((elem) => {
                    return elem.status === "Active"
                })
                setTradeData(dataArr)
            }).catch((err) => {

                return new Error(err);
            })
        axios.get(`${baseUrl}api/v1/readInstrumentAlgo`)
            .then((res) => {
                let activeInstrumentAlgo = (res.data).filter((elem) => {
                    return elem.Status === "Active";
                })
                setInstrumentAlgoData(activeInstrumentAlgo)
            }).catch((err) => {
                // window.alert("Server Down");
                return new Error(err);
            })
        console.log("hii");

        console.log(tradeData);
        setTradeData([...tradeData])
    },[getDetails])


    const tradingAlgoArr = [];
    apiKeyDetails.map((elem) => {
        accessTokenDetails.map((subelem) => {
            tradingAlgoData.map((element) => {
                if (element.status === "Active" && subelem.accountId == element.tradingAccount && elem.accountId == element.tradingAccount) {
                    tradingAlgoArr.push(element);
                }
            })
        })
    })

    console.log(userPermission, tradingAlgoArr);
    const userPermissionAlgo = [];
    for (let elem of tradingAlgoArr) {
        for (let subElem of userPermission) {
            if (elem.algoName === subElem.algoName && subElem.isTradeEnable) {
                userPermissionAlgo.push(elem)
            }
        }
    }

    console.log(userPermissionAlgo); //its an array do everything according it


    function FormHandler(e) {
        e.preventDefault()
    }

    let tradeEnable ;
    userPermission.map((elem)=>{
        console.log(elem)
        if(elem.isTradeEnable){
            tradeEnable = true;
        }
    })

    function tradingAlgo(uId, lastPrice) {
        // if(tradingAlgoData.length){
        userPermissionAlgo.map((elem)=>{

            if(elem.transactionChange === "TRUE"){
                companyTrade.realBuyOrSell = "BUY"
            }else{
                companyTrade.realBuyOrSell = "SELL"
            }
            console.log("exchange", tradeData);

            companyTrade.realSymbol = Details.symbol
            companyTrade.realInstrument = Details.instrument

            // const getLastPrice = marketData.filter((elem)=>{
            //     return elem.instrument_token === arr[0].instrumentToken;
            // })
            
            companyTrade.realQuantity = elem.lotMultipler * (Details.Quantity);
            accessTokenDetails = accessTokenDetails.filter((element)=>{
                return elem.tradingAccount === element.accountId
            })

            setAccessToken(accessTokenDetails);
            apiKeyDetails = apiKeyDetails.filter((element)=>{
                return elem.tradingAccount === element.accountId
            })
            
            setApiKey(apiKeyDetails);
            
            // companyTrade.real_last_price = 100
            // companyTrade.realAmount = 800
            companyTrade.real_last_price = lastPrice;
            companyTrade.realAmount = companyTrade.real_last_price * companyTrade.realQuantity;
            companyTrade.realBrokerage = sellBrokerageCharge(brokerageData, companyTrade.realQuantity, companyTrade.realAmount);
            
            userPermission.map((subElem)=>{
                if(subElem.algoName === elem.algoName){
                    if(subElem.isRealTradeEnable || elem.isRealTrade){
                        sendOrderReq(elem, "yes");
                        // mockTradeUser("yes");
                        // mockTradeCompany(elem, "yes");
                    } else{
                        // mockTradeUser("no");
                        mockTradeCompany(elem, "no");
                    }
                }
            })
            setModal(!modal);               
        })
    }

    async function Sell(e, uId) {
        e.preventDefault()

        Details.buyOrSell = "SELL";
        if (bsBtn === true) {
            Details.variety = "regular"
        }
        else {
            Details.variety = "amo"
        }

        console.log(tradeData)
        let getSomeData = tradeData.filter((elem) => {
            return elem.uId === uIdProps;
        })
        Details.exchange = getSomeData[0].exchange;
        Details.symbol = getSomeData[0].symbol;
        Details.instrumentToken = getSomeData[0].instrumentToken;

        let getLivePrice = marketData.filter((elem) => {
            return getSomeData[0].instrumentToken === elem.instrument_token;
        })
        
        Details.last_price = getLivePrice[0].last_price
        // Details.last_price = 100;

        Details.totalAmount = Details.last_price * Details.Quantity;
        Details.brokerageCharge = sellBrokerageCharge(brokerageData, Details.Quantity, Details.totalAmount);

        // Algo box applied here....
        if(userPermissionAlgo.length && !isCompany){
            setDetails(Details)
            // if(!isCompany){
            //     mockTradeUser("no");
            // }
            tradingAlgo(uId, Details.last_price);
        }else{
            companyTrade.realBuyOrSell = "SELL";
            companyTrade.realSymbol = Details.symbol
            companyTrade.realInstrument = Details.instrument
            companyTrade.realQuantity = Details.Quantity;
            companyTrade.real_last_price = Details.last_price
            companyTrade.realAmount = Details.last_price * companyTrade.realQuantity;
            companyTrade.realBrokerage = sellBrokerageCharge(brokerageData, companyTrade.realQuantity, companyTrade.realAmount);
            
            setCompanyTrade(companyTrade)
            setDetails(Details)
            
    
            const fakeAlgo = {
                algoName: "no algo",
                transactionChange: "no algo",
                instrumentChange: "no algo",
                exchangeChange: "no algo",
                lotMultipler: "no algo",
                productChange: "no algo",
                tradingAccount: "no algo"
            }
            if(isCompany){
                mockTradeCompany(fakeAlgo, "no");
            } else{
                window.alert("Your Trade is Disabled, contact authorize person")
            }
            // mockTradeCompany(fakeAlgo, "no");
            // must keep inside both if and else
            
            setModal(!modal);        
        }    

        let id = setTimeout(()=>{
            reRender ? setReRender(false) : setReRender(true)
        }, 1000);
    }
    console.log(Details)
    async function sendOrderReq(algoBox, realTrade) {
        const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety, last_price, instrumentToken } = Details;
        const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount } = algoBox;
        const { realBuyOrSell, realSymbol, realQuantity, realInstrument, realBrokerage, realAmount, real_last_price } = companyTrade;

        const { instrument } = tradeData;
        const { apiKey } = apiKeyDetails[0];
        const { accessToken } = accessTokenDetails[0];

        const res = await fetch(`${baseUrl}api/v1/placeorder`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                
                apiKey, accessToken, userId,
                exchange, symbol: realSymbol, buyOrSell, realBuyOrSell, Quantity, realQuantity, Price, Product, OrderType, TriggerPrice, 
                stopLoss, validity, variety, last_price: real_last_price, createdBy, userId, createdOn, uId, 
                algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                productChange, tradingAccount}, order_id:dummyOrderId, instrumentToken, realTrade

            })
        });
        const dataResp = await res.json();
        console.log("dataResp", dataResp)
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            console.log("Failed to Trade");
        } else {
            if(dataResp.massage === "COMPLETE"){
                console.log(dataResp);
                window.alert("Trade succesfull completed");
            } else if(dataResp.massage === "REJECTED"){
                console.log(dataResp);
                window.alert("Trade is rejected due to insufficient fund");
            }

            console.log("entry succesfull");
        }
    }

    function sellBrokerageCharge(brokerageData, quantity, totalAmount) {
        let buyBrokerage = brokerageData.filter((elem) => {
            return elem.transaction === "SELL"
        })
        console.log(buyBrokerage);
        let brokerage = Number(buyBrokerage[0].brokerageCharge);
        // let totalAmount = Number(Details.last_price) * Number(quantity);
        let exchangeCharge = totalAmount * (Number(buyBrokerage[0].exchangeCharge) / 100);
        let gst = (brokerage + exchangeCharge) * (Number(buyBrokerage[0].gst) / 100);
        let sebiCharges = totalAmount * (Number(buyBrokerage[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(buyBrokerage[0].stampDuty) / 100);
        let sst = totalAmount * (Number(buyBrokerage[0].sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

        return finalCharge
    }

    async function mockTradeUser(realTrade){ // have to add some feild according to auth
        // let currentTime = `${date.getHours()}:${date.getMinutes()}`
        // if(currentTime > "15:30" && currentTime < "9:15"){
        //     window.alert("Market is closed now");
        //     return;
        // }
        const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety, last_price, instrumentToken } = Details;
        // const {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount} = algoBox

        const res = await fetch(`${baseUrl}api/v1/mocktradeuser`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety, last_price, createdBy, userId, createdOn, uId,
                isRealTrade:realTrade, order_id:dummyOrderId, instrumentToken
                // , algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount}
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            console.log("Failed to Trade");
        } else {
            console.log(dataResp);
            window.alert("Trade succesfull");
            console.log("entry succesfull");
        }

    }

    async function mockTradeCompany(algoBox, realTrade){
        
        // let currentTime = `${date.getHours()}:${date.getMinutes()}`
        // console.log("currentTime", currentTime);
        // if(currentTime > "15:30" || currentTime < "9:15"){
        //     console.log("current if")
        //     // window.alert("Market is closed now");
        //     return;
        // }
        // console.log("compny side", exchange, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety, algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount, realBuyOrSell, realSymbol, realQuantity, real_last_price);
        const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety, last_price, instrumentToken } = Details;
        const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount } = algoBox;
        const { realBuyOrSell, realSymbol, realQuantity, realInstrument, realBrokerage, realAmount, real_last_price } = companyTrade;
        const res = await fetch(`${baseUrl}api/v1/mocktradecompany`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                exchange, symbol: realSymbol, buyOrSell, realBuyOrSell, Quantity, realQuantity, Price, Product, OrderType, TriggerPrice, 
                stopLoss, validity, variety, last_price: real_last_price, createdBy, userId, createdOn, uId, 
                algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                productChange, tradingAccount}, order_id:dummyOrderId, instrumentToken, realTrade

            })
        });
        const dataResp = await res.json();
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            console.log(dataResp.error);
            window.alert(dataResp.error);
        } else {
            console.log(dataResp);
            window.alert("Trade succesfull");
            //console.log("entry succesfull");
        }
        
    }
  
    return (
        <>
        {/* {userPermission[0] === undefined ?
            <button disabled={!userPermission.isTradeEnable} onClick={toggleModal} className="btn-modal Sell_btn">
                SELL
            </button>
            :
            <button disabled={!userPermission[0].isTradeEnable} onClick={toggleModal} className="btn-modal Sell_btn">
            SELL
            </button> } */}

            <button onClick={toggleModal} className="btnnew bg-gradient-primary mt-2 w-40 mx-sm-1">
            SELL
            </button>

            {modal && (
               <div className="modal">
               <div onClick={toggleModal} className="overlay"></div>
               <div className="modal-content">
               { getDetails.userDetails.role === "admin" ?
                <div className="form_btnRagAMO">
                    <button className={bsBtn ? "amobtn" : `bsBtn`} onClick={() => { setBsBtn(true) }}>Regular</button> <button className={bsBtn ? "bsBtn" : "amobtn"} onClick={() => { setBsBtn(false) }}>AMO</button>
                </div>
                :
                <div className="form_btnRagAMO">
                    <button className={bsBtn ? "amobtn" : `bsBtn`} onClick={() => { setBsBtn(true) }}>Regular</button>
                </div>}
                <span className="headingSymbol">{symbol}</span> <span className="headingSymbol">{ltp}</span>

                        {bsBtn ? <form className="Form_head" onChange={FormHandler} >
                            <div className="container_One">
                                <input type="radio" value="MIS" checked={selected === 'MIS'} name="Product" className="btnRadio" onChange={radioHandler} /> Intraday <span style={{ color: 'gray' }}>MIS</span>
                                <input type="radio" value="NRML" checked={selected === 'NRML'} name="Product" className="btnRadio" onChange={radioHandler} /> Overnight <span style={{ color: 'gray' }}>NRML</span>
                            </div>
                            <div className="container_two">
                                <div className="form_inputContain">
                                    <label htmlFor="" className="bsLabel">Quantity</label>
                                    <select type="number" className="bsInput bsInputSelect" onChange={(e) => { { Details.Quantity = (e.target.value) } }} >
                                    <option value=""></option>
                                    {optionData.map((elem)=>{
                                        return(
                                            <option>{elem.props.children}</option>
                                        )
                                    }) 
                                    }   
                                    </select>
                                    <label htmlFor="" className="bsLabel" >Price</label>
                                    <input type="number" className="bsInput" onChange={(e) => { { Details.Price = e.target.value } }} />

                                    <label htmlFor="" className="bsLabel">Trigger Price</label>
                                    <input type="number" className="bsInput" onChange={(e) => { { Details.TriggerPrice = e.target.value } }} />
                                </div>
                                <div className="form_checkbox">
                                    <input type="radio" value="MARKET" checked={marketselected === 'MARKET'} name="OrderType" className="btnRadio1" onChange={radioHandlerTwo} /> Market
                                    <input type="radio" value="LIMIT" checked={marketselected === 'LIMIT'} name="OrderType" className="btnRadio1" onChange={radioHandlerTwo} /> Limit
                                    <input type="radio" value="SL" name="TriggerPrice" className="btnRadio1" onChange={(e) => { { Details.stopLoss = e.target.value } }} /> SL
                                    <input type="radio" value="SLM" name="TriggerPrice" className="btnRadio1" onChange={(e) => { { Details.stopLoss = e.target.value } }} /> SL-M
                                </div>
                            </div>

                            <div className="container_three">
                                <label htmlFor="" className="bsLabel bslable1" >Validity</label>
                                <span className="lable1_radiobtn"><input type="radio" value="DAY" checked={validitySelected === 'DAY'} name="validity" className="btnRadio2" onChange={radioHandlerthree} /> Day</span>
                                <span className="lable1_radiobtn"><input type="radio" value="IMMEDIATE" checked={validitySelected === 'IMMEDIATE'} name="validity" className="btnRadio2" onChange={radioHandlerthree} /> Immediate  </span>
                                <span className="lable1_radiobtn"><input type="radio" value="MINUTES" checked={validitySelected === 'MINUTES'} name="validity" className="btnRadio2" onChange={radioHandlerthree} /> Minutes </span>
                            </div>


                            <div className="form_button">
                                <button className="bsButton bsButton1" onClick={(e) => { Sell(e, uId) }} >Sell</button>
                                <button className="bsButton1_cancel" onClick={toggleModal}> Cancel</button>
                            </div>
                        </form> :
                            <form className="Form_head" onChange={FormHandler} >
                                <div className="container_One">
                                    <input type="radio" value="MIS" checked={selected === 'MIS'} name="Product" className="btnRadio" onChange={radioHandler} /> Intraday <span style={{ color: 'gray' }}>MIS</span>
                                    <input type="radio" value="NRML" checked={selected === 'NRML'} name="Product" className="btnRadio" onChange={radioHandler} /> Overnight <span style={{ color: 'gray' }}>NRML</span>
                                </div>
                                <div className="container_two">
                                    <div className="form_inputContain">
                                        <label htmlFor="" className="bsLabel">Quantity</label>
                                        <input type="number" className="bsInput" onChange={(e) => { { Details.Quantity = e.target.value } }} />

                                        <label htmlFor="" className="bsLabel" >Price</label>
                                        <input type="number" className="bsInput" onChange={(e) => { { Details.Price = e.target.value } }} />

                                        <label htmlFor="" className="bsLabel">Trigger Price</label>
                                        <input type="number" className="bsInput" onChange={(e) => { { Details.TriggerPrice = e.target.value } }} />

                                    </div>
                                    <div className="form_checkbox">
                                        <input type="radio" value="MARKET" checked={marketselected === 'MARKET'} name="OrderType" className="btnRadio1" onChange={radioHandlerTwo} /> Market
                                        <input type="radio" value="LIMIT" checked={marketselected === 'LIMIT'} name="OrderType" className="btnRadio1" onChange={radioHandlerTwo} /> Limit
                                        <input type="radio" value="SL" name="TriggerPrice" className="btnRadio1" onChange={(e) => { { Details.stopLoss = e.target.value } }} /> SL
                                        <input type="radio" value="SLM" name="TriggerPrice" className="btnRadio1" onChange={(e) => { { Details.stopLoss = e.target.value } }} /> SL-M
                                    </div>
                                </div>

                                <div className="container_three">
                                    <label htmlFor="" className="bsLabel bslable1" >Validity</label>
                                    <span className="lable1_radiobtn"><input type="radio" value="DAY" checked={validitySelected === 'DAY'} name="validity" className="btnRadio2" onChange={radioHandlerthree} /> Day</span>
                                    <span className="lable1_radiobtn"><input type="radio" value="IMMEDIATE" checked={validitySelected === 'IMMEDIATE'} name="validity" className="btnRadio2" onChange={radioHandlerthree} /> Immediate  </span>
                                    <span className="lable1_radiobtn"><input type="radio" value="MINUTES" checked={validitySelected === 'MINUTES'} name="validity" className="btnRadio2" onChange={radioHandlerthree} /> Minutes </span>
                                </div>

                                <div className="form_button">
                                    <button className= "bsButton bsButton1" onClick={(e) => { Sell(e, uId) }} >Sell</button>
                                    <button className="bsButton1_cancel" onClick={toggleModal}> Cancel</button>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            )}

        </>
    );
}

    // function instrumentAlgo(lastPrice){
    //     if (instrumentAlgoData.length) {
    //         instrumentAlgoData.map((elem) => {
    //             tradeData.map((element)=>{
    //                 if(elem.IncomingInstrumentCode === element.symbol){
    //                     companyTrade.realSymbol = elem.OutgoingInstrumentCode;
    //                 }
    //             })
    //             companyTrade.real_last_price = Details.last_price; // wrong see here in buy model
    //             companyTrade.realBuyOrSell = "SELL";
    //             companyTrade.realQuantity = Details.Quantity;
    //             companyTrade.realAmount = Details.Quantity * lastPrice;
    //             companyTrade.realBrokerage = sellBrokerageCharge(brokerageData, companyTrade.realQuantity, companyTrade.realAmount );
                
    //             // Details.totalAmount = totalAmount;
    //             setCompanyTrade(companyTrade)
    //             // if(permission[0].isRealTradeEnable){
    //             //     sendOrderReq();
    //             // } else{
    //             //     mockTrade();
    //             // }
    //             setModal(!modal);
    //         })
    //     } else {
    //         companyTrade.real_last_price = Details.last_price;
    //         companyTrade.realBuyOrSell = "SELL";
    //         companyTrade.realSymbol = Details.symbol
    //         companyTrade.realInstrument = Details.instrument
    //         companyTrade.realQuantity = Details.Quantity;
    //         companyTrade.realAmount = lastPrice * companyTrade.realQuantity;
    //         companyTrade.realBrokerage = sellBrokerageCharge(brokerageData, companyTrade.realQuantity, companyTrade.realAmount);
            
    //         setCompanyTrade(companyTrade)
    //         // if(permission[0].isRealTradeEnable){
    //         //     sendOrderReq();
    //         // } else{
    //         //     mockTrade();
    //         // }
    //         setModal(!modal);
    //     }
    // }