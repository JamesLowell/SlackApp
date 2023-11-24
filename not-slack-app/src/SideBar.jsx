import "./SideBar.css";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import SlackApi from "./components/SlackApi";
import { useDebounce } from "./components/ReactDebounce";

function SideBar() {
  const [users, setUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [loading, setLoading] = useState(false);
  const [receiverList, setReceiverList] = useState([]);

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
    // Handle user click and add user ID to the receiver list
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setReceiverList([...receiverList, selectedUser]);
    }
    setIsSearchFocused(false); 
  };

  return (
    <div className="side-bar">
      <span className="side-bar-title">Chats</span>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
      />
      <span className="search-icon">
        <CiSearch />
      </span>
      <hr className="title-hr"/>
      {isSearchFocused && (
        <div className="user-list-container">
          {loading && <div>Loading...</div>}
          {!loading && filteredUsers.length === 0 && <div>Not Found!</div>}
          {!loading &&
            filteredUsers.length > 0 &&
            filteredUsers.map((user) => (
              <div className="user-list" key={user.id} onClick={() => handleLinkClick(user.id)}>
                <Link
                  to={`c/${user.id}`}
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
            <Link to={`c/${receiverUser.id}`}>
              {receiverUser.uid.split("@")[0]}
            </Link>
          </div>
        ))}
      </div>
      <hr className="channel-hr"/>
      <div>
        <span>Channel</span>
      </div>
    </div>
  );
}

export default SideBar;
