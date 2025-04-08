import { PlusIcon } from "@heroicons/react/24/outline";
import { TabItem } from "../../pages/home/home";

type TabType = {
  tab: TabItem[];
  setTab: (n: string | number) => void;
  activeTab: number | string;
};

function Tab({ tab, setTab, activeTab }: TabType) {
  return (
    <div className="flex gap-4 pb-4 mb-6 border-b border-gray-secondary3">
      {tab.map((item, idx) => (
        <button
          key={`tab-${idx}`}
          className={`relative  ${
            item.nav ? "px-2 py-1" : "rounded-full hover:bg-gray-tertiary p-2"
          }`}
          onClick={() => {
            item.onPress();
          }}
        >
          {item.label}
          <div
            className={`w-full h-0.5 absolute -bottom-4 -translate-x-2 ${
              item?.nav && activeTab === item?.id
                ? "bg-blackShade-primary "
                : "bg-transparent"
            }`}
          ></div>
        </button>
      ))}
    </div>
  );
}

export default Tab;
