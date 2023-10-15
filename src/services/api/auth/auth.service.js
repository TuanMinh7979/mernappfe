import { getAPI } from "@services/utils/fetchData";
import axios from "../../axios";
class AuthService {
    async signUp(body) {
        const response = await axios.post('/signup', body);
        return response
    }
    async signIn(body) {
        const response = await axios.post('/signin', body);
        return response
    }


}
export const authService = new AuthService()