import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DestinationModel from "../../../Models/DestinationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import useVerifyAdmin from "../../../Utils/useVarifyAdmin";

import { AddOutline, Edit } from '@rsuite/icons';
import "./Destinations.css";

function Destinations(): JSX.Element {
    useVerifyAdmin();
    const [destinations, setDestinations] = useState<DestinationModel[]>([]);

    useEffect(() => {
        vacationsService.getDestinations()
            .then(d => setDestinations(d))
            .catch(err => notifyService.error(err));
    }, []);

    return (
        <div className="Destinations">
            <table className="new-lines">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {destinations.map(d => <tr key={d.id}>
                        <td>{d.name}</td>
                        <td>{d.description}</td>
                        <td><NavLink to={`/destinations/${d.id}/edit`}><Edit /></NavLink></td>
                    </tr>)}
                </tbody>
            </table>
            <NavLink to="/destinations/add"><AddOutline/> New</NavLink>
        </div>
    );
}

export default Destinations;
