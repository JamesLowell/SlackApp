import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import SlackApi from './components/SlackApi';
import "./Conversation.css"
import { IoSend } from "react-icons/io5";

export default function Conversation() {
  const messages = useLoaderData();
  const [newMessage, setNewMessage] = useState('');
  console.log(messages)

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageData = {
        receiver_id: messages.userId, // Assuming userId is available in messages
        receiver_class: 'User', // Assuming it's a direct message to a user
        body: newMessage,
      };

      await SlackApi.post("messages", messageData);
      // Assuming toast is imported and implemented elsewhere
      toast.success("Message sent successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setNewMessage('');
      // You may want to refresh or update your messages after sending
      // Implement the logic here if necessary
    } catch (error) {
      toast.error("Failed to send message", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("Error sending message:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className='message-container'>
      <h1>{messages?.messages?.data?.data[0]?.receiver?.uid.split("@")[0]}</h1>
      <div className='message-conversation-container'>
        {Array.isArray(messages?.messages?.data?.data) 
        && messages.messages.data.data.length > 0 ? (
          messages.messages.data.data.map((message) => (
            <div key={message.id}>
              <p className='message-conversation'>{message.body}</p>
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
      <form onSubmit={sendMessage}>
        <div className='message-input'>
          <input 
          type="text" 
          value={newMessage} 
          onChange={handleInputChange} 
          placeholder="Type your message" 
        />
        <button type='submit'><IoSend /></button>
        </div>
        
      </form>
    </div>
  );
}
