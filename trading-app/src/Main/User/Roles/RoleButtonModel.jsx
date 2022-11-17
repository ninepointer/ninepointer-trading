import React, { useState } from "react";
import "./RoleButtonModel.css";
import { useEffect } from "react";
import uniqid from "uniqid";
import axios from "axios";

export default function RoleButtonModel() {
  let uId = uniqid();
  let date = new Date();
  let createdOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  let lastModified = createdOn;
  let createdBy = "prateek"

  const [modal, setModal] = useState(false);
  const [formstate, setformstate] = useState({
    roleName:"",
    instruments:"",
    tradingAccount:"",
    APIParameters:"",
    users:"",
    algoBox:"",
    reports:"",
});

async function formbtn(e) {
    e.preventDefault();
    setformstate(formstate);
    console.log(formstate)

    const {roleName, instruments, tradingAccount, APIParameters, users, algoBox, reports} = formstate;

    const res = await fetch("http://localhost:5000/everyonerole", {
        method: "POST",
        headers: {
            "content-type" : "application/json"
        },
        body: JSON.stringify({
          roleName, instruments, tradingAccount, APIParameters, users, algoBox, reports, uId, createdBy, createdOn, lastModified
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
    // reRender ? setReRender(false) : setReRender(true)

    setModal(!modal);

}
  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      <button onClick={toggleModal} className="Ac_btn">Create Role</button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
          <form className="UserMainFormModel">
            <label className="userModelform" htmlFor="">Role Name</label>
            <input type="text" className="userModelforminput" onChange={(e) => { { formstate.roleName = (e.target.value).toUpperCase() } }}/>
            <label className="userModelform" htmlFor="">Instruments</label>
            <input type="text" className="userModelforminput" onChange={(e) => { { formstate.instruments = e.target.value.toUpperCase() } }}/>
            <label htmlFor="" className="userModelform">Trading Account</label>
            <input type="text" className="userModelforminput" onChange={(e) => { { formstate.tradingAccount = e.target.value } }} />
            <label htmlFor="" className="userModelform">API Parameters</label>
            <input type="text" className="userModelforminput" onChange={(e) => { { formstate.APIParameters = e.target.value } }} />
            <label htmlFor="" className="userModelform">Users</label>
            <input type="text" className="userModelforminput" onChange={(e) => { { formstate.users = e.target.value } }} />
            <label htmlFor="" className="userModelform">AlgoBox</label>
            <input type="text" className="userModelforminput" onChange={(e) => { { formstate.algoBox = e.target.value } }} />
            <label htmlFor="" className="userModelform">Reports</label>
            <input type="text" className="userModelforminput" onChange={(e) => { { formstate.reports = e.target.value } }} />
        </form>
        <button className="ACform_tbn userCancelbtn" onClick={formbtn}>OK</button> <button className="bsButton1_cancel userCancelbtn" onClick={toggleModal}>CLOSE</button>
           
          </div>
        </div>
      )}
    </>
  );
}