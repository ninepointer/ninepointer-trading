import React, { useContext } from "react";
import { useState } from "react";
import ByModal from '../companyPosition/ByModal';
import SellModel from "../companyPosition/SellModel";
import { useEffect } from 'react';
import axios from "axios"
import RunningPnl from "../PnlParts/RunningPnl";
import ClosedPnl from "../PnlParts/ClosedPnl";
import OverallPnl from "../PnlParts/OverallPnl";
import { userContext } from "../../AuthContext";
import Styles from "../Dashboard.module.css";

function TraderPositionTable({ socket }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const setDetails = useContext(userContext);
    const getDetails = useContext(userContext);
    const [reRender, setReRender] = useState(true);
    const [tradeData, setTradeData] = useState([]);
    const [data, setData]  = useState([]);
    const [marketData, setMarketData] = useState([]);

    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // let fake_date = "2022-12-16"
    let fake_date = "16-12-2022";

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/readmocktradeuserDate/${getDetails.userDetails.email}`)
        .then((res) => {
            // let data = (res.data).filter((elem)=>{
            //     return elem.order_timestamp.includes(todayDate) && elem.status === "COMPLETE";
            // })
            setData(res.data);
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/getliveprice`)
            .then((res) => {
                console.log("live price data", res)
                setMarketData(res.data)
            }).catch((err)=>{
                
                return new Error(err);
            })

        axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
            .then((res) => {
                let dataArr = (res.data).filter((elem) => {
                    return  elem.status === "Active"
                })
                setTradeData(dataArr)
                // setDetails.setTradeData(dataArr);
            }).catch((err)=>{
                
                return new Error(err);
            })
        console.log("hii");

        // axios.get(`${baseUrl}api/v1/ws`)
        // .then((res)=>{
        //     console.log("vijay", (res.data)[0].last_price);
        // }).catch((err)=>{
        //     window.alert("Server Down");
        //     return new Error(err);
        // })
        
        socket.on("tick",(data)=>{
            console.log("this is live market data", data);
            setMarketData(data);
            // setDetails.setMarketData(data);
        })
        
        console.log(marketData);
        console.log(tradeData);
       
    },[getDetails, reRender])

    useEffect(()=>{
        return ()=>{
            console.log('closing');
            socket.close();
        }
    },[])
    return(
        <div>
            <div className="main_Container">
                <div className="right_side">
                    <div className="rightside_maindiv">
                    
                    <div className={Styles.gridheader}>
                    <div className={Styles.box}>
                    <span class="btnnew bg-gradient-secondary mt-0 w-100">Instruments Details</span>
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                    <th className="grid2_th">Trading Date</th>
                                    <th className="grid2_th">Contract Date</th>
                                    <th className="grid2_th"> Symbol</th>
                                    <th className="grid2_th">Instrument</th>
                                    <th className="grid2_th">LTP</th>
                                    <th className="grid2_th">Change(%)</th>
                                    <th className="grid2_th">Action</th>
                                </tr>

                                {tradeData.map((elem, index)=>{
                                let updatedMarketData = marketData.filter((subElem)=>{
                                    return elem.instrumentToken === subElem.instrument_token;
                                })
                                // setMarketData(updatedMarketData)
                                return(
                                        <tr className="grid2_tr" key={elem.uId}>
                                            <td className="grid2_td">{todayDate}</td>
                                            <td className="grid2_td">{elem.contractDate}</td>
                                            <td className="grid2_td">{elem.symbol}</td>
                                            <td className="grid2_td">{elem.instrument}</td>
                                            {(updatedMarketData[0]?.last_price) === undefined ?
                                            <td className="grid2_td">???{(updatedMarketData[0]?.last_price)}</td>
                                            :
                                            <td className="grid2_td">???{(updatedMarketData[0]?.last_price).toFixed(2)}</td>}
                                            {console.log(updatedMarketData[0], updatedMarketData[0]?.change)}
                                            {(updatedMarketData[0]?.change === undefined) ? 
                                            <td className="grid2_td">{(Math.abs((updatedMarketData[0]?.last_price-updatedMarketData[0]?.average_price)/updatedMarketData[0]?.average_price)).toFixed(2)}%</td>
                                            :
                                            <td className="grid2_td">{updatedMarketData[0]?.change.toFixed(2)}%</td>}

                                            <td className="grid2_th companyPosition_BSbtn2"><div className="companyPosition_BSbtn">
                                            <ByModal symbol={elem.instrument} ltp={(updatedMarketData[0]?.last_price)} maxlot={(elem.maxLot)} lotsize={(elem.lotSize)} Render={{setReRender, reRender}} marketData={marketData} uIdProps={elem.uId} />
                                            <SellModel symbol={elem.instrument} ltp={(updatedMarketData[0]?.last_price)} maxlot={(elem.maxLot)} lotsize={(elem.lotSize)} Render={{setReRender, reRender}} marketData={marketData} uIdProps={elem.uId}  /></div></td>
                                        </tr>
                                    
                                    )
                                })} 
                            </table>
                            </div>
                        </div>

                        <div className={Styles.gridheader}>
                    <div className={Styles.box}>
                    {/* btnnew bg-gradient-success mt-0 w-100 */}
                    <div className=" btn_one" >Margin Details</div>
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                <th className="grid2_th">Opening Balance</th>
                                    <th className="grid2_th">Available Margin</th>
                                    <th className="grid2_th">Used Margin</th>
                                    <th className="grid2_th">Available Cash</th>
                                    <th className="grid2_th">Total Credits</th>
                                    
                                </tr>
                                <tr className="grid2_td">
                                    <td>Coming Soon</td>
                                    <td>Coming Soon</td>
                                    <td>Coming Soon</td>
                                    <td>Coming Soon</td>
                                    <td>Coming Soon</td>
                                 </tr>
                                

                                {/* {tradeData.map((elem, index)=>{
                                let updatedMarketData = marketData.filter((subElem)=>{
                                    return elem.instrumentToken === subElem.instrument_token;
                                })
                                // setMarketData(updatedMarketData)
                                return(
                                        <tr className="grid2_tr">
                                            <td className="grid2_td">NA</td>
                                            <td className="grid2_td">NA</td>
                                            <td className="grid2_td">NA</td>
                                            <td className="grid2_td">NA</td>
                                        </tr>
                                    
                                    )
                                })}  */}
                            </table>
                            </div>
                        </div>

                        

                        <span className={Styles.gridheader}>
                            <div className={Styles.box}>
                            {/* btnnew bg-gradient-primary mt-0 w-100 */}
                                <div class="btn_two">Overall P&L</div>
                            <OverallPnl marketData={marketData} tradeData={tradeData} data={data}/>
                                </div></span>
                        {/* <span className="grid2_span">Running PNL-Trader</span>
                        <div className="grid_2">
                            <RunningPnl marketData={marketData} tradeData={tradeData} data={data}/>
                        </div>
                        <span className="grid2_span">Closed Trades PNL-Trader</span>
                        <div className="grid_2">
                                <ClosedPnl marketData={marketData} tradeData={tradeData} data={data}/>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TraderPositionTable;

