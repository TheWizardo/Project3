import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import AddVacation from "../../AdminArea/AddVacation/AddVacation";
import EditVacation from "../../AdminArea/EditVacation/EditVacation";
import Home from "../../VacationsArea/Home/Home";
import "./Router.css";
import FollowStats from "../../AdminArea/FollowStats/FollowStats";
import AddDestination from "../../DestinationsArea/AddDestination/AddDestination";
import Destinations from "../../DestinationsArea/Destinations/Destinations";
import EditDestination from "../../DestinationsArea/EditDestination/EditDestination";
import RoutNotFound from "../RoutNotFound/RoutNotFound";
import Register from "../../AuthArea/Register/Register";


function Router(): JSX.Element {
    return (
        <div className="Router">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/vacations" />} />
                <Route path="/silent-logout" element={<Logout silent={true}/>} />
                <Route path="/logout" element={<Logout silent={false}/>} />
                <Route path="/vacations" element={<Home />} />
                <Route path="/vacations/:id/edit" element={<EditVacation />} />
                <Route path="/vacations/add" element={<AddVacation />} />
                <Route path="/vacations/stats" element={<FollowStats />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:id/edit" element={<EditDestination />} />
                <Route path="/destinations/add" element={<AddDestination />} />
                <Route path="*" element={<RoutNotFound />} />
            </Routes>
        </div>
    );
}

export default Router;
