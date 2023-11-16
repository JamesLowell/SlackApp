import React from 'react'
import ReactDOM from 'react-dom/client'
import SideBar from './SideBar'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './LandingPage'

const router = createBrowserRouter([
  {index:'true',
  element:<LandingPage/>},
  {path:'messages',
  element:<SideBar/>}
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
