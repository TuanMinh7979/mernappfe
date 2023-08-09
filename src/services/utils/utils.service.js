import { addUser, clearUser } from "@redux/reducers/user/user.reducer";
import { avatarColors } from "./static.data";
import { floor, random } from "lodash";
import { addNotification } from "@root/redux/reducers/notifications/notification.reducer";
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
    dispatch(addUser({ token: result.data.token, profile: result.data.user }));
    setUser(result.data.user);
  };
  static clearStore = ({
    dispatch,
    deleteStorageUsername,
    deleteSessionPageReload,
    setLoggedin,
  }) => {
    dispatch(clearUser());
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedin(false);
  };

  static appEnvironment = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    if (env == "development") {
      return "DEV";
    } else if (env == "production") {
      return "PRO";
    }
  };

  static dispatchNotification(message, type, dispatch) {
    dispatch(addNotification({ message, type }));
  }
  static mapSettingsDropdownItems(setSettings) {
    const items = [];
    const item = {
      topText: 'My Profile',
      subText: 'View personal profile.'
    };
    items.push(item);
    setSettings(items);
    return items;
  }

  static generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
