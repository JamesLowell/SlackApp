import "./SideBar.css";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import SlackApi from "./components/SlackApi";
import { useDebounce } from "./components/ReactDebounce";
import Spinner from "react-bootstrap/Spinner";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { TiInfoLarge } from "react-icons/ti";
import { useNavigate } from "react-router-dom";


function SideBar() {
  const [users, setUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [loading, setLoading] = useState(false);
  const [receiverList, setReceiverList] = useState([]);
  const [loggedInUserUid, setLoggedInUserUid] = useState("");
  const [channels, setChannels] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  const [channelName, setChannelName] = useState("");

  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = () => setShowInfoModal(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user's uid from local storage
    const uid = localStorage.getItem("uid");
    setLoggedInUserUid(uid || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("uid");
    navigate("/log-in");
  };

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await SlackApi.get("users", {});
        if (res && res.data && Array.isArray(res.data.data)) {
          const fetchedUsers = res.data.data.map((user) => ({
            value: user.id,
            label: user.uid.split("@")[0],
          }));
          setOptions(fetchedUsers);
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

    fetchUsers();
  }, [debouncedSearch]);

  const handleChange = (selectedItems) => {
    setSelectedOptions(selectedItems);
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

      // Check if the user ID already exists in storedUsers
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
        // Handle if user ID already exists in storage (optional)
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
        uid: user.splitUid, // Adjust this according to your data structure
      }))
    );
  }, [loggedInUserUid]);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await SlackApi.get("channels", {});
        if (res && res.data && Array.isArray(res.data.data)) {
          // Update setUsers to setChannels or another appropriate state for channels
          setChannels(res.data.data);
          console.log(channels)
        } else {
          console.error("Invalid data format received:", res.data);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChannel();
  }, []);

  const addChannel = async (e) => {
    e.preventDefault();
    try {
      
      // Get the selected user IDs from selectedOptions
      const selectedUserIds = selectedOptions.map((option) => option.value);
      console.log(selectedUserIds);
      console.log(channelName);

      const addChannelData = {
        name: channelName,
        user_ids: selectedUserIds, // Populate user_ids with selected user IDs
      };

      await SlackApi.post("channels", addChannelData);
      // Assuming toast is imported and implemented elsewhere
      toast.success("Channel created successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setChannelName("");
      setSelectedOptions([]); // Clear selected options after creating the channel
      handleClose(); // Close the modal or perform any other necessary actions upon successful channel creation
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
                  <span className="first-letter">{user.uid.charAt(0).toUpperCase()}</span>
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
              style={{ color: "white", textDecoration: "none" , display:'flex', alignItems:'center'}}
              to={`c/${receiverUser.id}`}
            >
              <div>
                <span className="first-letter">{receiverUser.uid.charAt(0).toUpperCase()}</span>
                </div>
              {receiverUser.uid.split("@")[0]}
            </Link>
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

        <Dropdown.Menu>
          {loading ? (
            <div>
              <Spinner animation="border" />
            </div>
          ) : (
            // Render channels here within the Dropdown.Menu
            channels.map((channel) => (
              <Dropdown.Item
                key={channel.id}
                style={{
                  width: "12.5rem",
                  maxHeight: "7rem",
                  overflowY: "auto",
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
          onClick={handleShow}
        >
          +
        </Button>
      </div>
      <Modal show={show} onHide={handleClose}>
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
                  onChange={handleSelectChange} // Handle selection changes
                  closeMenuOnSelect={false}
                  isSearchable
                  required
                
                />
              </div>
              <div>
                <button
                  onClick={handleClose}
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
      <button className="info-button" onClick={handleShowInfoModal}><TiInfoLarge />
</button>
<Modal show={showInfoModal} onHide={handleCloseInfoModal}>
<div className="create-channel-modal">
          <div className="box">
            <h2>Create Channel</h2>
              <div>
                <button
                  onClick={handleCloseInfoModal}
                  className="button"
                  style={{ float: "left" }}
                >
                  Close
                </button>
                <a onClick={handleLogout}>
  <button type="button" className="button" style={{ float: "left" }}>
    Logout
  </button>
</a>
                
              </div>
            
          </div>
        </div>
      </Modal>
      <ToastContainer/>
    </div>
    
  );
}

export default SideBar;
