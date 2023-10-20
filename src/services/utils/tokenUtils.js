import jwt_decode from "jwt-decode";
import { updateLoggedUserProfile } from "@redux/reducers/user/user.reducer";

import { getAPI } from "./fetchData";
import { Utils } from "./utils.service";

export const newestAccessToken = async (dispatch) => {
  const existAccessToken = sessionStorage.getItem("accessToken");

  //make sure logged success before goto here, (accessTk and profile is exist)
  if (isAccessTokenValid(existAccessToken)) {
    return existAccessToken;
  } else {
    try {
      Utils.displayInfo("Refreshing token", dispatch, true)
      const res = await getAPI(`/refresh_token`);
      dispatch(updateLoggedUserProfile(res.data.user));
      sessionStorage.setItem("accessToken", res.data.token);
      return res.data.token;
    } catch (e) {
   

      Utils.displayError(e, dispatch, 1)
      Utils.clearStore(dispatch);
      return existAccessToken;
    }
  }
};

export const isAccessTokenExist = (tk) => {
  return tk;
};

export const isAccessTokenValid = (tk) => {
  if (!tk) return false;
  const access_tokenDecode = jwt_decode(tk);
  return access_tokenDecode.exp >= Date.now() / 1000;
};
