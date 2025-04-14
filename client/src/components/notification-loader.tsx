// NotificationLoader.jsx
import { useContext, useEffect } from "react";
import axios from "axios";
import { useNotifications } from "@/context/NotificationProvider";
import { getNotifications } from "@/services/apiService";
import { DataContext } from "@/context/Dataprovider";

const NotificationLoader = ({ isAuthenticated }) => {
  const { setNotifications, setUnreadCount } = useNotifications();
  const { account } = useContext(DataContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(); // your backend route
        const notifs = res.data;
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    if (isAuthenticated && account?.id) {
      fetchNotifications();
    }
  }, [account]);

  return null; // this is just a loader component
};

export default NotificationLoader;
