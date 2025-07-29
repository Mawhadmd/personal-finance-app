
import { toast, ToastContainer } from "react-toastify";
export const ToastContainerComponent = () => <ToastContainer  toastStyle={{ backgroundColor: "var(--foreground)", color: 'var(--text)',  }} />;
export default function useToast() {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showInfo = (message: string) => {
    toast.info(message);
  };

  const showWarning = (message: string) => {
    toast.warning(message);
  };

  const showDefault = (message: string) => {
    toast(message);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showDefault,
  };
}

