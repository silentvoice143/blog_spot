import NotificationCard from "@/components/notification/NotificationCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataContext } from "@/context/Dataprovider";
import { useNotifications } from "@/context/NotificationProvider";
import { updateNotificationStatus } from "@/services/apiService";
import { categorizeNotificationsByDate } from "@/utils/NotificationCategorization";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect } from "react";

interface NotificationType {
  onClose?: () => void;
}

function Notification({ onClose }: NotificationType) {
  const { account } = useContext(DataContext);
  const { notifications, setNotifications, setUnreadCount } =
    useNotifications();
  console.log(notifications);
  const { today, yesterday, last7Days, older } =
    categorizeNotificationsByDate(notifications);

  const updateStatusOfNotifications = async () => {
    const response = await updateNotificationStatus({ userId: account.id });
    console.log(response, "-----response");
    if (response.status === 200) {
      const updatedNotifications = notifications.map((data) => {
        return { ...data, isRead: true };
      });
      console.log(updatedNotifications, "----updated notifications");
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    } else {
      console.log("something wrong!");
    }
  };

  useEffect(() => {
    updateStatusOfNotifications();
  }, []);

  return (
    <div className="fixed top-0 right-0 w-full bg-black/50 h-screen flex justify-end z-20">
      <div className="w-1/3 relative bg-white">
        <div className="border-l border-gray-secondary2 h-full w-full">
          <div className="py-4 px-4 flex justify-between">
            <h1 className="text-lg font-semibold">Notifications</h1>
            <Button onClick={onClose} className="p-2 h-8 w-8" variant="ghost">
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-auto h-[90%]">
            {today.length > 0 && (
              <div className="mb-3">
                <h2 className="text-base font-semibold mb-4 px-4">Today</h2>
                <div className="flex flex-col gap-2">
                  {today.map((data, idx) => (
                    <NotificationCard data={data} />
                  ))}
                </div>
              </div>
            )}
            {yesterday.length > 0 && (
              <div className="mb-3">
                <h2 className="text-base font-semibold mb-4 px-4">Yesterday</h2>
                <div className="flex flex-col gap-2">
                  {yesterday.map((data, idx) => (
                    <NotificationCard data={data} />
                  ))}
                </div>
              </div>
            )}
            {last7Days.length > 0 && (
              <div className="mb-3">
                <h2 className="text-base font-semibold mb-4 px-4">
                  Last 7 Days
                </h2>
                <div className="flex flex-col gap-2">
                  {last7Days.map((data, idx) => (
                    <NotificationCard data={data} />
                  ))}
                </div>
              </div>
            )}
            {older.length > 0 && (
              <div className="mb-3">
                <h2 className="text-base font-semibold mb-4 px-4">Older</h2>
                <div className="flex flex-col gap-2">
                  {older.map((data, idx) => (
                    <NotificationCard data={data} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
