import { useState, useEffect } from "react";
import SlackApi from "../../../utils/SlackApi";

export const useFetchUsers = (searchQuery) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

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
  }, [searchQuery]);

  return { users, options, loading };
};
