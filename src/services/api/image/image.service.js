import axios from '@services/axios';
import { deleteAPI, getAPI, postAPI } from '@services/utils/fetchData';

class ImageService {
  async getUserImages(userId, accessToken) {
    return getAPI(`/images/${userId}`, accessToken);

  }

  async addImage(url, data, accessToken) {
    return await postAPI(url, { image: data }, accessToken);

  }

  async removeImage(url, accessToken) {
    return await deleteAPI(url, accessToken);

  }



}

export const imageService = new ImageService();
