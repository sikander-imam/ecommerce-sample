import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./library/axios";

export const fetchUserById = createAsyncThunk("homepage/fetchByIdStatus", (data, thunkAPI) => {
  console.log(thunkAPI.dispatch);
  console.log(thunkAPI.getState());
  console.log(data);
  return axios.get(`https://jsonplaceholder.typicode.com/posts`);
});
