import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vacationsStore } from "../../../Redux/VacationsState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import "./Logout.css";

interface LogoutProps {
    silent: boolean;
}

function Logout(props: LogoutProps): JSX.Element {

    const navigate = useNavigate();

    useEffect(() => {
        try {
            authService.logout();
            if (!props.silent) notifyService.success("logged out");
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
