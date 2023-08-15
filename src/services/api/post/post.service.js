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



}

export const postService = new PostService();
