import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/api/user/user.service';
import { Utils } from '@services/utils/utils.service';

const fetchUpdSugUsers = createAsyncThunk('user/getSuggestions', async (accessToken, { dispatch }) => {

  try {
    const response = await userService.fetchUpdSugUsers(accessToken);

    return response.data;
  } catch (error) {
    Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
  }
});

export { fetchUpdSugUsers };
