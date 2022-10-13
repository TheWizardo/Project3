import axios from "axios";
import CredentialsModel from "../Models/CredentialsModel";
import UserModel from "../Models/UserModel";
import { AuthAction, AuthActionType, authStore } from "../Redux/AuthState";
import config from "../Utils/config";
import sha256 from "../Utils/hash";
import jwtDecode from "jwt-decode";

class AuthService {
    public async register(user: UserModel): Promise<void> {
        user.password = sha256(user.password);
        const response = await axios.post<string>(`${config.authURL}/register`, user);
        // receiving token
        const token = response.data;
        // saving token in the redux store
        const action: AuthAction = { type: AuthActionType.Register, payload: token };
        authStore.dispatch(action);
    }
    
    public async login(cred: CredentialsModel): Promise<void> {
        // hashing the password
        cred.password = sha256(cred.password);
        const response = await axios.post<string>(`${config.authURL}/login`, cred);
        // receiving token
        const token = response.data;
        // saving token in the redux store
        const action: AuthAction = { type: AuthActionType.Login, payload: token };
        authStore.dispatch(action);
    }

    public logout(): void {
        const authAction: AuthAction = { type: AuthActionType.Logout };
        authStore.dispatch(authAction);
    }

    public async usernameExists(username: string): Promise<boolean> {
        // checking if username exists
        const response = await axios.get<boolean>(`${config.authURL}/${username}`);
        return response.data;
    }
    
    // checking if user has admin privileges
    public isAdmin(user: UserModel = null): boolean {
        if (!user) {
            user = authStore.getState().user;
            if (!user) return false;
        }
        return user.role === "Admin";
    }

    // checking if a valid token exists;
    public isLoggedIn(): boolean {
        if (authStore.getState().token === null) return false;
        const container: { exp: number} = jwtDecode(authStore.getState().token);
        const now = new Date();
        // token.exp is in seconds, while Date.getTime is in milliseconds
        return container.exp * 1000 > now.getTime();
    }

}

const authService = new AuthService();
export default authService;