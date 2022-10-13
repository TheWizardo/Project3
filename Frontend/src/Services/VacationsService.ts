import axios from "axios";
import DestinationModel from "../Models/DestinationModel";
import VacationModel from "../Models/VacationModel";
import { VacationsSortBy } from "../Models/VacationsSortModel";
import { VacationsAction, VacationsActionType, vacationsStore } from "../Redux/VacationsState";
import config from "../Utils/config";
import notifyService from "./NotifyService";

class VacationsService {
    public async checkEmpty(): Promise<void> {
        if (vacationsStore.getState().vacations === null) await this.getAllVacations();
    }

    public flushAll(): void {
        const action: VacationsAction = { type: VacationsActionType.FetchVacations, payload: null };
        vacationsStore.dispatch(action);
    }

    public async getAllVacations(): Promise<VacationModel[]> {
        // checking if vacations were already fetched
        if (vacationsStore.getState().vacations?.length > 0) {
            return vacationsStore.getState().vacations;
        }
        // fetching vacations
        const response = await axios.get<VacationModel[]>(`${config.vacationsURL}`);
        const vacations = response.data;
        // the dates are received as string
        vacations.map(v => {
            v.startDate = new Date(v.startDate);
            v.endDate = new Date(v.endDate);
            return v;
        });
        // updating the redux store
        const action: VacationsAction = { type: VacationsActionType.FetchVacations, payload: vacations };
        vacationsStore.dispatch(action);
        return vacations;
    }

    public async getMyVacations(): Promise<VacationModel[]> {
        const all = await this.getAllVacations();
        return all.filter(v => v.isFollowed);
    }

    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(`${config.vacationsURL}/${id}`);
        // updating the redux store
        const action: VacationsAction = { type: VacationsActionType.DeleteVacation, payload: id };
        vacationsStore.dispatch(action);
    }

    public async getDestinations(): Promise<DestinationModel[]> {
        const response = await axios.get<DestinationModel[]>(`${config.destinationsURL}`);
        const destinations = response.data;
        return destinations;
    }

    public async addVacation(vacation: VacationModel): Promise<void> {
        // after a page refresh, the redux store is empty
        // this will create a bug if not accounted for
        await this.checkEmpty();

        const formData = new FormData();
        formData.append("dstName", vacation.dstName);
        formData.append("dstDescription", vacation.dstDescription);
        formData.append("dstId", vacation.dstId.toString());
        formData.append("price", vacation.price.toString());
        formData.append("startDate", vacation.startDate.toISOString());
        formData.append("endDate", vacation.endDate.toISOString());
        formData.append("image", vacation.image[0]);

        // posting the new vacation
        const result = await axios.post(`${config.vacationsURL}`, formData);
        const addedVacation = result.data;
        addedVacation.startDate = new Date(addedVacation.startDate);
        addedVacation.endDate = new Date(addedVacation.endDate);
        // updating the redux store
        const action: VacationsAction = { type: VacationsActionType.AddVacation, payload: addedVacation };
        vacationsStore.dispatch(action);
    }

    public async addDestination(destination: DestinationModel): Promise<void> {
        const formData = new FormData();
        formData.append("name", destination.name);
        formData.append("description", destination.description);
        await axios.post(`${config.destinationsURL}`, formData);
    }

    public async updateVacation(vacation: VacationModel): Promise<void> {
        // after a page refresh, the redux store is empty
        // this will create a bug if not accounted for
        await this.checkEmpty();

        const formData = new FormData();
        formData.append("id", vacation.id.toString());
        formData.append("followersCount", vacation.followersCount.toString());
        formData.append("dstName", vacation.dstName);
        formData.append("dstDescription", vacation.dstDescription);
        formData.append("dstId", vacation.dstId.toString());
        formData.append("price", vacation.price.toString());
        formData.append("startDate", vacation.startDate.toISOString());
        formData.append("endDate", vacation.endDate.toISOString());
        formData.append("image", vacation.image[0]);
        formData.append("imageName", vacation.imageName);

        const result = await axios.put(`${config.vacationsURL}/${vacation.id}`, formData);
        const updatedVacation = result.data;
        updatedVacation.startDate = new Date(updatedVacation.startDate);
        updatedVacation.endDate = new Date(updatedVacation.endDate);
        // updating the redux store
        const action: VacationsAction = { type: VacationsActionType.UpdateVacation, payload: updatedVacation };
        vacationsStore.dispatch(action);
    }

    public async editDestination(destination: DestinationModel): Promise<void> {
        const formData = new FormData();
        formData.append("id", destination.id.toString());
        formData.append("name", destination.name);
        formData.append("description", destination.description);
        await axios.put(`${config.destinationsURL}/${destination.id}`, formData);
    }

    public async followAfter(vId: number): Promise<void> {
        await axios.post(`${config.vacationsURL}/${vId}/follow`);
        // updating the redux store
        const action: VacationsAction = { type: VacationsActionType.Follow, payload: vId };
        vacationsStore.dispatch(action);
    }

    public async unfollowAfter(vId: number): Promise<void> {
        await axios.delete(`${config.vacationsURL}/${vId}/unfollow`);
        // updating the redux store
        const action: VacationsAction = { type: VacationsActionType.Unfollow, payload: vId };
        vacationsStore.dispatch(action);
    }

    // handling sorting according to the specified requirements
    public sortBy(vacations: VacationModel[], sortType: VacationsSortBy): VacationModel[] {
        switch (sortType) {
            case VacationsSortBy.AtoZ:
                vacations.sort((a, b) => a.dstName > b.dstName ? 1 : -1);
                break;
            case VacationsSortBy.priceLowToHigh:
                vacations.sort((a, b) => a.price > b.price ? 1 : -1);
                break;
            case VacationsSortBy.recentFirst:
                vacations.sort((a, b) => a.startDate > b.startDate ? 1 : -1);
                break;
            case VacationsSortBy.longestFirst:
                vacations.sort((a, b) => (a.endDate.getTime() - a.startDate.getTime()) > (b.endDate.getTime() - b.startDate.getTime()) ? 1 : -1);
                break;
            case VacationsSortBy.longestLast:
                vacations = this.sortBy(vacations, VacationsSortBy.longestFirst).reverse();
                break;
            case VacationsSortBy.mostFollowers:
                vacations.sort((a, b) => a.followersCount < b.followersCount ? 1 : -1);
                break;
        }
        return vacations
    }

    filterVacations(vacations: VacationModel[], showPast: boolean) {
        const now = new Date();
        const remainingVacations = vacations.filter(v => (showPast ? true : v.startDate.getTime() - now.getTime() > 0));
        const expiredVacations = vacations.filter(v => v.startDate.getTime() - now.getTime() < 0);
        return { remainingVacations, expiredVacations };
    }
}

const vacationsService = new VacationsService();
export default vacationsService;