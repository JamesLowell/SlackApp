import React from 'react'
import ReactDOM from 'react-dom/client'
import SideBar from './SideBar'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './LandingPage'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import SlackApp from './SlackApp'
import Home from './Home'
import Conversation from './Conversation'
import SlackApi from "./components/SlackApi";
import 'bootstrap/dist/css/bootstrap.min.css';
import ChannelConversation from './ChannelConversation'
import ProtectedRoute from './components/ProtectedRoute'

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
