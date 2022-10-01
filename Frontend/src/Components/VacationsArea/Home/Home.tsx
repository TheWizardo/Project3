import { useEffect, useState } from "react";
import { NavLink, useLocation, Navigate, useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import { vacationsStore } from "../../../Redux/VacationsState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import VacationCard from "../VacationCard/VacationCard";
import { AddOutline, BarChart, PageTop, PageEnd } from '@rsuite/icons';
import { Checkbox } from 'rsuite';
import "./Home.css";
import { VacationsSortBy } from "../../../Models/VacationsSortModel";
import config from "../../../Utils/config";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";


function Home(): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [expired, setExpired] = useState<VacationModel[]>([]);
    const [showPast, setShowPast] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<VacationsSortBy>(VacationsSortBy.recentFirst)
    const [page, setPage] = useState<number>(0);

    function getVacationsByPage(vacations: VacationModel[], page: number): VacationModel[] {
        const arr = [];
        for (let i = 0; i < config.vacationCount; i++) {
            if (i + page * config.vacationCount >= vacations.length) {
                const lastPage = Math.floor(vacations.length / config.vacationCount);
                if (page === lastPage) break;
                navigate(`/vacations?p=${lastPage}`);
                break;
            }
            arr.push(vacations[i + page * config.vacationCount]);
        }
        return arr;
    }

    function filter(vacations: VacationModel[], past: boolean) {
        const now = new Date();
        const { remainingVacations, expiredVacations } = vacationsService.filterVacations(vacations, past)
        setVacations(remainingVacations);
        setExpired(expiredVacations);
    }

    useEffect(() => {
        const p = new URLSearchParams(location.search).get('p');
        setPage(+p);
    }, [location])

    useEffect(() => {
        vacationsService.getAllVacations().then(v => {
            const sorted = vacationsService.sortBy(v, sortBy);
            filter(sorted, showPast);
        })
            .catch(err => notifyService.error(err));


        const unsubscribeVacations = vacationsStore.subscribe(() =>
            vacationsService.getAllVacations()
                .then(v => {
                    const sorted = vacationsService.sortBy(v, sortBy);
                    filter(sorted, showPast);
                })
                .catch(err => notifyService.error(err)));
        return unsubscribeVacations;
    }, [sortBy])

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            navigate("/silent-logout");
            return;
        }
        const p = new URLSearchParams(location.search).get('p');
        setPage(+p);
    }, []);


    return (
        <div className="Home">
            <h1>Our Vacations</h1>
            <label>Order By: </label>

            <select defaultValue={VacationsSortBy.recentFirst} onChange={(ev) => {
                const newSortBy = +ev.target.value as VacationsSortBy;
                setSortBy(newSortBy);
            }}>
                <option value={VacationsSortBy.AtoZ}>Name (A to Z)</option>
                <option value={VacationsSortBy.longestFirst}>Duration (increasing)</option>
                <option value={VacationsSortBy.longestLast}>Duration (decreasing)</option>
                <option value={VacationsSortBy.priceLowToHigh}>Cheapest First</option>
                <option value={VacationsSortBy.recentFirst}>Most Recent</option>
                <option value={VacationsSortBy.mostFollowers}>Most Followed</option>
                {!authService.isAdmin() && <option value={VacationsSortBy.myVacationsFirst}>My Vacations</option>}
            </select>
            {vacations.length > 0 &&
                <div className="flex-container">
                    {getVacationsByPage(vacations, page).map(v => <VacationCard vacation={v} expired={(new Date()).getTime() > v.startDate.getTime()} key={v.id} />)}
                </div>}

            {vacations.length > config.vacationCount && <div className="pagination" style={{ maxWidth: "100%", width: `${18.75 * Math.floor(1 + vacations.length / config.vacationCount)}%` }}>
                <NavLink to={`/vacations?p=0`}><PageTop /></NavLink>
                {Array.from(Array(1 + Math.floor(vacations.length / config.vacationCount)).keys()).map(p => <NavLink to={`/vacations?p=${p}`} className={p === page ? "active-link" : ""} key={p}>{p + 1}</NavLink>)}
                <NavLink to={`/vacations?p=${Math.floor(vacations.length / config.vacationCount)}`}><PageEnd /></NavLink>
            </div>}

            {authService.isAdmin() && <>
                <Checkbox onChange={(v, c) => {
                    setShowPast(c);
                    c ? filter([...vacations, ...expired], c) : filter([...vacations], c);
                }}>Show Expired</Checkbox>
                <p className="new-lines">
                    <NavLink to="/vacations/add"><AddOutline /> Add</NavLink>&ensp;<NavLink to="/vacations/stats"><BarChart /> Stats</NavLink>
                </p>
            </>}
        </div>
    );
}

export default Home;
