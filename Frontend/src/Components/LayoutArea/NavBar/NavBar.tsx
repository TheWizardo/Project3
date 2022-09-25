import { NavLink } from "react-router-dom";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import "./NavBar.css";

function NavBar(): JSX.Element {

    return (
        <div className="NavBar">
            <NavLink to={"/vacations"}>Home</NavLink>
            {/* implement search bar */}
            <AuthMenu />
        </div>
    );
}

export default NavBar;
