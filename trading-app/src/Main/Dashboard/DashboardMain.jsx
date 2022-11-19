import React, { useContext } from "react";
import { useEffect } from "react";
import {NavLink} from "react-router-dom";
import { userContext } from "../AuthContext";
import DashboardHeader from "./DashboardHeader";

function DashboardMain(){
    const getDetails = useContext(userContext);
    useEffect(()=>{
        
        console.log(getDetails)
    }, [])

    return(
        <>
            <div className="User_header">
            <h1 className="header_para">Hello Admin! Welcome Back</h1>
                <button className="logo_btn" >NINEPOINTER</button>
            </div>
            <DashboardHeader role = {getDetails.userDetails.role}/>
        </>
    )
}
export default DashboardMain;