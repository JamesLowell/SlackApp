import React from 'react'
import ReactDOM from 'react-dom/client'
import SideBar from './pages/MainPage/components/SideBar'
import './assets/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage/components/LandingPage'
import LoginForm from './pages/LandingPage/components/LoginForm'
import RegisterForm from './pages/LandingPage/components/RegisterForm'
import SlackApp from './pages/MainPage/SlackApp'
import Home from './pages/MainPage/components/Home'
import Conversation from './pages/MainPage/components/Conversation'
import SlackApi from "./utils/SlackApi";
import 'bootstrap/dist/css/bootstrap.min.css';
import ChannelConversation from './pages/MainPage/components/ChannelConversation'
import ProtectedRoute from './utils/ProtectedRoute'

const router = createBrowserRouter([
  {index:'true',
  element:<LandingPage/>},
  {path:'log-in',
  element:<LoginForm/>},
  {path:'register',
  element:<RegisterForm/>},
  {path:'messages',
  element:<ProtectedRoute><SlackApp/></ProtectedRoute>,
  children:[
    {
      index: true,
      element:<Home/>
    },
    {
      path: "c/:user_id",
      element: <Conversation/>,
      loader: async ({params}) => {
        const data = await SlackApi.get(
          `/messages?receiver_id=${params.user_id}&receiver_class=User`
        );
        return { messages: data, userId: params.user_id, };
      }
    },
    {
      path: "d/:channel_id",
      element: <ChannelConversation />,
      loader: async ({ params }) => {
        const data = await SlackApi.get(
          `/messages?receiver_id=${params.channel_id}&receiver_class=Channel`
        );
        return { messages: data, channelId: params.channel_id, };
      }
    },
  ]}
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
