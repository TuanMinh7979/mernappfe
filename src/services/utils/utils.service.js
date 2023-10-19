import { emptyLoggedUser } from "@redux/reducers/user/user.reducer";
import { avatarColors } from "./static.data";
import { floor, random } from "lodash";
import { removeToasts } from "@redux/reducers/notifications/toasts.reducer";
import { updateToastsNewEle } from "@redux/reducers/notifications/toasts.reducer";
import millify from "millify";
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

  static clearStore = (dispatch) => {
    dispatch(emptyLoggedUser());
    sessionStorage.removeItem("accessToken");
  };

  static displayError(error, dispatch) {
    console.log("----------error", error);
    let message = "";
    let type = "error";
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
      type = "clientError";
    }

    if (message && type) {
      dispatch(updateToastsNewEle({ message, type }));
    }
  }
  static displaySuccess(message, dispatch) {
    dispatch(updateToastsNewEle({ message, type: "success" }));
  }
  static remToasts(dispatch) {
    dispatch(removeToasts());
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
    return `${process.env.REACT_APP_CLOUD_IMAGE_URL}/image/upload/v${version}/${id}`;
  }

  static checkIfUserIsBlocked(myBlockedByArray, postAuthorUserId) {
    return (
      myBlockedByArray &&
      myBlockedByArray.length >= 0 &&
      myBlockedByArray.some((id) => id === postAuthorUserId)
    );
  }

  static checkIfUserIsFollowed(idols, postCreatorId, loggedUserId) {
    return idols.some(
      (user) => user._id === postCreatorId || postCreatorId === loggedUserId
    );
  }

  static getImage(imageId, imageVersion) {
    return imageId && imageVersion
      ? this.appImageUrl(imageVersion, imageId)
      : "";
  }

  static appImageUrl(version, id) {
    if (typeof version === "string" && typeof id === "string") {
      version = version.replace(/['"]+/g, "");
      id = id.replace(/['"]+/g, "");
    }
    return `${process.env.REACT_APP_CLOUD_IMAGE_URL}/image/upload/v${version}/${id}`;
  }

  static firstLetterUpperCase(word) {
    if (!word) return "";
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  // object to array of object
  static formattedReactions(reactions) {
    const postReactions = [];
    for (const [key, value] of Object.entries(reactions)) {
      if (value > 0) {
        const reactionObject = {
          type: key,
          value,
        };
        postReactions.push(reactionObject);
      }
    }
    return postReactions;
  }

  static shortenLargeNumbers(data) {
    if (data === undefined) {
      return 0;
    } else {
      return millify(data);
    }
  }

  static renameFile(element) {
    // change to png image file

    const fileName = element.name.split(".").slice(0, -1).join(".");
    const blob = element.slice(0, element.size, "image/png");

    const newFile = new File([blob], `${fileName}.png`, { type: "image/png" });

    return newFile;
  }
}
