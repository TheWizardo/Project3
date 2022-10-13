import axios from "axios";
import { authStore } from "../Redux/AuthState";

class InterceptorService {
    public createInterceptor() {
        // injecting each and every sent request with the user token
        axios.interceptors.request.use((request) => {
            if (authStore.getState().token){
                request.headers = {
                    "authorization": `Bearer ${authStore.getState().token}`
                };
            }
            return request;
        });
    }
}

const interceptorService = new InterceptorService();
export default interceptorService;