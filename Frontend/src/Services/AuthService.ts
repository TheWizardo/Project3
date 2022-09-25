import axios from "axios";
import CredentialsModel from "../Models/CredentialsModel";
import UserModel from "../Models/UserModel";
import { AuthAction, AuthActionType, authStore } from "../Redux/AuthState";
import { VacationsAction, VacationsActionType, vacationsStore } from "../Redux/VacationsState";
import config from "../Utils/config";
import sha256 from "../Utils/hash";
import jwtDecode from "jwt-decode";

class AuthService {
    public async register(user: UserModel): Promise<void> {
        user.password = sha256(user.password);
        const response = await axios.post<string>(`${config.authURL}/register`, user);
        const token = response.data;
        const action: AuthAction = { type: AuthActionType.Register, payload: token };
        authStore.dispatch(action);
    }

    public async login(cred: CredentialsModel): Promise<void> {
        cred.password = sha256(cred.password);
        const response = await axios.post<string>(`${config.authURL}/login`, cred);
        const token = response.data;
        const action: AuthAction = { type: AuthActionType.Login, payload: token };
        authStore.dispatch(action);
    }

    public logout(): void {
        const authAction: AuthAction = { type: AuthActionType.Logout };
        authStore.dispatch(authAction);
        const vacationsAction: VacationsAction = { type: VacationsActionType.UpdateFollowing, payload: [] };
        vacationsStore.dispatch(vacationsAction);
    }

    public async usernameExists(username: string): Promise<boolean> {
        const response = await axios.get<boolean>(`${config.authURL}/${username}`);
        return response.data;
    }

    public isAdmin(user: UserModel = null): boolean {
        if (!user) {
            user = authStore.getState().user;
            if (!user) return false;
        }
        return user.role === "Admin";
    }

    public isLoggedIn(): boolean {
        if (authStore.getState().token === null) return false;
        const container: { exp: number} = jwtDecode(authStore.getState().token);
        const now = new Date();
        return container.exp * 1000 > now.getTime();
    }

}

const authService = new AuthService();
export default authService;