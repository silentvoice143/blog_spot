// App.jsx or NotificationListener.jsx
import { useContext, useEffect } from "react";
import socket from "@/socket";
import { toast } from "sonner";

import { useNotifications } from "@/context/NotificationProvider";
import { DataContext } from "@/context/Dataprovider";
import useRegisterSocket from "@/hooks/useRegisterSocket";

const NotificationListener = ({ isAuthenticated }) => {
  const { setNotifications, setUnreadCount } = useNotifications();
  const { account } = useContext(DataContext);
  const { isConnected } = useRegisterSocket(account?.token, account?.id);

  useEffect(() => {
    console.log(isConnected, "---isconnected listener");
    if (!isConnected) return;

    const handleNotification = (notif) => {
      /* same logic */
      console.log(notif, "====upcoming");
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((count) => count + 1);

      // Show toast
      switch (notif.type) {
        case "follow":
          toast.info(`${notif.fromUser.name} followed you`);
          break;
        case "comment":
          toast.info(`${notif.fromUser.name} commented on your post`);
          break;
        case "new_post":
          toast.info(`${notif.fromUser.name} just posted a new blog`);
          break;
      }
    };
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [account.id, isConnected]);

  return null;
};

export default NotificationListener;
