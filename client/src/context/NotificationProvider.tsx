// NotificationContext.js (optional but recommended for global state)
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // full list
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount, setUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
