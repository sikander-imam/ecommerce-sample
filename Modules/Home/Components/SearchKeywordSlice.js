import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  SearchKeyword: "",
};

const SearchKeywordSlice = createSlice({
  name: "SearchKeywordSlice",
  initialState,
  reducers: {
    // SearchKeyword Reducer
    setSearchKeyword: (state, { payload }) => {
      state.SearchKeyword = payload;
    },
    resetSearchKeyword: (state) => {
      state = initialState;
    },
  },
});

export const { setSearchKeyword } = SearchKeywordSlice.actions;
export default SearchKeywordSlice.reducer;

// Selectors
export const SearchKeywordSelector = (state) => state.SearchKeyword.SearchKeyword;
