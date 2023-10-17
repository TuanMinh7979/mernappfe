import jwt_decode from "jwt-decode";
import { updateLoggedUser } from "@redux/reducers/user/user.reducer";
import { emptyLoggedUser } from "@redux/reducers/user/user.reducer";
import { getAPI } from "./fetchData";
export const freshAccessToken = async (access_token, dispatch) => {
  if (!access_token) return access_token;
  const access_tokenDecode = jwt_decode(access_token);
  if (access_tokenDecode.exp >= Date.now() / 1000) {
    return access_token;
  }

  try {
    const res = await getAPI(`/refresh_token`);

    dispatch(
      updateLoggedUser({ token: res.data.token, profile: res.data.user })
    );
    sessionStorage.setItem("accessToken", res.data.token);
    console.log(
      "...............freshAccessToken token",
      res.data.token.substring(res.data.token.length - 6)
    );
    if (res.data && res.data.token) return res.data.token;
  } catch (e) {
    console.log("REEEEEEEEEFRESHT TOKEN ERR", e);
    dispatch(emptyLoggedUser());
    sessionStorage.removeItem("logged");
    sessionStorage.removeItem('accessToken');
    return;
  }
};
