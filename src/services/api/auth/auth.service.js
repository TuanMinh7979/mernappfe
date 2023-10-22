import { getAPI } from "@services/utils/fetchData";
import axios from "../../axios";
class AuthService {
    async signUp(body) {
        return await axios.post('/signup', body);

    }
    async signIn(body) {
        return await axios.post('/signin', body);

    }




}
export const authService = new AuthService()