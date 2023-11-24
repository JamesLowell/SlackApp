import "./SideBar.css";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import SlackApi from "./components/SlackApi";
import { useDebounce } from "./components/ReactDebounce";
import Spinner from "react-bootstrap/Spinner";
import Dropdown from "react-bootstrap/Dropdown";

function SideBar() {
  const [users, setUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [loading, setLoading] = useState(false);
  const [receiverList, setReceiverList] = useState([]);
  const [loggedInUserUid, setLoggedInUserUid] = useState('');

  useEffect(() => {
    // Retrieve user's uid from local storage
    const uid = localStorage.getItem('uid');
    setLoggedInUserUid(uid || '');
  }, []);
  
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await SlackApi.get("users", {});
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

    fetchUsers();
  }, [debouncedSearch]);

  const filteredUsers = users.filter((user) =>
    user.uid.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleLinkClick = (userId) => {
    const selectedUser = users.find((user) => user.id === userId);
    if (selectedUser) {
      const userToStore = {
        id: selectedUser.id,
        splitUid: selectedUser.uid.split("@")[0]
      };
  
      const storedUsers = JSON.parse(localStorage.getItem(`userStorage_${loggedInUserUid}`)) || [];
      
      // Check if the user ID already exists in storedUsers
      const isUserAlreadyStored = storedUsers.some(user => user.id === userToStore.id);
      
      if (!isUserAlreadyStored) {
        storedUsers.push(userToStore);
        localStorage.setItem(`userStorage_${loggedInUserUid}`, JSON.stringify(storedUsers));
        setReceiverList([...receiverList, selectedUser]);
      } else {
        // Handle if user ID already exists in storage (optional)
        console.log(`User with ID ${userToStore.id} is already in storage.`);
      }
    }
    setIsSearchFocused(false);
  };

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(`userStorage_${loggedInUserUid}`)) || [];
    setReceiverList(storedUsers.map(user => ({
      id: user.id,
      uid: user.splitUid, // Adjust this according to your data structure
    })));
  }, [loggedInUserUid]);

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
            <div>
              <Spinner animation="border" />
            </div>
          )}
          {!loading && filteredUsers.length === 0 && <div>Not Found!</div>}
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
                  to={`c/${user.id}`
                }
                >
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
              style={{ color: "white", textDecoration: "none" }}
              to={`c/${receiverUser.id}`}
            >
              {receiverUser.uid.split("@")[0]}
            </Link>
          </div>
        ))}
      </div>
      <hr className="channel-hr" />
      <Dropdown>
        <Dropdown.Toggle
          style={{ backgroundColor: "#4c1d95",width:'12.5rem', border: "transparent" ,display:'flex',
          position:'absolute', left:'-6.5rem', top: '57vh', display:'flex', justifyContent:'center'}}
          variant="success"
          id="dropdown-basic"
        >
          Channel
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
    </div>
  );
}

export default SideBar;
