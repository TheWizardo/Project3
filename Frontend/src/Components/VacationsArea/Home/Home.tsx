import { useEffect, useState } from "react";
import { NavLink, useLocation, Navigate, useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { vacationsStore } from "../../../Redux/VacationsState";
import authService from "../../../Services/AuthService";
import vacationsService from "../../../Services/VacationsService";
import VacationCard from "../VacationCard/VacationCard";
import { AddOutline, BarChart, PageTop, PageEnd } from '@rsuite/icons';
import { Checkbox } from 'rsuite';
import "./Home.css";
import { VacationsSortBy } from "../../../Models/VacationsSortModel";
import config from "../../../Utils/config";


function Home(): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [myVacations, setMyVacations] = useState<boolean>(false);
    const [expired, setExpired] = useState<VacationModel[]>([]);
    const [showPast, setShowPast] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<VacationsSortBy>(VacationsSortBy.recentFirst)
    const [page, setPage] = useState<number>(0);

    function getVacationsByPage(vacations: VacationModel[], page: number): VacationModel[] {
        const lastPage = Math.floor((vacations.length - 1) / config.vacationCount);
        const arr: VacationModel[] = [];
        if (page > lastPage) {
            navigate(`/vacations?p=${lastPage}`);
            return arr;
        }
        for (let i = 0; i < config.vacationCount; i++) {
            if (i + (page * config.vacationCount) >= vacations.length) break;
            arr.push(vacations[i + (page * config.vacationCount)]);
        }
        return arr;
    }

    function filter(vacations: VacationModel[]) {
        const { remainingVacations, expiredVacations } = vacationsService.filterVacations(vacations, showPast);
        const sorted = vacationsService.sortBy(remainingVacations, sortBy);
        setVacations(sorted);
        setExpired(expiredVacations);
    }

    function storeChange() {
        const checked = document.getElementById("my-vac").getAttribute("aria-checked") === "true";
        // supposed to use 'myVacations', but thats always false for some reason
        if (checked) {
            console.log("my");
            vacationsService.getMyVacations().then(v => {
                let arr = v;
                if (showPast) {
                    arr = [...arr, ...expired];
                }
                const sorted = vacationsService.sortBy(arr, sortBy);
                return filter(sorted);
            });
        }
        else {
            console.log("all");
            vacationsService.getAllVacations().then(v => {
                let arr = v;
                if (showPast) {
                    arr = [...arr, ...expired];
                }
                const sorted = vacationsService.sortBy(arr, sortBy);
                return filter(sorted);
            });
        }
    }

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            navigate("/silent-logout");
            return;
        }
        storeChange();

        const unsubscribeVacations = vacationsStore.subscribe(storeChange);
        return unsubscribeVacations;
    }, []);

    useEffect(() => {
        const p = new URLSearchParams(location.search).get('p');
        setPage(+p);
    }, [location]);

    useEffect(() => filter(vacations), [sortBy]);

    useEffect(() => {
        const sorted = vacationsService.sortBy(vacations, sortBy);
        if (showPast) {
            filter([...sorted, ...expired]);
        }
        else {
            filter([...sorted]);
        }
    }, [showPast])

    useEffect(() => {
        (async () => {
            filter(myVacations ? await vacationsService.getMyVacations() : await vacationsService.getAllVacations());
        })();
    }, [myVacations]);


    return (
        <div className="Home">
            <div>
                <h1>Our Vacations</h1>
                <div className="filter-header">
                    <label>Order By:&ensp;
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
                        </select>
                    </label>

                    <Checkbox id={"my-vac"} disabled={authService.isAdmin()} onChange={(v, c) => setMyVacations(c)}>My Vacations</Checkbox>
                </div>

                {vacations.length > 0 &&
                    <div className="flex-container">
                        {getVacationsByPage(vacations, page).map(v => <VacationCard vacation={v} expired={(new Date()).getTime() > v.startDate.getTime()} key={v.id} />)}
                    </div>}
            </div>

            <div>
                {vacations.length > config.vacationCount && <div className="pagination" style={{ maxWidth: "100%", width: `${18.75 * Math.floor(1 + vacations.length / config.vacationCount)}%` }}>
                    <NavLink to={`/vacations?p=0`}><PageTop /></NavLink>
                    {Array.from(Array(1 + Math.floor(vacations.length / config.vacationCount)).keys()).map(p => <NavLink to={`/vacations?p=${p}`} className={p === page ? "active-link" : ""} key={p}>{p + 1}</NavLink>)}
                    <NavLink to={`/vacations?p=${Math.floor(vacations.length / config.vacationCount)}`}><PageEnd /></NavLink>
                </div>}

                {authService.isAdmin() && <>
                    <Checkbox onChange={(v, c) => setShowPast(c)}>Show Expired</Checkbox>
                    <p className="new-lines">
                        <NavLink to="/vacations/add"><AddOutline /> Add</NavLink>&ensp;<NavLink to="/vacations/stats"><BarChart /> Stats</NavLink>
                    </p>
                </>}
            </div>
        </div >
    );
}

export default Home;
