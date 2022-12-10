import React, { useContext, useState } from "react";
import { userContext } from "../../AuthContext";
import Styles from "./AddUser.module.css";
import UserList from "./UserList";



export default function AddUser({algoName}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
    let date = new Date();
    const getDetails = useContext(userContext);
    let modifiedOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    let modifiedBy = getDetails.userDetails.name;
    
    const [permissionData, setPermissionData] = useState([]);
    const [modal, setModal] = useState(false);
    const [addUser, setAddUser] = useState([]);
    const toggleModal = () => {
        setModal(!modal);
    };

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }
    let permissionDataUpdated = permissionData.filter((elem)=>{
        return elem.algoName === algoName;
    })

    let newData = addUser.concat(permissionDataUpdated);
    console.log("this is add usere", newData);

    const[algoData, setAlgoData] = useState({
        name:"",
        tradingEnable:"",
        realTrading:"",
    });

    async function formbtn(e, id) {
        e.preventDefault();
        setModal(!modal);
        let flag = true;
        let newDataUpdated = newData.filter((elem)=>{
            return elem._id === id
        })
        algoData.name=newDataUpdated[0].userName;
        setAlgoData(algoData);
        console.log(algoData);

        if(permissionDataUpdated.length){
            for(let elem of permissionDataUpdated){
                if(elem.userId === newDataUpdated[0].userId){
                    console.log("put request");
                    flag = false;
                }
            }
            if(flag){
                console.log("post request");
            }
        } else{
            console.log("post request");
        }
    }
    async function deletehandler(e,id){
        // let newDataUpdated = newData.filter((elem)=>{
        //     return elem._id === id
        // })
        // setAlgoData(algoData);
        // console.log(algoData);  
        // console.log(newDataUpdated);

        // const res = await fetch(`${baseUrl}api/v1/readtradingAlgo/${id}`, {
        //     method: "DELETE",
        // });

        // const dataResp = await res.json();
        // console.log(dataResp);
        // if (dataResp.status === 422 || dataResp.error || !dataResp) {
        //     window.alert(dataResp.error);
        //     console.log("Failed to Delete");
        // } else {
        //     console.log(dataResp);
        //     window.alert("Delete succesfull");
        //     console.log("Delete succesfull");
        // }
    }

    return (
        <>
            <button onClick={toggleModal} className={Styles.addUserBtn}>ADD USER</button>

            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className={Styles.modalContent}>
                        <UserList addUser={addUser} setAddUser={setAddUser} setPermissionData={setPermissionData}/>
                        <table className={Styles.main_instrument_table}>
                            <tr className={Styles.addUser_tr}>
                                <th className={Styles.addUser_th} >User Name</th>
                                <th className={Styles.addUser_th}>Enable Trading</th>
                                <th className={Styles.addUser_th}>Real Trading</th>
                                <th className={Styles.addUser_th}>Action</th>
                            </tr>
                            {newData.map((elem)=>{
                                return(
                                    <tr key={elem._id} className={Styles.addUser_tr}>
                                        <td className={Styles.addUser_td} value={elem.userName}>{elem.userName}</td>
                                        <td className={Styles.addUser_td}>
                                            <select name="" id="" className={Styles.addUser_select} onChange={(e)=>{{algoData.tradingEnable=e.target.value}}}>
                                                <option value=""></option>
                                                <option value="True">True</option>
                                                <option value="False">False</option>
                                            </select>
                                        </td>
                                        <td className={Styles.addUser_td}>
                                            <select name="" id="" className={Styles.addUser_select} onChange={(e)=>{{algoData.realTrading=e.target.value}}}>
                                                <option value=""></option>
                                                <option value="True">True</option>
                                                <option value="False">False</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button className={Styles.ACform_tbn} onClick={(e)=>formbtn(e, elem._id)}>OK</button>
                                            <button className={Styles.ACform_tbn_Delete} onClick={(e)=>deletehandler((e, elem._id))}>DELETE</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}