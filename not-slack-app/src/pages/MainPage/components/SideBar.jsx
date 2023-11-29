import "./assets/SideBar.css";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import SlackApi from "../../../utils/SlackApi";
import { useDebounce } from "../../../utils/ReactDebounce";
import Spinner from "react-bootstrap/Spinner";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { TiInfoLarge } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { useFetchUsers } from "../utils/useFetchUsers";
import { useFetchChannels } from "../utils/useFetchChannels";

function SideBar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const { users, options, loading } = useFetchUsers(debouncedSearch);
  const { channels } = useFetchChannels();

  const [receiverList, setReceiverList] = useState([]);
  const [loggedInUserUid, setLoggedInUserUid] = useState("");
  const [showChannel, setShowChannel] = useState(false);

  const handleCloseChannel = () => setShowChannel(false);
  const handleShowChannel = () => setShowChannel(true);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [channelName, setChannelName] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = () => setShowInfoModal(true);

  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    setLoggedInUserUid(uid || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("uid");
    navigate("/log-in");
  };

  const filteredUsers = users.filter((user) =>
    user.uid.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleLinkClick = (userId) => {
    const selectedUser = users.find((user) => user.id === userId);
    if (selectedUser) {
      const userToStore = {
        id: selectedUser.id,
        splitUid: selectedUser.uid.split("@")[0],
      };

      const storedUsers =
        JSON.parse(localStorage.getItem(`userStorage_${loggedInUserUid}`)) ||
        [];

      const isUserAlreadyStored = storedUsers.some(
        (user) => user.id === userToStore.id
      );

      if (!isUserAlreadyStored) {
        storedUsers.push(userToStore);
        localStorage.setItem(
          `userStorage_${loggedInUserUid}`,
          JSON.stringify(storedUsers)
        );
        setReceiverList([...receiverList, selectedUser]);
      } else {
        console.log(`User with ID ${userToStore.id} is already in storage.`);
      }
    }
    setIsSearchFocused(false);
  };

  useEffect(() => {
    const storedUsers =
      JSON.parse(localStorage.getItem(`userStorage_${loggedInUserUid}`)) || [];
    setReceiverList(
      storedUsers.map((user) => ({
        id: user.id,
        uid: user.splitUid,
      }))
    );
  }, [loggedInUserUid]);

  const removeReceiver = (userId) => {
    const updatedReceivers = receiverList.filter(
      (receiver) => receiver.id !== userId
    );
    setReceiverList(updatedReceivers);

    const storedUsers =
      JSON.parse(localStorage.getItem(`userStorage_${loggedInUserUid}`)) || [];
    const updatedStoredUsers = storedUsers.filter((user) => user.id !== userId);
    localStorage.setItem(
      `userStorage_${loggedInUserUid}`,
      JSON.stringify(updatedStoredUsers)
    );
  };

  const addChannel = async (e) => {
    e.preventDefault();
    try {
      const selectedUserIds = selectedOptions.map((option) => option.value);
      console.log(selectedUserIds);
      console.log(channelName);

      const addChannelData = {
        name: channelName,
        user_ids: selectedUserIds,
      };

      await SlackApi.post("channels", addChannelData);
      toast.success("Channel created successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setChannelName("");
      setSelectedOptions([]);
      handleCloseChannel();
    } catch (error) {
      toast.error("Failed to create channel", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("Error creating channel:", error);
    }
  };
  const handleInputChange = (e) => {
    setChannelName(e.target.value);
  };

  const handleSelectChange = (selectedItems) => {
    setSelectedOptions(selectedItems);
  };

  const userEmail = localStorage.getItem("uid");

  return (
    <div className="side-bar">
      <span className="side-bar-title">Chats</span>
      <input
        className="side-bar-input"
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
      />
      <span className="search-icon">
        <CiSearch />
      </span>
      <hr className="title-hr" />
      {isSearchFocused && (
        <div className="user-list-container">
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "10vw",
                backgroundColor: "#7986cb",
              }}
            >
              <Spinner animation="border" />
            </div>
          )}
          {!loading && filteredUsers.length === 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "10vw",
                backgroundColor: "#7986cb",
              }}
            >
              Not Found!
            </div>
          )}
          {!loading &&
            filteredUsers.length > 0 &&
            filteredUsers.map((user) => (
              <div
                className="user-list"
                key={user.id}
                onClick={() => handleLinkClick(user.id)}
              >
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`c/${user.id}`}
                >
                  <span className="first-letter">
                    {user.uid.charAt(0).toUpperCase()}
                  </span>
                  {user.uid.split("@")[0]}
                </Link>
              </div>
            ))}
        </div>
      )}
      <div className="reciever-list">
        {receiverList.map((receiverUser) => (
          <div key={receiverUser.id}>
            <Link
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
              to={`c/${receiverUser.id}`}
            >
              <div>
                <span className="first-letter">
                  {receiverUser.uid.charAt(0).toUpperCase()}
                </span>
              </div>
              {receiverUser.uid.split("@")[0]}
            </Link>
            <button
              className="receiver-delete-button"
              onClick={() => removeReceiver(receiverUser.id)}
            >
              <MdDeleteOutline />
            </button>
          </div>
        ))}
      </div>
      <hr className="channel-hr" />
      <Dropdown>
        <Dropdown.Toggle
          style={{
            backgroundColor: "#4c1d95",
            width: "12.5rem",
            border: "transparent",
            display: "flex",
            position: "absolute",
            left: "-6.5rem",
            top: "58vh",
            justifyContent: "center",
            letterSpacing: ".1rem",
          }}
          variant="success"
          id="dropdown-basic"
        >
          Channel
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{
            maxHeight: "15rem",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div>
              <Spinner animation="border" />
            </div>
          ) : (
            channels.map((channel) => (
              <Dropdown.Item
                key={channel.id}
                style={{
                  width: "12.5rem",
                }}
              >
                <Link
                  style={{
                    color: "black",
                    textDecoration: "none",
                    padding: "5px",
                  }}
                  to={`d/${channel.id}`}
                >
                  {channel.name}
                </Link>
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>
      <div>
        <span className="create-channel">Create Channel</span>
        <Button
          className="create-channel-button"
          style={{
            border: "transparent",
            backgroundColor: "transparent",
            color: "#4c1d95",
            fontWeight: "600",
            padding: "0 .5rem",
            fontSize: "1.5rem",
          }}
          variant="primary"
          onClick={handleShowChannel}
        >
          +
        </Button>
      </div>
      <Modal show={showChannel} onHide={handleCloseChannel}>
        <div className="create-channel-modal">
          <div className="box">
            <h2>Create Channel</h2>
            <form onSubmit={addChannel}>
              <div className="inputBox">
                <label for="channel-name">Channel Name</label>
                <input
                  value={channelName}
                  placeholder="channel name"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="inputBox">
                <label htmlFor="channel-member">Add members</label>
                <Select
                  className="add-member-input"
                  options={options}
                  isMulti
                  placeholder="Search members..."
                  value={selectedOptions}
                  onChange={handleSelectChange}
                  closeMenuOnSelect={false}
                  isSearchable
                  required
                />
              </div>
              <div>
                <button
                  onClick={handleCloseChannel}
                  className="button"
                  style={{ float: "left" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button"
                  style={{ float: "left" }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <button className="info-button" onClick={handleShowInfoModal}>
        <TiInfoLarge />
      </button>
      <Modal show={showInfoModal} onHide={handleCloseInfoModal}>
        <div>
          <div className="box">
            <span className="user-first-letter">
              {userEmail.charAt(0).toUpperCase()}
            </span>
            <h2>{userEmail}</h2>
            <div>
              <button
                onClick={handleCloseInfoModal}
                className="button"
                style={{ float: "left" }}
              >
                Close
              </button>
              <a onClick={handleLogout}>
                <button
                  type="button"
                  className="button"
                  style={{ float: "left" }}
                >
                  Logout
                </button>
              </a>
            </div>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default SideBar;
