import React from "react";
import './CompanyPosition.css';
import { useEffect } from 'react';
import { io } from "socket.io-client";
import CompanyPositionTable from "./CompanyPositionTable";

function CompanyPosition() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let socket;
    try{
        // socket = io.connect(`${baseUrl}api/v1/socketconnection`)
        socket = io.connect("http://localhost:9000/")
    } catch(err){
        throw new Error(err);
    }
    
    useEffect(()=>{

        console.log(socket);
        socket.on("connect", ()=>{
            console.log(socket.id);
            socket.emit("hi",true)
        })
        socket.on("noToken", (data)=>{
            console.log("no token");
            window.alert(data);
        })
        socket.on("wrongToken", (data)=>{
            console.log("wrong Token");
            window.alert(data);
        })

    }, []);

    return (
        <div>
            <CompanyPositionTable socket={socket}/>
        </div>
    )
}
export default CompanyPosition;