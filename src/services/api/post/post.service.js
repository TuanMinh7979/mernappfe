import axios from "@services/axios";
import { deleteAPI, getAPI, postAPI, putAPI } from "@services/utils/fetchData";

class PostService {
  // create post without image
  async createPost(body, accessToken) {
    return await postAPI("/post", body, accessToken);

  }
  // create post with image
  async createPostWithImage(body, accessToken) {
    return await postAPI("/post/image/post", body, accessToken);

  }

  async getAllPosts(page, accessToken) {
    return await getAPI(`/post/all/${page}`, accessToken);

  }

  async getReactionsByUsername(username, accessToken) {
    return await getAPI(`/post/reactions/username/${username}`, accessToken);

  }
  async getSinglePostReactionByUsername(postId, username, accessToken) {
    return await getAPI(
      `/post/single/reactions/username/${username}/${postId}`, accessToken
    );

  }

  async addReaction(body, accessToken) {
    return await postAPI("/post/reaction", body, accessToken);

  }

  async removeReaction(postId, previousReaction, postReactions, accessToken) {
    return await deleteAPI(
      `/post/reaction/${postId}/${previousReaction}/${JSON.stringify(
        postReactions
      )}`,
      accessToken
    );

  }

  async getReactionDocsOfAPost(postId, accessToken) {
    return await getAPI(`/post/reactions/${postId}`, accessToken);

  }


  async createComment(body, accessToken) {
    return await postAPI('/post/comment', body, accessToken);

  }

  async getPostCommentsNames(postId, accessToken) {
    return await getAPI(`/post/commentsnames/${postId}`, accessToken);

  }

  async getPostComments(postId, accessToken) {
    return await getAPI(`/post/comments/${postId}`, accessToken);

  }


  // update post
  async updatePostWithNewImage(postId, body, accessToken) {
    return await putAPI(`/post/image/${postId}`, body, accessToken);

  }
  async updatePost(postId, body, accessToken) {
    return await putAPI(`/post/${postId}`, body, accessToken);

  }

  async deletePost(postId, accessToken) {
    return await deleteAPI(`/post/${postId}`, accessToken);

  }

  async getPostsWithImages(page, accessToken) {
    return await getAPI(`/post/images/${page}`, accessToken);

  }





}

export const postService = new PostService();
