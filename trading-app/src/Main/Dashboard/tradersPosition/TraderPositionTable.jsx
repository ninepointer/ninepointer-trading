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

function TraderPositionTable({ socket }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const getDetails = useContext(userContext);
    const [tradeData, setTradeData] = useState([]);
    const [data, setData]  = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [permission, setPermission] = useState([]);

    let date = new Date();
    let todayDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    let fake_date = "1-12-2022"

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/readmocktradeuser`)
        .then((res) => {
            let data = (res.data).filter((elem)=>{
                return elem.order_timestamp.includes(todayDate) && elem.status === "COMPLETE" && elem.userId === getDetails.userDetails.email;
            })
            setData(data);
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
            }).catch((err)=>{
                
                return new Error(err);
            })
        console.log("hii");

        axios.get(`${baseUrl}api/v1/ws`)
        .then((res)=>{
            console.log("vijay", (res.data)[0].last_price);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
        
        socket.on("tick",(data)=>{
            console.log(data);
            setMarketData(data);
        })
        
        console.log(marketData);
        console.log(tradeData);
       
    },[getDetails])

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
                        <div className="grid_1">
                            <span className="grid1_span">Instruments Details</span>
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                    <th className="grid2_th">Trading Date</th>
                                    <th className="grid2_th">Instrument</th>
                                    <th className="grid2_th">LTP</th>
                                    <th className="grid2_th">%Change</th>
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
                                            <td className="grid2_td">{elem.symbol}</td>
                                            <td className="grid2_td">{updatedMarketData[0]?.last_price}</td>

                                            {console.log(updatedMarketData[0], updatedMarketData[0]?.change)}
                                            {(updatedMarketData[0]?.change === undefined) ? 
                                            <td className="grid2_td">{updatedMarketData[0]?.change}</td>
                                            :
                                            <td className="grid2_td">{updatedMarketData[0]?.change.toFixed(2)}</td>}

                                            <td className="grid2_th companyPosition_BSbtn2"><div className="companyPosition_BSbtn">
                                            <ByModal marketData={marketData} uIdProps={elem.uId} />
                                            <SellModel marketData={marketData} uIdProps={elem.uId}  /></div></td>
                                        </tr>
                                    )
                                })} 
                            </table>
                        </div>
                        <div className="grid_2">
                            <span className="grid2_span">Overall PNL-Trader</span>
                                <OverallPnl marketData={marketData} tradeData={tradeData} data={data}/>
                        </div>
                        <div className="grid_2">
                            <span className="grid2_span">Running PNL-Trader</span>
                            <RunningPnl marketData={marketData} tradeData={tradeData} data={data}/>
                        </div>
                        <div className="grid_2">
                            <span className="grid2_span">Closed Trades PNL-Trader</span>
                                <ClosedPnl marketData={marketData} tradeData={tradeData} data={data}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TraderPositionTable;