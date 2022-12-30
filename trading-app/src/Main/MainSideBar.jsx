import React from 'react'
import { NavLink } from 'react-router-dom'

export default function MainSideBar({name}) {
  return (
    <>
        <div className="leftsidebar">
            <div className="userSidebar_div">
                <div className="userbox"><img className="userimage" src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg" alt=""/><h6 className="username">{(name).toUpperCase()}</h6></div>
                {/* <div className="sidebar_heading">Main</div> */}
                <div className="menuheader">Analytics</div>
                <NavLink to="/main/dashboard" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/Dashboard.png")}></img><div className="menuitembar">Dashboard</div></div></NavLink>
                <NavLink to="/main/admindashboard/summary" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/admindashboard.png")}></img><div className="menuitembar">Admin Reports</div></div></NavLink>
                <div className="menuheader">Settings</div>
                <NavLink to="/main/instrument" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/instruments.png")}></img><div className="menuitembar">Instruments</div></div></NavLink>
                <NavLink to="/main/algobox" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/algo.png")}></img><div className="menuitembar">Algo Box</div></div></NavLink>
                <NavLink to="/main/tradingAccount" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/account.png")}></img><div className="menuitembar">Trading Accounts</div></div></NavLink>
                <div className="menuheader">Trader Details</div>
                <NavLink to="/main/user" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/user.png")}></img><div className="menuitembar">Users</div></div></NavLink>
                <NavLink to="/main/userfunds" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/funds.png")}></img><div className="menuitembar">Funds</div></div></NavLink>
                <div className="menuheader">Reports</div>
                <NavLink to="/main/report" style={({isActive}) => isActive?{color:'#5479FC'} :{color:'black'} }><div className="sidebar_items"><img className="linkicons" src={require("../media/reports.png")}></img><div className="menuitembar">Reports</div></div></NavLink>
                
                
            </div>
            <div >
                <div className="sidebar_item"><NavLink to={"/"}>Go Out</NavLink></div>
            </div>

        </div>
    </>
  )
}
