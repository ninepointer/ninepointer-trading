import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom';

export default function ReportsHeader({role}) {

  return (
    <>
        <div>
            <ul className='navbar'>
                <li>
                    <NavLink to={"/main/report/"} style={({isActive}) => isActive?{backgroundColor: "white", borderRadius: "3px"} :{colbackgroundColor:'black'} }>Daily P&L Report</NavLink>
                </li>
            </ul>
           
            <Outlet/>
        </div>
    </>
  )
}