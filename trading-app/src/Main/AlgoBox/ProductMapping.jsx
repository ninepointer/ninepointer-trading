import React,{useState, useEffect} from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import uniqid from "uniqid";
import axios from "axios"


function ProductMapping(){
    let uId = uniqid();
    let date = new Date();
    let createdOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    let lastModified = createdOn;
    let createdBy = "prateek"

    const [reRender, setReRender] = useState(true);
    const [data, setData] = useState([]);
    const[formstate, setformstate] = useState({
        ProductNameIncoming: "",
        IncomingProductCode : "",
        ProductNameOutgoing : "",
        OutgoingProductCode:"",
        Status : "",
    });

    useEffect(()=>{
        axios.get("http://localhost:3000/readProductMapping")
        .then((res)=>{
            setData(res.data)
            console.log(res.data);
        })
    },[])

    async function formbtn(e){
        e.preventDefault();
        setformstate(formstate);
        console.log(formstate)

        const {ProductNameIncoming, IncomingProductCode, ProductNameOutgoing, OutgoingProductCode, Status} = formstate;

        const res = await fetch("http://localhost:5000/productMapping", {
            method: "POST",
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                ProductNameIncoming, IncomingProductCode, ProductNameOutgoing, OutgoingProductCode, Status, lastModified, uId, createdBy, createdOn
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
                        <Popup trigger={<button className="Ac_btn">Create Product Mapping</button>}>
                            <form>
                                <label className="Ac_form" htmlFor="">Product Name (Incoming)</label>
                                <input type="text" className="Ac_forminput" onChange={(e)=>{{formstate.ProductNameIncoming = e.target.value}}} />
                                <label htmlFor="" className="Ac_form">Incoming Product Code</label>
                                <input type="text" className="Ac_forminput" onChange={(e)=>{{formstate.IncomingProductCode = e.target.value}}} />
                                <label htmlFor="" className="Ac_form">Product Name (Outgoing)</label>
                                <input type="text" className="Ac_forminput" onChange={(e)=>{{formstate.ProductNameOutgoing = e.target.value}}} />
                                <label htmlFor="" className="Ac_form">Outgoing Product Code</label>
                                <input type="text" className="Ac_forminput" onChange={(e)=>{{formstate.OutgoingProductCode = e.target.value}}} />
                                <label htmlFor="" className="Ac_form">Status</label>
                                <select name="" id="" className="Ac_forminput" onChange={(e)=>{{formstate.Status = e.target.value}}}>
                                    <option value=""></option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <br />
                                <button className="ACform_tbn" onClick={formbtn}>OK</button>
                            </form>
                        </Popup>

                        <div className="grid_1">
                            <span className="grid1_span">Product Mapping</span>
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                <th className="grid2_th">Created On</th>
                                <th className="grid2_th">Product Name (Incoming)</th>
                                <th className="grid2_th">Incoming Product Code</th>
                                <th className="grid2_th">Product Name (Outgoing)</th>
                                <th className="grid2_th">Outgoing Product Code</th>
                                <th className="grid2_th">Status</th>
                            </tr>
                            {
                                data.map((elem)=>{
                                    return(
                                        <tr className="grid2_tr" key={elem.uId} >
                                            <td className="grid2_td">{elem.createdOn}</td>
                                            <td className="grid2_td">{elem.ProductNameIncoming}</td>
                                            <td className="grid2_td">{elem.IncomingProductCode}</td>
                                            <td className="grid2_td">{elem.ProductNameOutgoing}</td>
                                            <td className="grid2_td">{elem.OutgoingProductCode}</td>
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
export default ProductMapping;