import { useEffect } from "react";
import authService from "../Services/AuthService";
import notifyService from "../Services/NotifyService";

export default function useVerifyAdmin() {
    useEffect(() => {
        if (!authService.isAdmin()) {
            window.history.back();
            notifyService.error("Access denied");
        }
    }, []);
}