import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import SlackApi from "../../../utils/SlackApi";
import "./assets/Conversation.css";
import { IoSend } from "react-icons/io5";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { IoInformationCircleOutline } from "react-icons/io5";
import Modal from "react-bootstrap/Modal";

export default function Conversation() {
  const messages = useLoaderData();
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUserUid, setLoggedInUserUid] = useState("");
  const storedUsers =
    JSON.parse(localStorage.getItem(`userStorage_${loggedInUserUid}`)) || [];
  console.log(messages.userId);
  console.log(storedUsers);

  let matchedUser = null;
if (storedUsers && storedUsers.length > 0) {
  matchedUser = storedUsers.find(user => user.id === parseInt(messages.userId));
}

  const handleInfoClose = () => infoSetShow(false);
  const handleInfoShow = () => infoSetShow(true);
  const [infoShow, infoSetShow] = useState(false);

  useEffect(() => {
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
      toast.success("Message sent successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setNewMessage("");
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
    <div className="message-container">
      {matchedUser ? (
      <h1>{matchedUser.splitUid}</h1>
    ) : (
      <h1>Unknown</h1>
    )}
      <div className="message-conversation-container">
        {Array.isArray(messages?.messages?.data?.data) &&
        messages.messages.data.data.length > 0 ? (
          messages.messages.data.data.map((message) => (
            <div key={message.id}>
              <p
                className={
                  String(message?.sender?.id) === String(messages.userId)
                    ? "message-conversation-sender"
                    : "message-conversation-reciever"
                }
              >
                {message.body}
              </p>
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
      <form onSubmit={sendMessage}>
        <div className="message-input">
          <input
          style={{
            width:'70vw',
            marginLeft:'4rem'
          }}
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
      <button
        style={{
          zIndex: "999",
          color: "#4c1d95",
          position: "absolute",
          right: "2rem",
          top: "1rem",
          fontSize: "2rem",
          backgroundColor: "transparent",
        }}
        onClick={handleInfoShow}
      >
        <IoInformationCircleOutline />
      </button>
      <ToastContainer />
      <Modal show={infoShow} onHide={handleInfoClose}>
        <div>
        <div className="box">
      {matchedUser ? (
        <>
          <h1 className="user-first-letter">{matchedUser.splitUid.charAt(0).toUpperCase()}</h1>
          <h1>{matchedUser.splitUid}</h1>
        </>
      ) : (
        <h1>Unknown</h1>
      )}
    </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}
