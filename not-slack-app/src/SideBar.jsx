import './SideBar.css';
import { CiSearch } from 'react-icons/ci';
import SlackApi from './components/SlackApi';
import { useState, useEffect } from 'react';
import { useDebounce } from './components/ReactDebounce';

function SideBar() {
  const [users, setUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Adjust the debounce delay as needed
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await SlackApi.get('users', {});
        if (res && res.data && Array.isArray(res.data.data)) {
          setUsers(res.data.data);
        } else {
          console.error('Invalid data format received:', res.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false)
    }

    fetchUsers();
  }, [debouncedSearchQuery]);

  const filteredUsers = users.filter((user) =>
    user.uid.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const handleBlur = () => {
    if (searchQuery === '') {
      setIsSearchFocused(false);
    }
  };

  return (
    <div className='side-bar'>
      <span className='side-bar-title'>Chats</span>
      <input
        type='text'
        placeholder='Search'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={handleBlur}
      />
      <span className='search-icon'>
        <CiSearch />
      </span>
      <hr />
      {isSearchFocused && (
        <ul className='user-list'>
          {loading && <div>Loading...</div>}
          {!loading && filteredUsers.length === 0 && searchQuery !== '' && (
            <div>User Not Found!</div>
          )}
          {!loading && filteredUsers.length > 0 &&
            filteredUsers.map((user) => (
              <li key={user.id}>{user.uid.split('@')[0]}</li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default SideBar;
