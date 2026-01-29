import React from "react";
import { Outlet } from "react-router-dom";
import { MenuNav } from "./Navigation/MenuNav";
import Navbar from "./Navbar";


export const Root = ()=>{
    
    return(
        <>
        <Navbar />
        <Outlet />

        </>
        
    )
}