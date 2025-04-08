import Tab from "@/components/ui-v2/Tab";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tab1 from "./tab-1";
import { H1Icon } from "@heroicons/react/24/outline";
import Tab2 from "./tab-2";
import { DataContext } from "@/context/Dataprovider";
import { useLoader } from "@/context/LoaderProvider";
import { getUserData } from "@/services/apiService";
export type TabItem = {
  id: number | string;
  label: React.ReactNode;
  nav: boolean;
  onPress?: () => void;
};

function Settings() {
  const [activeTab, setActiveTab] = useState<number | string>(1);
  const navigate = useNavigate();
  const { account } = useContext(DataContext);
  const { setLoading } = useLoader();
  const [userData, setUserData] = useState({});

  const getUserDetail = async () => {
    try {
      setLoading(true);
      const response = await getUserData(account.id);

      if (response.status === 200) {
        console.log(response.data.user, "-----user data");
        setUserData(response.data.user);
      } else {
        console.log("something wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, [account.id]);

  const tab: TabItem[] = [
    {
      id: 1,
      label: <p className="text-base">Account</p>,
      nav: true,
      onPress: () => {
        setActiveTab(1);
      },
    },
    {
      id: 2,
      label: <p className="text-base">Security and apps</p>,
      nav: true,
      onPress: () => setActiveTab(2),
    },
  ];
  return (
    <div className="p-8 flex justify-center flex-1">
      <div className="w-[1000px]">
        <h1 className="text-40-48 font-semibold mb-8">Settings</h1>
        <Tab
          tab={tab}
          activeTab={activeTab}
          setTab={(n) => {
            if (n === 1) {
              console.log("createPost");
            } else {
              setActiveTab(n);
            }
          }}
        />
        <div>
          {activeTab === 1 ? (
            <Tab1 user={userData} setUserData={setUserData} />
          ) : (
            <Tab2 />
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
