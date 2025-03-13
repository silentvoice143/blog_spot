import { createContext, useState, useEffect, ReactNode } from "react";

export type PostType = {
  title: string;
  description: string;
  picture: string;
  content: string;
  tags: string[];
};

type DataContextType = {
  account: { id: string; email: string; name: string; token: string };
  setAccount: React.Dispatch<
    React.SetStateAction<{
      email: string;
      name: string;
      token: string;
      id: string;
    }>
  >;
  createdPostData: PostType | null;
  setCreatedPostData: React.Dispatch<React.SetStateAction<PostType | null>>;
};

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

const DataProvider = ({ children }: { children: ReactNode }) => {
  // Load initial state from sessionStorage or localStorage
  const storedAccount = JSON.parse(localStorage.getItem("account") || "null");
  const storedPostData = JSON.parse(
    localStorage.getItem("createdPostData") || "null"
  );

  const [account, setAccount] = useState(
    storedAccount || { email: "", name: "", token: "", id: "" }
  );
  const [createdPostData, setCreatedPostData] = useState<PostType | null>(
    storedPostData
  );

  // Store account data in localStorage when it changes
  useEffect(() => {
    if (account) {
      localStorage.setItem("account", JSON.stringify(account));
    }
  }, [account]);

  // Store createdPostData in localStorage when it changes
  useEffect(() => {
    if (createdPostData) {
      localStorage.setItem("createdPostData", JSON.stringify(createdPostData));
    }
  }, [createdPostData]);

  return (
    <DataContext.Provider
      value={{ account, setAccount, createdPostData, setCreatedPostData }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
