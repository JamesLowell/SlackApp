import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import SlackApi from "./components/SlackApi";
import "./Conversation.css";
import { IoSend } from "react-icons/io5";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Conversation() {
  const messages = useLoaderData();
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUserUid, setLoggedInUserUid] = useState("");
  const storedUsers =
    JSON.parse(localStorage.getItem(`userStorage_${loggedInUserUid}`)) || [];
  console.log(messages);
  console.log(storedUsers);

  useEffect(() => {
    // Retrieve user's uid from local storage
    const uid = localStorage.getItem("uid");
    setLoggedInUserUid(uid || "");
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageData = {
        receiver_id: messages.userId,
        receiver_class: "User", 
        body: newMessage,
      };

      await SlackApi.post("messages", messageData);
      // Assuming toast is imported and implemented elsewhere
      toast.success("Message sent successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setNewMessage("");
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

  useEffect(() => {
    async function fetchChannel() {
      setLoading(true);
      try {
        const res = await SlackApi.get("channel", {});
        if (res && res.data && Array.isArray(res.data.data)) {
          setUsers(res.data.data);
        } else {
          console.error("Invalid data format received:", res.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannel();
  }, []);

  return (
    <div className="message-container">
      <h1>user:{messages.userId}</h1>
      <div className="message-conversation-container">
        {Array.isArray(messages?.messages?.data?.data) &&
        messages.messages.data.data.length > 0 ? (
          messages.messages.data.data.map((message) => (
            <div key={message.id}>
              <p className={message?.sender?.id === messages.userId ? 'message-conversation sender' : 'message-conversation'}>{message.body}</p>
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
      <form onSubmit={sendMessage}>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message"
          />
          <button type="submit">
            <IoSend />
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
