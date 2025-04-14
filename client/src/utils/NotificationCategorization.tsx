import {
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  differenceInCalendarDays,
} from "date-fns";

export type User = {
  _id: string;
  name: string;
  email: string;
};

export type Notification = {
  _id: string;
  user: string;
  type: "follow" | "comment" | "like" | "new_post";
  fromUser: User;
  post: string | null;
  isRead: boolean;
  createdAt: string;
  __v: number;
};

type CategorizedNotifications = {
  today: Notification[];
  yesterday: Notification[];
  last7Days: Notification[];
  older: Notification[];
};

export const categorizeNotificationsByDate = (
  notifications: Notification[]
): CategorizedNotifications => {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const last7Days: Notification[] = [];
  const older: Notification[] = [];

  notifications.forEach((notif) => {
    const date = parseISO(notif.createdAt);

    if (isToday(date)) {
      today.push(notif);
    } else if (isYesterday(date)) {
      yesterday.push(notif);
    } else if (differenceInCalendarDays(new Date(), date) <= 7) {
      last7Days.push(notif);
    } else {
      older.push(notif);
    }
  });

  return { today, yesterday, last7Days, older };
};
