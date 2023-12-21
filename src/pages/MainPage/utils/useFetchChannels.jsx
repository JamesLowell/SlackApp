// useFetchChannels.jsx

import { useState, useEffect } from "react";
import SlackApi from "../../../utils/SlackApi";

const useFetchChannels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await SlackApi.get("channels", {});
        if (res && res.data && Array.isArray(res.data.data)) {
          setChannels(res.data.data);
        } else {
          console.error("Invalid data format received:", res.data);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return { channels, loading };
};

export { useFetchChannels }; 
