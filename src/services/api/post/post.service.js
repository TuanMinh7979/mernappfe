import axios from "@services/axios";
import { deleteAPI, getAPI, postAPI, putAPI } from "@services/utils/fetchData";
import { newestAccessToken } from "@services/utils/tokenUtils";
export const postService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },

  // create post without image
  createPost: async function (body) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await postAPI("/post", body, accessToken);
  },
  // create post with image
  createPostWithImage: async function (body) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await postAPI("/post/image/post", body, accessToken);
  },

  getAllPosts: async function (page) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/post/all/${page}`, accessToken);
  },
  getReactionsByUsername: async function (username) {
    let accessToken = await newestAccessToken(this.dispatch);
    return await getAPI(`/post/reactions/username/${username}`, accessToken);
  },
  getSinglePostReactionByUsername: async function (
    postId,
    username
  ) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(
      `/post/single/reactions/username/${username}/${postId}`,
      accessToken
    );
  },
  addReaction: async function (body) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await postAPI("/post/reaction", body, accessToken);
  },
  removeReaction: async function (
    postId,
    previousReaction,
    postReactions
  ) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await deleteAPI(
      `/post/reaction/${postId}/${previousReaction}/${JSON.stringify(
        postReactions
      )}`,
      accessToken
    );
  },
  getReactionDocsOfAPost: async function (postId) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/post/reactions/${postId}`, accessToken);
  },
  createComment: async function (body) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await postAPI("/post/comment", body, accessToken);
  },
  getPostCommentsNames: async function (postId) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/post/commentsnames/${postId}`, accessToken);
  },
  getPostComments: async function (postId) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/post/comments/${postId}`, accessToken);
  },
  // update post
  updatePostWithNewImage: async function (postId, body) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await putAPI(`/post/image/${postId}`, body, accessToken);
  },
  updatePost: async function (postId, body) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await putAPI(`/post/${postId}`, body, accessToken);
  },
  deletePost: async function (postId) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await deleteAPI(`/post/${postId}`, accessToken);
  },
  getPostsWithImages: async function (page) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/post/images/${page}`, accessToken);
  },
};
