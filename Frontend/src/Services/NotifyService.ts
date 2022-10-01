import { toast, ToastOptions } from 'react-toastify';
class NotifyService {

    private extractErrorMessage(err: any) {
        if (typeof err === "string") return err;
        if (typeof err.response?.data === "string") return err.response.data;
        if (Array.isArray(err.response?.data)) return err.response.data[0];
        if (typeof err.message === "string") return err.message;
        console.error(err);
        return "Oops...";
    }

    public success(message: string, options?: ToastOptions) {
        toast.success(message, options);
    }

    public warn(message: string, options?: ToastOptions) {
        toast.warn(message, options);
    }

    public error(err: any, options?: ToastOptions): void {
        const error = this.extractErrorMessage(err);
        console.warn(err);
        toast.error(error, options);
    }

    public closeAll(): void {
        toast.clearWaitingQueue();
        toast.dismiss();
    }
}

const notifyService = new NotifyService();
export default notifyService;