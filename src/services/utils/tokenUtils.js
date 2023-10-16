import jwt_decode from "jwt-decode";
import { updateLoggedUser } from "@redux/reducers/user/user.reducer";
import { emptyLoggedUser } from "@redux/reducers/user/user.reducer";
import { getAPI } from "./fetchData";
export const freshAccessToken = async (
  access_token,
  dispatch) => {

  if (!access_token) return access_token;
  const access_tokenDecode = jwt_decode(access_token);
  if (access_tokenDecode.exp >= Date.now() / 1000) {
    return access_token;
  }

  try {
    const res = await getAPI(`/refresh_token`)

    dispatch(updateLoggedUser({ token: res.data.token, profile: res.data.user }));
    console.log("...............rf DATA token", res.data.token);
    if (res.data && res.data.token) return res.data.token;
  } catch (e) {
    console.log("errrrrrrrrrrrrrrrrrrrrr rf err", e);
    // dispatch(emptyLoggedUser());
    // sessionStorage.removeItem("logged");
    // return;
  }
};