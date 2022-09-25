import jwtDecode from "jwt-decode";
import { createStore } from "redux";
import UserModel from "../Models/UserModel";

export class AuthState {
    public token: string = null;
    public user: UserModel = null;

    constructor() {
        this.token = sessionStorage.getItem("token");
        if (this.token) {
            const container: { user: UserModel } = jwtDecode(this.token); //container is a wrapper object containing the user
            this.user = container.user;
        }
    }
}

export enum AuthActionType {
    Register,
    Login,
    Logout
}

export interface AuthAction {
    type: AuthActionType;
    payload?: any;
}

export function authReducer(currState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currState };

    switch (action.type) {
        case AuthActionType.Register:
        case AuthActionType.Login:
            newState.token = action.payload;
            sessionStorage.setItem("token", action.payload);
            const container: { user: UserModel } = jwtDecode(newState.token); //container is a wrapper object containing the user
            newState.user = container.user;
            break;
        case AuthActionType.Logout:
            sessionStorage.removeItem("token");
            newState.token = null;
            newState.user = null;
            break;
    }
    return newState;
}

export const authStore = createStore(authReducer);