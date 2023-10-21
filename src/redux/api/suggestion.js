import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@services/api/user/user.service";


const fetchUpdSugUsers = createAsyncThunk(
  "user/getSuggestions",
  async (name, { dispatch }) => {
    const response = await userService.fetchUpdSugUsers();

    return response.data;
  }
);

export { fetchUpdSugUsers };
