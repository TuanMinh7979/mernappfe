import jwt_decode from "jwt-decode";
import { updateLoggedUserProfile } from "@redux/reducers/user/user.reducer";

import { getAPI } from "./fetchData";
import { Utils } from "./utils.service";

export const newestAccessToken = async (dispatch) => {
  //make sure logged success before goto here, (accessTk and profile is exist) 
  const existAccessToken = sessionStorage.getItem("accessToken");

  if (isAccessTokenValid(existAccessToken)) {
    return existAccessToken;
  } else {
    try {
      const res = await getAPI(`/refresh_token`);
      dispatch(updateLoggedUserProfile(res.data.user));
      sessionStorage.setItem("accessToken", res.data.token);
      return
    } catch (e) {
      console.log("???????????????????????---------------------------ERROR 3", e);
      Utils.clearStore(dispatch)
      return
    }

  }
};

export const isAccessTokenExist = (tk) => {
  return tk;
};

export const isAccessTokenValid = (tk) => {
  const access_tokenDecode = jwt_decode(tk);
  console.log(access_tokenDecode.exp, "__________", Date.now() / 1000);
  return access_tokenDecode.exp >= Date.now() / 1000;
};
