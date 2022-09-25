import axios from "axios";
import DestinationModel from "../Models/DestinationModel";
import VacationModel from "../Models/VacationModel";
import { VacationsSortBy } from "../Models/VacationsSortModel";
import { VacationsAction, VacationsActionType, vacationsStore } from "../Redux/VacationsState";
import config from "../Utils/config";

class VacationsService {
    public async getAllVacations(): Promise<VacationModel[]> {
        if (vacationsStore.getState().vacations?.length > 0) {
            return vacationsStore.getState().vacations;
        }
        const response = await axios.get<VacationModel[]>(`${config.vacationsURL}`);
        const vacations = response.data;
        vacations.map(v => {
            v.startDate = new Date(v.startDate);
            v.endDate = new Date(v.endDate);
            return v;
        });
        const action: VacationsAction = { type: VacationsActionType.FetchVacations, payload: vacations };
        vacationsStore.dispatch(action);
        return vacations;
    }

    public async getMyVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(`${config.vacationsURL}/my-vacations`);
        const vacations = response.data;
        vacations.map(v => {
            v.startDate = new Date(v.startDate);
            v.endDate = new Date(v.endDate);
        });
        const action: VacationsAction = { type: VacationsActionType.UpdateFollowing, payload: vacations };
        vacationsStore.dispatch(action);
        return vacations;
    }
    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(`${config.vacationsURL}/${id}`);
        const action: VacationsAction = { type: VacationsActionType.DeleteVacation, payload: id };
        vacationsStore.dispatch(action);
    }

    public async getDestinations(): Promise<DestinationModel[]> {
        const response = await axios.get<DestinationModel[]>(`${config.destinationsURL}`);
        const destinations = response.data;
        return destinations;
    }

    public async addVacation(vacation: VacationModel): Promise<void> {
        const formData = new FormData();
        formData.append("dstName", vacation.dstName);
        formData.append("dstDescription", vacation.dstDescription);
        formData.append("dstId", vacation.dstId.toString());
        formData.append("price", vacation.price.toString());
        formData.append("startDate", vacation.startDate.toISOString());
        formData.append("endDate", vacation.endDate.toISOString());
        formData.append("image", vacation.image[0]);

        const result = await axios.post(`${config.vacationsURL}`, formData);
        const addedVacation = result.data;
        addedVacation.startDate = new Date(addedVacation.startDate);
        addedVacation.endDate = new Date(addedVacation.endDate);
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
        const formData = new FormData();
        formData.append("id", vacation.id.toString());
        formData.append("following", vacation.following.toString());
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
        const action: VacationsAction = { type: VacationsActionType.Follow, payload: vId };
        vacationsStore.dispatch(action);
    }

    public async unfollowAfter(vId: number): Promise<void> {
        await axios.delete(`${config.vacationsURL}/${vId}/unfollow`);
        const action: VacationsAction = { type: VacationsActionType.Unfollow, payload: vId };
        vacationsStore.dispatch(action);
    }

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
            case VacationsSortBy.myVacationsFirst:
                const following = vacationsStore.getState().following;
                const valid = this.filterVacations(following, false).remainingVacations
                const orderedVacations = [...valid];
                for (let v of vacations) {
                    if (following.findIndex(f => v.id === f.id) < 0) {
                        orderedVacations.push(v);
                    }
                }
                vacations = orderedVacations;
                break;
            case VacationsSortBy.mostFollowers:
                vacations.sort((a, b) => a.following < b.following ? 1 : -1);
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