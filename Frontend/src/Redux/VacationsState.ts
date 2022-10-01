import VacationModel from "../Models/VacationModel";
import { createStore } from "redux";

//1. state
export class VacationsState {
    public vacations: VacationModel[] = null;
}

//2. Action type
export enum VacationsActionType {
    FetchVacations,
    AddVacation,
    UpdateVacation,
    DeleteVacation,
    Follow,
    Unfollow
}

//3. Action
export interface VacationsAction {
    type: VacationsActionType; // the operation to be preformed
    payload: any; // the data to be sent
}

//4. Reducer - a function that preforms the action on the state
export function vacationsReducer(currState = new VacationsState(), action: VacationsAction): VacationsState {
    const newState = { ...currState };

    switch (action.type) {
        case VacationsActionType.AddVacation: // action.payload >>=> vacation to add
            newState.vacations.push(action.payload);
            break;
        case VacationsActionType.DeleteVacation: // action.payload >>=> id of vacation to delete
            const indexToDelete = newState.vacations.findIndex(p => p.id === action.payload);
            if (indexToDelete >= 0) {
                newState.vacations.splice(indexToDelete, 1);
            }
            break;
        case VacationsActionType.FetchVacations: // action.payload >>=> all vacations
            newState.vacations = action.payload;
            break;
        case VacationsActionType.UpdateVacation: // action.payload >>=> vacation to update
            const indexToUpdate = newState.vacations.findIndex(v => v.id === action.payload.id);
            if (indexToUpdate >= 0) {
                newState.vacations[indexToUpdate] = action.payload;
            }
            break;
        case VacationsActionType.Follow: // action.payload >>=> id of new follow
            const fIndexToUpdate = newState.vacations.findIndex(f => f.id === action.payload);
            if (fIndexToUpdate >= 0) {
                newState.vacations[fIndexToUpdate].followersCount++;
                newState.vacations[fIndexToUpdate].isFollowed = true;
            }
            break;
            case VacationsActionType.Unfollow: // action.payload >>=> id of follow to delete
            const fIndexToDelete = newState.vacations.findIndex(f => f.id === action.payload);
            if (fIndexToDelete >= 0) {
                newState.vacations[fIndexToDelete].followersCount--;
                newState.vacations[fIndexToDelete].isFollowed = false;
                break;
            }
    }

    return newState;
}

//5. Store - Redux object to manage the global state
export const vacationsStore = createStore(vacationsReducer);