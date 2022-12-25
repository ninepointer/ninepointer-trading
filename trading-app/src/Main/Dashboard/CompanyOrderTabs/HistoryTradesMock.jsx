import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import CompanyOrderPegination from "./CompanyOrderPegination/CompanyOrderPegination";


export default function HistoryTradesMock({setOrderCountHistoryCompany, orderCountHistoryCompany}){

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [data, setData] = useState([]);
    const [clickToRemove, setclickToRemove] = useState(1);
    const [skip, setSkip] = useState(0);
    let numberOfClickForRemoveNext = 0

    useEffect(()=>{

        axios.get(`${baseUrl}api/v1/readmocktradecompany`)
        .then((res)=>{

            
            setOrderCountHistoryCompany((res.data).length);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${50}`)
        .then((res)=>{

            setData(res.data);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
    },[])

    function nextData(){
        setSkip((prev)=> prev+50)
        console.log(skip)
        axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip+50}/${50}`)
        .then((res)=>{

            setData(res.data);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
        setclickToRemove((prev)=>prev+1)
    }

    function prevData(){
        setSkip((prev)=> prev-50)
        console.log(skip)
        axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip-50}/${50}`)
        .then((res)=>{

            setData(res.data);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
        setclickToRemove((prev)=>prev-1)
    }
    numberOfClickForRemoveNext = Math.ceil(((orderCountHistoryCompany))/50);
    console.log(numberOfClickForRemoveNext, clickToRemove, orderCountHistoryCompany)


    return(
        <div>
            <div className="main_Container">
                <div className="right_side">
                    <div className="rightside_maindiv">
                    <span className="grid1_span"></span>
                        <div className="grid_1">
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                    <th className="grid2_th">Timestamp</th>
                                    <th className="grid2_th">OrderID</th>
                                    <th className="grid2_th">Trader</th>
                                    <th className="grid2_th">Type</th>
                                    <th className="grid2_th">Instrument</th>
                                    <th className="grid2_th">Product</th>
                                    <th className="grid2_th">Quantity</th>
                                    <th className="grid2_th">Avg. Price</th>
                                    <th className="grid2_th">Status</th>
                                    <th className="grid2_th">AlgoName</th>
                                    <th className="grid2_th">Account</th>
                                    
                                </tr> 
                                {data.map((elem)=>{
                                    return(
                                        <tr className="grid2_tr" key={elem.guid}>
                                            <td className="grid2_td">{elem.order_timestamp}</td>
                                            <td className="grid2_td">{elem.order_id}</td>
                                            <td className="grid2_td" style={{fontWeight : 700}}>{elem.createdBy}</td>
                                            <td className="grid2_td" style={elem.buyOrSell == "BUY" ? {color : "#428BCA",backgroundColor : "#b3ccff",fontWeight : 700}:{color : "red", backgroundColor : "#ffb3b3",fontWeight : 700}}>{elem.buyOrSell}</td>
                                            <td className="grid2_td">{elem.symbol}</td>
                                            <td className="grid2_td">{elem.Product}</td>
                                            <td className="grid2_td" style={elem.Quantity > 0 ? {color : "#428BCA",backgroundColor : "#b3ccff",fontWeight : 700}:{color : "red", backgroundColor : "#ffb3b3",fontWeight : 700}}>{elem.Quantity}</td>
                                            <td className="grid2_td">₹{elem.average_price.toFixed(2)}</td>
                                            <td className="grid2_td" style={{color : "#008000",backgroundColor : "#99ff99" , fontWeight : 700}}>{elem.status}</td>
                                            <td className="grid2_td">{elem.algoBox.algoName}</td>
                                            <td className="grid2_td">{elem.placed_by}</td>
                                            
                                        </tr> 
                                    )
                                })}        
                            </table> 
                            <div className="pegination_div">
                                <button className="pegination_prev_btn" disabled={!(skip !== 0)} onClick={prevData}>Prev</button>
                                <button className="pegination_next_btn" disabled={!(numberOfClickForRemoveNext !== clickToRemove)} onClick={nextData}>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}