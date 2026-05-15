// utils/formatDate.ts

import { format } from "date-fns";

export const formatDate = (
    date: string | Date,
    dateFormat: string = "dd MMM yyyy"
) => {
    if (!date) return "";

    return format(new Date(date), dateFormat);
};