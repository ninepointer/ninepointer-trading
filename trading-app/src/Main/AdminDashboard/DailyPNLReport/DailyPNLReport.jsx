import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import Styles from "./DailyPNLReport.module.css";
import axios from "axios";
import { userContext } from "../../AuthContext";
import { io } from "socket.io-client";


export default function DailyPNLReport() {
    let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    let socket;
    try{
        // socket = io.connect("http://localhost:9000/")
        socket = io.connect(`${baseUrl1}`)

    } catch(err){
        throw new Error(err);
    }

    let date = new Date();
    let valueInSecondDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    let valueInFirstDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`


    const getDetails = useContext(userContext);
    const [detailPnlArr, setDetailPnl] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    const [render, setRender] = useState(true);
    let [firstDate, setFirstDate] = useState(valueInFirstDate);
    let [secondDate, setSecondDate] = useState(valueInSecondDate);
    const [selectUserState, setSelectUserState] = useState("All User");
    const [marketData, setMarketData] = useState([]);

    let totalArr = [];
    let [allBrokerage, setAllBrokerage] = useState(0);
    let [allNet, setAllNet] = useState(0);
    let [allGross, setAllGross] = useState(0);
    // let secondDate = "";
    let userId = (getDetails.userDetails.role === "user") && getDetails.userDetails.email;

    let noRender = useRef(true);
    let detailPnl = [];
    let totalPnl = 0;
    let transactionCost = 0;
    let numberOfTrade = 0;
    let lotUsed = 0;
    let name = "";
    let runninglots = 0;
    let firstDateSplit;

    let detailArr = [];

    useEffect(()=>{
        console.log("rendering")
        console.log(socket);
        socket.on("connect", ()=>{
            console.log(socket.id);
            socket.emit("hi",true)
        })

        socket.on("tick", (data) => {
            console.log("this is live market data", data);
            setMarketData(data);
        })
    },[])

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readuserdetails`)
        .then((res) => {
            setUserDetail(res.data);
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
        .then((res) => {
            let dataArr = (res.data).filter((elem) => {
                return  elem.status === "Active"
            })
            detailArr = dataArr;
            setTradeData(dataArr)
        }).catch((err)=>{
            return new Error(err);
        })
        
        firstDateSplit = (firstDate).split("-");
        // firstDate = `${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`
        // console.log(firstDate);
        let secondDateSplit = (secondDate).split("-");
        // secondDate = `${secondDateSplit[0]}-${secondDateSplit[1]}-${secondDateSplit[2]}`
        // console.log(firstDate ,secondDate);
        // console.log(firstDate < secondDate);
    
        if(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate && noRender.current){
            while(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate){
                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` , secondDate)
                let newObj = {};
                axios.get(`${baseUrl}api/v1/readmocktradecompanypariculardate/${`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`}`)
                .then((res)=>{
                    newObj = pnlCalculation(res.data);
    
                    console.log(newObj);
    
                    detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                    
                    transactionCost = 0;
                    totalPnl = 0;
                    numberOfTrade = 0;
                    lotUsed = 0;
                
                    console.log(detailPnl);
    
                    setDetailPnl(detailPnl)
                }).catch((err)=>{
                    return new Error(err);
                })
    
    
    
                if((firstDateSplit[2]) < 9){
                    (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                }
                else if((firstDateSplit[2]) === 31){
                    (firstDateSplit[2]) = `01`;
                    
                    console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                    if((firstDateSplit[1]) < 9){
                        (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                    }
                    else if((firstDateSplit[1]) === 13){
                        (firstDateSplit[1]) = `01`;
                        (firstDateSplit[0]) = Number(firstDateSplit[0])+ 1;
                    }else{
                        (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                    }
                }else{
                    (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                }
                
            }
        }

    }, [getDetails, detailPnlArr])


    useEffect(() => {
        return () => {
            console.log('closing');
            socket.close();
        }
    }, [])


    function firstDateChange(e){
        e.preventDefault();
        if((((e.target.value) > secondDate) && secondDate)){
            window.alert("Date range is not valid")
            return;
        }
        noRender.current = false;
        console.log(userDetail)
        firstDateSplit = (e.target.value).split("-");
        firstDate = `${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`
        setFirstDate(firstDate);
        console.log(firstDate);
        let secondDateSplit = (secondDate).split("-");
        secondDate = `${secondDateSplit[0]}-${secondDateSplit[1]}-${secondDateSplit[2]}`
        setSecondDate(secondDate);
        console.log(firstDate ,secondDate);
        console.log(firstDate < secondDate);


        if(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate){
            while(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate){
                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` , secondDate)
                let newObj = {};
                axios.get(`${baseUrl}api/v1/readmocktradecompanypariculardate/${`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`}`)
                .then((res)=>{
                    newObj = pnlCalculation(res.data);

                    console.log(newObj);

                    detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                    
                    transactionCost = 0;
                    totalPnl = 0;
                    numberOfTrade = 0;
                    lotUsed = 0;
                
                    console.log(detailPnl);

                    setDetailPnl(detailPnl)
                }).catch((err)=>{
                    return new Error(err);
                })



                if((firstDateSplit[2]) < 9){
                    (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                }
                else if((firstDateSplit[2]) === 31){
                    (firstDateSplit[2]) = `01`;
                    
                    console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                    if((firstDateSplit[1]) < 9){
                        (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                    }
                    else if((firstDateSplit[1]) === 13){
                        (firstDateSplit[1]) = `01`;
                        (firstDateSplit[0]) = Number(firstDateSplit[0])+ 1;
                    }else{
                        (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                    }
                }else{
                    (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                }
                
            }
        } 
      console.log("after sorting", detailPnlArr);

    }
    
    function secondDateChange(e){
        e.preventDefault();
        if(((firstDate > e.target.value) && firstDate)){
            window.alert("Date range is not valid")
            return;
        }
        noRender.current = false;
        console.log(userDetail)
        firstDateSplit = (firstDate).split("-");
        firstDate = `${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`
        setFirstDate(firstDate);
        console.log(firstDate);
        let secondDateSplit = (e.target.value).split("-");
        secondDate = `${secondDateSplit[0]}-${secondDateSplit[1]}-${secondDateSplit[2]}`
        setSecondDate(secondDate);

        console.log(firstDate ,secondDate);
        console.log(firstDate < secondDate);
            if(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate){
                while(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate){
                    console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` , secondDate)

                    axios.get(`${baseUrl}api/v1/readmocktradecompanypariculardate/${`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`}`)
                    .then((res)=>{
                        let newObj = pnlCalculation(res.data);

                        console.log(newObj);
                        detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                        
                        transactionCost = 0;
                        totalPnl = 0;
                        numberOfTrade = 0;
                        lotUsed = 0;
                    
                        console.log(detailPnl);
                        setDetailPnl(detailPnl)
                    }).catch((err)=>{
                        return new Error(err);
                    })

 
                    if((firstDateSplit[2]) < 9){
                        (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                    }
                    else if((firstDateSplit[2]) === 31){
                        (firstDateSplit[2]) = `01`;
                        
                        console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                        if((firstDateSplit[1]) < 9){
                            (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                        }
                        else if((firstDateSplit[1]) === 13){
                            (firstDateSplit[1]) = `01`;
                            (firstDateSplit[0]) = Number(firstDateSplit[0])+ 1;
                        }else{
                            (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                        }
                    }else{
                        (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                    }
                }
            } 
        console.log(detailPnl);
    }


    function pnlCalculation(data){
        let hash = new Map();

        for(let i = data.length-1; i >= 0 ; i--){
            numberOfTrade += 1;
            transactionCost += Number(data[i].brokerage);
            if(hash.has(data[i].symbol)){
                let obj = hash.get(data[i].symbol);
                if(data[i].buyOrSell === "BUY"){
                    if(obj.totalBuy === undefined || obj.totalBuyLot === undefined){
                        obj.totalBuy = Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalBuyLot = (Number(data[i].Quantity))
                    } else{
                        obj.totalBuy = obj.totalBuy + Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalBuyLot = obj.totalBuyLot + (Number(data[i].Quantity)) 
                    }

                } if(data[i].buyOrSell === "SELL"){
                    if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                        obj.totalSell = Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalSellLot = (Number(data[i].Quantity)) 
                    } else{

                        obj.totalSell = obj.totalSell + Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalSellLot = obj.totalSellLot + (Number(data[i].Quantity)) 
                    }

                }
            }  else{
                if(data[i].buyOrSell === "BUY"){
                    hash.set(data[i].symbol, {
                        totalBuy : Number(data[i].average_price) * (Number(data[i].Quantity)),
                        totalBuyLot : (Number(data[i].Quantity)) ,
                        totalSell: 0,
                        totalSellLot: 0,
                        symbol: data[i].symbol,
                        Product: data[i].Product,
                        name: data[0].createdBy,
                        date: ((data[0].order_timestamp).split(" "))[0]
                    })
                }if(data[i].buyOrSell === "SELL"){
                    hash.set(data[i].symbol, {
                        totalSell : Number(data[i].average_price) * (Number(data[i].Quantity)),
                        totalSellLot : (Number(data[i].Quantity)) ,
                        totalBuy : 0,
                        totalBuyLot: 0,
                        symbol: data[i].symbol,
                        Product: data[i].Product,
                        name: data[0].createdBy,
                        date: ((data[0].order_timestamp).split(" "))[0]
                    })
                }
            }
        }

        let overallPnl = [];
        for (let value of hash.values()){
            overallPnl.push(value);
        }
        let liveDetailsArr = [];
        overallPnl.map((elem)=>{
            tradeData.map((element)=>{
                if(element.symbol === elem.symbol){
                    marketData.map((subElem)=>{
                        if(subElem !== undefined && subElem.instrument_token === element.instrumentToken){
                            liveDetailsArr.push(subElem)
                        }
                    })
                }
            })
        })

        console.log(liveDetailsArr)
        overallPnl.map((elem, index)=>{
            if(selectUserState === "All user"){
                name = "All User"
            }else{
                name = elem.name;
            }
                if(elem.totalBuyLot+elem.totalSellLot === 0){
                    totalPnl += -(elem.totalBuy+elem.totalSell)
                }else{
                    totalPnl += (-(elem.totalBuy+elem.totalSell-(elem.totalBuyLot+elem.totalSellLot)*liveDetailsArr[index]?.last_price))

                }
            
            console.log( liveDetailsArr[index]?.last_price)
            console.log(elem.totalBuy,elem.totalSell,elem.totalBuyLot,elem.totalSellLot, liveDetailsArr[index]?.last_price)
            lotUsed += Math.abs(elem.totalBuyLot) + Math.abs(elem.totalSellLot);
        })
        let date = (overallPnl[0].date).split("-");
        let newObj = {
            brokerage: transactionCost,
            pnl: totalPnl,
            name: name,
            numberOfTrade: numberOfTrade,
            lotUsed: lotUsed,
            date: `${date[2]}-${date[1]}-${date[0]}`
        }

        return newObj;
    }
 



    (detailPnlArr).sort((a, b)=> {
        console.log(a, b)
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
    })

    detailPnlArr.map((elem)=>{
        if(elem.brokerage){
            allBrokerage = allBrokerage + Number(elem.brokerage);
        }

        if(elem.pnl){
            allGross = allGross + Number(elem.pnl);
        }

        allNet =  (allGross - allBrokerage);
        // console.log(detailPnlArr, allBrokerage, allGross, allNet)

        let obj = {
            allBrokerage: allBrokerage,
            allGross: allGross,
            allNet: allNet
        }
        // console.log(obj)
        totalArr.push(obj);
    })


    console.log(detailPnlArr, totalArr)

    return (
        <div>
            <div className="main_Container">
                <div className="right_side">
                    <div className="rightside_maindiv">
                        <div className={Styles.main_dateSelData}>
                            <div className={Styles.form_div}>
                                <form action="">
                                    <label htmlFor="" className={Styles.formLable}>Start Date</label>
                                    <input type="date" value={firstDate} className={Styles.formInput} onChange={(e)=>{firstDateChange(e)}}/>
                                    <label htmlFor=""  className={Styles.formLable}>End Date</label>
                                    <input type="date" value={secondDate} className={Styles.formInput} onChange={(e)=>{secondDateChange(e)}}/>

                                </form>
                            </div>
                            <div className={Styles.btn_div}>
                                <span className={`${Styles.formLable}`}>Gross P&L</span>
                                <input style={allGross> 0.00 ? { color: "green"}:  allGross === 0.00 ? { color: "grey"} : { color: "red"}   } type="text" value={allGross >0.00 ? "+₹" + (allGross.toFixed(2)): allGross=== 0? "" :"-₹" + ((-(allGross)).toFixed(2))} className={`${Styles.formInput} ${Styles.formInput1}`}/>
                                <span className={Styles.formLable}>Transaction Cost </span>
                                <input type="text" value={ allBrokerage ===0? " " : "₹" + (allBrokerage.toFixed(2))} className={`${Styles.formInput} ${Styles.formInput1}`} />
                                <span className={Styles.formLable}>Net P&L</span>
                                <input style={allNet>0.00 ? { color: "green"}: allBrokerage===0.00 ? { color: "grey"}: { color: "red"}} type="text" value={allNet >0.00 ? "+₹" + (allNet.toFixed(2)): allNet===0? " " : "-₹" + ((-(allNet)).toFixed(2))} className={`${Styles.formInput} ${Styles.formInput1}`} />
                                
                                <button className={Styles.formButton}> Download Report</button>
                            </div> 
                        </div>
                        <div className={Styles.grid_1}>
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                    <th className="grid2_th">Date</th>
                                    <th className="grid2_th">Gross(C-P&L)</th>
                                    <th className="grid2_th">Tran. Cost(C)</th>
                                    <th className="grid2_th">Net(C-P&L)</th>
                                    <th className="grid2_th">Gross(T-P&L)</th>
                                    <th className="grid2_th">Tran. Cost(T)</th>
                                    <th className="grid2_th">Net(T-P&L)</th>
                                    <th className="grid2_th"># of Traders</th>
                                    <th className="grid2_th"># of Trades</th>
                                    <th className="grid2_th">Details</th>
                                    {/* <th className="grid2_th">{detailPnl[0].name}</th> */}
                                </tr>
                                {

                                detailPnlArr.map((elem)=>{
                                    let data = (elem.date).split("-");
                                    return(
                                        <>
                                        {elem.name &&
                                        <tr>
                                            <td className="grid2_td">{`${data[2]}-${data[1]}-${data[0]}`}</td>
                                            {!elem.pnl ?
                                            <td className="grid2_td" style={elem.pnl>=0.00 ? { color: "green"}:  { color: "red"}}>{elem.pnl >0.00 ? "+₹" + (elem.pnl): "-₹" + (-(elem.pnl)) }</td>
                                            :
                                            <td className="grid2_td" style={elem.pnl>=0.00 ? { color: "green"}:  { color: "red"}}>{elem.pnl >0.00 ? "+₹" + (elem.pnl.toFixed(2)): "-₹" + ((-(elem.pnl)).toFixed(2)) }</td>}
                                            {!elem.brokerage ?
                                            <td className="grid2_td" >{elem.brokerage >0.00 ? "₹" + (elem.brokerage) : "₹" + 0.00}</td>
                                            :
                                            <td className="grid2_td" >{elem.brokerage >0.00 ? "₹" + (elem.brokerage.toFixed(2)): "₹" + (-(elem.brokerage).toFixed(2)) }</td>}
                                            {(elem.pnl - elem.brokerage) !== undefined &&
                                            <td className="grid2_td" style={(elem.pnl - elem.brokerage)>=0.00 ? { color: "green"}:  { color: "red"}}> {elem.pnl - elem.brokerage > 0.00 ? "+₹" + (elem.pnl - elem.brokerage).toFixed(2): "-₹" + ((-(elem.pnl - elem.brokerage)).toFixed(2))}</td>}
                                            <td className="grid2_td">{elem.numberOfTrade}</td>
                                            <td className="grid2_td">{elem.lotUsed}</td>
                                            <td className="grid2_td">{elem.lotUsed}</td>
                                            <td className="grid2_td">{elem.lotUsed}</td>
                                            <td className="grid2_td">{elem.lotUsed}</td>
                                            <td className="grid2_td"><button>Details</button></td>

                                        </tr>}
                                        </>
                                    )
                                })
                            }
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


