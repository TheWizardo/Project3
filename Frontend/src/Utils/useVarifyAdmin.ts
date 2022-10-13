import { useEffect } from "react";
import authService from "../Services/AuthService";
import notifyService from "../Services/NotifyService";

export default function useVerifyAdmin() {
    useEffect(() => {
        if (!authService.isAdmin()) {
            // sending the user back the way he came from
            window.history.back();
            notifyService.error("Access denied");
        }
    }, []);
}