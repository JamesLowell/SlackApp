import React from 'react'
import SideBar from './SideBar'
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function SlackApp() {
  return (
    <main style={{display: 'flex'}}>
        <SideBar />
        <Outlet />
        <ToastContainer />
        </main>
  )
}
