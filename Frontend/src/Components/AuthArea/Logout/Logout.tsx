import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import "./Logout.css";


function Logout(): JSX.Element {

    const navigate = useNavigate();

    useEffect(() => {
        try {
            authService.logout();
            notifyService.success("logged out");
            // flushing the vacations in the redux store
            vacationsService.flushAll();
            navigate("/login");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }, []);

    return null;
}

export default Logout;
