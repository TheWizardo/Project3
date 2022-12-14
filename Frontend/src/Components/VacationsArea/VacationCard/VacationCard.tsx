import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { vacationsStore } from "../../../Redux/VacationsState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import config from "../../../Utils/config";
import { Send, Edit, Trash } from '@rsuite/icons';
import "./VacationCard.css";

interface VacationCardProps {
    vacation: VacationModel;
    expired: boolean;
}


function VacationCard(props: VacationCardProps): JSX.Element {
    const [vacation, setVacation] = useState<VacationModel>();
    const navigate = useNavigate();

    useEffect(() => {
        // setting up the card by the ID
        vacationsService.getVacationById(props.vacation.id)
            .then(v => setVacation(v))
            .catch(err => notifyService.error(err))

        const unsubscribe = vacationsStore.subscribe(() => {
            // updating the vacations after every redux store change
            const newVacation = { ...vacationsStore.getState().vacations.find(v => v.id === props.vacation.id) };
            setVacation(newVacation);
        });
        return unsubscribe;
    }, []);

    async function buttonPress(ev: any, vId: number) {
        try {
            // checking whether the user's token is still valid
            if (!authService.isLoggedIn()) {
                navigate("/login");
                return;
            }
            const action = ev.target.classList;
            if (action[0] === "unfollow") {
                await vacationsService.unfollowAfter(vId);
                ev.target.className = "follow";
                return;
            }
            if (action[0] === "follow") {
                await vacationsService.followAfter(vId);
                ev.target.className = "unfollow";
                return;
            }
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    async function deleteVacation(name: string) {
        try {
            const iAmSure = window.confirm(`Are you sure you want to delete "${name}"?`);
            if (!iAmSure) return;
            await vacationsService.deleteVacation(vacation.id);
            navigate("/");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    return (
        <section className={"VacationCard" + (props.expired ? " expired" : "")}>
            {vacation && <>
                <h3>{vacation.dstName}</h3>
                <div className="new-lines">
                    <div className="shadow-mask"></div>
                    <img src={`${config.imagesURL}/${vacation.imageName || "ImgNotFound.png"}`} />
                    <div className="container">
                        <p className="info">{vacation.dstDescription}</p>
                        <span className="price">{vacation.price}$</span>
                        <div className="dates">
                            <p><b><Send /> {vacation.startDate.toLocaleDateString()}</b> to <b>{vacation.endDate.toLocaleDateString()}</b></p>
                        </div>
                    </div>
                    <div className="actions">
                        <button
                            className={vacation.isFollowed ? "unfollow" : "follow"}
                            disabled={authService.isAdmin()}
                            onClick={(ev) => buttonPress(ev, vacation.id)}>
                            {vacation.followersCount}
                        </button>
                        {authService.isAdmin() && <>
                            <br />
                            <button className="del-btn" onClick={() => deleteVacation(vacation.dstName)}><Trash /></button>
                            <br />
                            <NavLink to={`/vacations/${vacation.id}/edit`} className="edit-btn"><Edit /></NavLink>
                        </>}
                    </div>

                </div>
            </>}
        </section>
    );
}

export default VacationCard;
