import { toast } from "sonner";

export const useApiError = () => {
  const handleError = (
    error: any,
    fallbackMessage: string = "Something went wrong",
  ) => {
    // Extract backend message safely
    const backendMessage =
      error?.response?.data?.message || error?.message || null;

    const finalMessage = backendMessage || fallbackMessage;

    toast.error(finalMessage);

    return finalMessage; // useful if you want to show inline error too
  };

  return { handleError };
};
