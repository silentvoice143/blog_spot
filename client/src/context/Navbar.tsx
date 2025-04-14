// NotificationContext.js (optional but recommended for global state)
import { createContext, useContext, useState } from "react";

const NavbarContext = createContext(null);

export const useNavbarContext = () => useContext(NavbarContext);

export const NavProvider = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false); // full list

  return (
    <NavbarContext.Provider value={{ showNotifications, setShowNotifications }}>
      {children}
    </NavbarContext.Provider>
  );
};
