import React,{useState, useEffect} from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import uniqid from "uniqid";
import axios from "axios"

function TradingAlgo(){
    let uId = uniqid();
    let date = new Date();
    let createdOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    let lastModified = createdOn;
    let createdBy = "prateek"

    const [reRender, setReRender] = useState(true);
    const [data, setData] = useState([]);
    const[formstate, setformstate] = useState({
        algoName: "",
        transactionChange : "",
        instrumentChange : "",
        status : "",
        exchangeChange:"",
        lotMultipler:"",
        productChange : "",
        tradingAccount:""
    });

    useEffect(()=>{
        axios.get("http://localhost:3000/readtradingAlgo")
        .then((res)=>{
            setData(res.data)
            console.log(res.data);
        })
    },[])

    async function formbtn(e){
        e.preventDefault();
        setformstate(formstate);
        console.log(formstate)

        const {algoName, transactionChange, instrumentChange, status, exchangeChange, lotMultipler, productChange, tradingAccount} = formstate;

        const res = await fetch("http://localhost:5000/tradingalgo", {
            method: "POST",
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                algoName, transactionChange, instrumentChange, status, exchangeChange, lotMultipler, productChange, tradingAccount, lastModified, uId, createdBy, createdOn
            })
        });
        
        const data = await res.json();
        console.log(data);
        if(data.status === 422 || data.error || !data){
            window.alert(data.error);
            console.log("invalid entry");
        }else{
            window.alert("entry succesfull");
            console.log("entry succesfull");
        }
        reRender ? setReRender(false) : setReRender(true)
    }


    return(
        <div>
            <div className="main_Container">
                <div className="right_side">
                    <div className="rightside_maindiv">
                        <Popup trigger={<button className="Ac_btn">Create Trading Algo</button>}>
                            <form>
                                <label className="Ac_form" htmlFor="">Algo Name</label>
                                <input type="text" className="Ac_forminput" onChange={(e)=>{{formstate.algoName = e.target.value}}} />
                                <label htmlFor="" className="Ac_form">Transaction Change</label>
                                <select name="" id="" className="Ac_forminput" onChange={(e)=>{{formstate.transactionChange = e.target.value}}}>
                                    <option value=""></option>
                                    <option value="TRUE">TRUE</option>
                                    <option value="FALSE">FALSE</option>
                                </select>
                                <label htmlFor="" className="Ac_form">Instrument Change</label>
                                <select name="" id="" className="Ac_forminput" onChange={(e)=>{{formstate.instrumentChange = e.target.value}}}>
                                    <option value=""></option>
                                    <option value="TRUE">TRUE</option>
                                    <option value="FALSE">FALSE</option>
                                </select>
                                <label htmlFor="" className="Ac_form">Exchange Change</label>
                                <select name="" id="" className="Ac_forminput" onChange={(e)=>{{formstate.exchangeChange = e.target.value}}}>
                                    <option value=""></option>
                                    <option value="TRUE">TRUE</option>
                                    <option value="FALSE">FALSE</option>
                                </select>
                                <label htmlFor="" className="Ac_form">Product Change</label>
                                <select name="" id="" className="Ac_forminput" onChange={(e)=>{{formstate.productChange = e.target.value}}}>
                                    <option value=""></option>
                                    <option value="TRUE">TRUE</option>
                                    <option value="FALSE">FALSE</option>
                                </select>
                                <label htmlFor="" className="Ac_form">Lot Multipler</label>
                                <input type="text" className="Ac_forminput" onChange={(e)=>{{formstate.lotMultipler = e.target.value}}} />
                                <label htmlFor="" className="Ac_form">Trading Account</label>
                                <input type="text" className="Ac_forminput" onChange={(e)=>{{formstate.tradingAccount = e.target.value}}} />
                                <label htmlFor="" className="Ac_form">Status</label>
                                <select name="" id="" className="Ac_forminput" onChange={(e)=>{{formstate.status = e.target.value}}}>
                                    <option value=""></option>
                                    <option value="Active">Active</option>
                                    <option value="InActive">InActive</option>
                                </select>
                                <br />
                                <button className="ACform_tbn" onClick={formbtn}>OK</button>
                            </form>
                        </Popup>

                        <div className="grid_1">
                            <span className="grid1_span">Trading Algos</span>
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                    <th className="grid2_th">Created On</th>
                                    <th className="grid2_th">Algo Name</th>
                                    <th className="grid2_th">Transaction Change</th>
                                    <th className="grid2_th">Instrument Change</th>
                                    <th className="grid2_th">Exchange Change</th>
                                    <th className="grid2_th">Product Change</th>
                                    <th className="grid2_th">Lot Multipler</th>
                                    <th className="grid2_th">Trading Account</th>
                                    <th className="grid2_th">Status</th>
                                </tr>
                            {
                                data.map((elem)=>{
                                    return(
                                        <tr className="grid2_tr" key={elem.uId}>
                                            <td className="grid2_td">{elem.createdOn}</td>
                                            <td className="grid2_td">{elem.algoName}</td>
                                            <td className="grid2_td">{elem.transactionChange}</td>
                                            <td className="grid2_td">{elem.instrumentChange}</td>
                                            <td className="grid2_td">{elem.exchangeChange}</td>
                                            <td className="grid2_td">{elem.productChange}</td>
                                            <td className="grid2_td">{elem.lotMultipler}</td>
                                            <td className="grid2_td">{elem.tradingAccount}</td>
                                            <td className="grid2_td">{elem.status}</td>
                                        </tr>
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
export default TradingAlgo;