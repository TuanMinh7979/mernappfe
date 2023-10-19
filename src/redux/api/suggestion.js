import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/api/user/user.service';
import { Utils } from '@services/utils/utils.service';

const fetchUpdSugUsers = createAsyncThunk('user/getSuggestions', async (name, { dispatch }) => {

  try {
    const response = await userService.fetchUpdSugUsers();

    return response.data;
  } catch (error) {
    Utils.displayError(error ,dispatch);
  }
});

export { fetchUpdSugUsers };
