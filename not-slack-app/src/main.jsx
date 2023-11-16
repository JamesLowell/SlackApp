import React from 'react'
import ReactDOM from 'react-dom/client'
import SideBar from './SideBar'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const router = createBrowserRouter([
  {path:'messages',
  element:<SideBar/>}

])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
