import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import "./AuthMenu.css";

function AuthMenu(): JSX.Element {
    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        setUser(authStore.getState().user);
        const unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
        return unsubscribe;
    }, []);

    return (
        <div className="AuthMenu">
            {!user && <span><NavLink to="login">Login</NavLink> | <NavLink to="register">Register</NavLink></span>}
            {user && <span>Hello {user.username} | <NavLink to="logout">Logout</NavLink></span>}
        </div>
    );
}
export default AuthMenu;
