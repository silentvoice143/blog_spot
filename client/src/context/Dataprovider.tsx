import { createContext, useState, ReactNode } from "react";

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
  const [account, setAccount] = useState({ email: "", name: "", token: "" });
  const [createdPostData, setCreatedPostData] = useState<PostType | null>(null);

  return (
    <DataContext.Provider
      value={{ account, setAccount, createdPostData, setCreatedPostData }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
