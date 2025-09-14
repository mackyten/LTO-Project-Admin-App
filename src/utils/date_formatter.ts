import { format } from "date-fns";

export const FormatDate = (date?: Date | undefined | null) => {
  if (date) return format(date, "MMMM dd, yyyy hh:mm a");
  return "--";
};
