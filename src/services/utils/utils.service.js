import {
  updateLoggedUser,
  emptyLoggedUser,
} from "@redux/reducers/user/user.reducer";
import { avatarColors } from "./static.data";
import { floor, random } from "lodash";
import {
  updateToastsNewEle,
  removeToasts,
} from "@redux/reducers/notifications/toasts.reducer";
export class Utils {
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  static generateAvatar(text, backgroundColor, foregroundColor = "white") {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "normal 80px sans-serif";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  }

  static dispatchUser = (result, pageReload, dispatch, setUser) => {
    pageReload(true);
    dispatch(
      updateLoggedUser({ token: result.data.token, profile: result.data.user })
    );
    setUser(result.data.user);
  };
  static clearStore = ({
    dispatch,
    deleteStorageUsername,
    deleteSessionPageReload,
    setLoggedin,
  }) => {
    dispatch(emptyLoggedUser());
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedin(false);
  };

  static appEnvironment = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log("ENVVVVVV", env);
    if (env == "development") {
      return "DEV";
    } else if (env == "production") {
      return "PRO";
    }
  };

  static updToastsNewEle(message, type, dispatch) {
    dispatch(updateToastsNewEle({ message, type }));
  }
  static remToasts(dispatch) {
    dispatch(removeToasts());
  }
  static mapSettingsDropdownItems(setSettings) {
    const items = [];
    const item = {
      topText: "My Profile",
      subText: "View personal profile.",
    };
    items.push(item);
    setSettings(items);
    return items;
  }

  static generateString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static appImageUrl(version, id) {
    if (typeof version === "string" && typeof id === "string") {
      version = version.replace(/['"]+/g, "");
      id = id.replace(/['"]+/g, "");
    }
    return `https://res.cloudinary.com/djnekmzdf/image/upload/v${version}/${id}`;
  }

  static checkIfUserIsBlocked(blocked, userId) {
    console.log(blocked);
    return blocked && blocked.length >= 0 && blocked.some((id) => id === userId);
  }

  static checkIfUserIsFollowed(userFollowers, postCreatorId, userId) {
    return userFollowers.some(
      (user) => user._id === postCreatorId || postCreatorId === userId
    );
  }


  static getImage(imageId, imageVersion) {
    return imageId && imageVersion ? this.appImageUrl(imageVersion, imageId) : '';
  }

  static appImageUrl(version, id) {
    if (typeof version === 'string' && typeof id === 'string') {
      version = version.replace(/['"]+/g, '');
      id = id.replace(/['"]+/g, '');
    }
    return `https://res.cloudinary.com/djnekmzdf/image/upload/v${version}/${id}`;
  }


}
