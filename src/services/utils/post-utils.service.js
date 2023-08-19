import { updatePost } from "@redux/reducers/post/post.reducer";
import { Utils } from "./utils.service";
import { socketService } from "@services/socket/socket.service";
export class PostUtils {
  static checkPrivacy(post, profile, loggedUserIdols) {
    const isPrivate =
      post?.privacy === "Private" && post?.userId === profile?._id;
    const isPublic = post?.privacy === "Public";
    const isFollower =
      post?.privacy === "Followers" &&
      (Utils.checkIfUserIsFollowed(
        loggedUserIdols,
        post?.userId,
        profile?._id
      ) ||
        post?.userId === profile?._id);
    return isPrivate || isPublic || isFollower;
  }

  // * Params:
  // * posts: outer state
  // * setPosts: outer set state function
  static socketIOPost(posts, setPosts) {
    socketService?.socket?.on("add post", (post) => {
      // add at first
      posts = [post, ...posts];
      setPosts(posts);
    });

    socketService?.socket?.on("update post", (updatedPosts) => {
      const updatedPost= updatedPosts[0]
      let newPosts = [...posts]
      console.log("yesssssssssssssss", updatedPost);
      const index = posts.findIndex((el) => el._id == updatedPost._id);
      if (index > -1) {
        newPosts.splice(index, 1, updatedPost);
        setPosts([...newPosts]);
      }
    });
    socketService?.socket?.on("delete post", (postId) => {
      setPosts(posts.filter((item) => item._id === postId));
    });

    // from post.socket.ts in server after sending emit('reaction') in client at ReactionAndCommentArea
    socketService?.socket?.on("update reaction", (reactionData) => {
      const oldPostData = posts.find(
        (post) => post._id === reactionData?.postId
      );

      let newPostData = { ...oldPostData };

      newPostData.reactions = { ...reactionData.postReactions };

      // // update state posts
      let newPosts = [...posts];
      const index = newPosts.findIndex((el) => el._id == newPostData?._id);
      console.log("AO GIAC ROI", reactionData);
      if (index > -1) {
        console.log("IDXXXXXXXXXXXXXXXX", index);
        newPosts.splice(index, 1, newPostData);

        console.log("NNNNNNNNNNNNNNNNEWWWWWWWWWWWWWWWWWWW POST", newPostData, newPosts);
        setPosts([...newPosts]);
      }
    });
    socketService?.socket?.on("update comment", (commentData) => {
      const newPosts = [...posts]
      const oldPostData = newPosts.find(
        (post) => post._id === commentData?.postId
      );

      if (!oldPostData) return
      let newPostData = { ...oldPostData };
      newPostData.commentsCount = commentData.commentsCount;
      // update state newPosts
      const index = newPosts.findIndex((el) => el._id == newPostData?._id);
      if (index > -1) {
        newPosts.splice(index, 1, newPostData);
        setPosts(newPosts);
      }
    });
  }

  static updateAPost(posts, updatedPost, setPosts) { }
}
