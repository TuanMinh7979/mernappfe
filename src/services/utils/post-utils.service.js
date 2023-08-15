import { updatePost } from "@redux/reducers/post/post.reducer";
import { Utils } from "./utils.service";
export class PostUtils {
  static checkPrivacy(post, profile, loggedUserIdols) {
    const isPrivate =
      post?.privacy === "Private" && post?.userId === profile?._id;
    const isPublic = post?.privacy === "Public";
    const isFollower =
      post?.privacy === "Followers" &&
      (Utils.checkIfUserIsFollowed(loggedUserIdols, post?.userId, profile?._id) ||  post?.userId === profile?._id);
    return isPrivate || isPublic || isFollower;
  }
}
