import VacationModel from "../Models/VacationModel";
import { createStore } from "redux";

//1. state
export class VacationsState {
    public vacations: VacationModel[] = null;
    public following: VacationModel[] = null;
}

//2. Action type
export enum VacationsActionType {
    FetchVacations,
    AddVacation,
    UpdateVacation,
    DeleteVacation,
    UpdateFollowing,
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
        case VacationsActionType.UpdateFollowing: // action.payload >>=> all following
            newState.following = action.payload;
            break;
        case VacationsActionType.Follow: // action.payload >>=> id of new follow
            const fIndexToUpdate = newState.vacations.findIndex(f => f.id === action.payload);
            if (fIndexToUpdate >= 0) {
                newState.vacations[fIndexToUpdate].following++;
                newState.following.push(newState.vacations[fIndexToUpdate]);
            }
            break;
        case VacationsActionType.Unfollow: // action.payload >>=> id of follow to delete
            const fIndexToDelete = newState.following.findIndex(f => f.id === action.payload);
            if (fIndexToDelete >= 0) {
                newState.following.splice(fIndexToDelete, 1);
            }
            const vIndexToDelete = newState.vacations.findIndex(f => f.id === action.payload);
            if (vIndexToDelete >= 0) {
                newState.vacations[vIndexToDelete].following--;
                break;
            }
    }

    return newState;
}

//5. Store - Redux object to manage the global state
export const vacationsStore = createStore(vacationsReducer);