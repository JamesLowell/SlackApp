import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import SlackApi from "../../../utils/SlackApi";
import "./assets/ChannelConversation.css";
import { IoSend } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import { IoInformationCircleOutline } from "react-icons/io5";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { useFetchUsers } from "../utils/useFetchUsers";
import { useEffect } from "react";

export default function ChannelConversation() {
  const messages = useLoaderData();
  const [newMessage, setNewMessage] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const [show, setShow] = useState(false);

  const handleInfoClose = () => infoSetShow(false);
  const handleInfoShow = () => infoSetShow(true);
  const [infoShow, infoSetShow] = useState(false);

  const { users, options, loading } = useFetchUsers();

  const [memberList, setMemberList] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const channelId = messages.channelId; // Replace messages.channelId with the actual value

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await SlackApi.get(`channels?id=${channelId}`);
        if (res && res.data && Array.isArray(res.data.members)) {
          setMemberList(res.data.members);
        } else {
          console.error("Invalid data format received for members:", res.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoadingMembers(false);
      }
    };

    if (channelId) {
      fetchMembers();
    }
  }, [channelId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageData = {
        receiver_id: messages.channelId,
        receiver_class: "Channel",
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

  const handleAddMember = async () => {
    if (!selectedMember) {
      toast.error("Please select a member to add", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    try {
      const channelIdInt = parseInt(messages.channelId, 10); // Parse channelId to integer
      const addMemberData = {
        id: channelIdInt,
        member_id: parseInt(selectedMember.value, 10), // Parse selected member ID to integer
      };
      console.log(addMemberData)
      await SlackApi.post("channel/add_member", addMemberData);
      toast.success("Member added successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setSelectedMember(null);
    } catch (error) {
      toast.error("Failed to add member", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("Error adding member:", error);
    }
  };

  const handleMemberSelect = (selectedOption) => {
    setSelectedMember(selectedOption);
  };
  
  return (
    <div className="message-container">
      <h1>channel:{messages.channelId}</h1>
      <div className="message-conversation-container">
        {Array.isArray(messages?.messages?.data?.data) &&
          messages.messages.data.data.length > 0 ? (
          messages.messages.data.data.map((message) => (
            <div key={message.id}>
              <p
                className={
                  String(messages?.messages?.headers?.uid) ===
                    String(message?.sender?.uid)
                    ? "message-conversation-reciever"
                    : "message-conversation-sender"
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
              width: '70vw',
              marginLeft: '4rem'
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
            <h2>Channel: {messages.channelId}</h2>
            <span style={{ height: '5rem', color: 'white' }}>Member-list</span>
            <span className="members-list">
              {memberList.id}
            </span>
            <Select
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: '15rem',
                  marginBottom: '1rem' // Set your desired width here
                }),
              }}
              options={options}
              isLoading={loading}
              value={selectedMember}
              onChange={handleMemberSelect}
            />
            <div style={{ display: 'flex' }}>
              <button onClick={handleInfoClose} className="button" style={{ float: "left" }}>
                Cancel
              </button>
              <button onClick={handleAddMember} className="button" style={{ float: "left" }}>
                Add Member
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}
