import axios from "@services/axios";

class PostService {
  // create post without image
  async createPost(body) {
    const response = await axios.post("/post", body);
    return response;
  }
  // create post with image
  async createPostWithImage(body) {
    const response = await axios.post("/post/image/post", body);
    return response;
  }

  async getAllPosts(page) {
    const response = await axios.get(`/post/all/${page}`);
    return response;
  }

  async getReactionsByUsername(username) {
    const response = await axios.get(`/post/reactions/username/${username}`);
    return response;
  }
  async getSinglePostReactionByUsername(postId, username) {
    const response = await axios.get(
      `/post/single/reactions/username/${username}/${postId}`
    );
    return response;
  }

  async addReaction(body) {
    const response = await axios.post("/post/reaction", body);
    return response;
  }

  async removeReaction(postId, previousReaction, postReactions) {
    const response = await axios.delete(
      `/post/reaction/${postId}/${previousReaction}/${JSON.stringify(
        postReactions
      )}`
    );
    return response;
  }

  async getReactionDocsOfAPost(postId) {
    const response = await axios.get(`/post/reactions/${postId}`);
    return response;
  }


  async createComment(body) {
    const response = await axios.post('/post/comment', body);
    return response;
  }

  async getPostCommentsNames(postId) {
    const response = await axios.get(`/post/commentsnames/${postId}`);
    return response;
  }

  async getPostComments(postId) {
    const response = await axios.get(`/post/comments/${postId}`);
    return response;
  }


  // update post
  async updatePostWithImage(postId, body) {
    const response = await axios.put(`/post/image/${postId}`, body);
    return response;
  }
  async updatePost(postId, body) {
    const response = await axios.put(`/post/${postId}`, body);
    return response;
  }






}

export const postService = new PostService();
