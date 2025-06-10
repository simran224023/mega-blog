import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  userPosts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
      state.userPosts.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      
      // Update in posts array
      const index = state.posts.findIndex(post => post.$id === updatedPost.$id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
      
      // Update in userPosts array
      const userIndex = state.userPosts.findIndex(post => post.$id === updatedPost.$id);
      if (userIndex !== -1) {
        state.userPosts[userIndex] = updatedPost;
      }
      
      // Update currentPost if it's the same post
      if (state.currentPost && state.currentPost.$id === updatedPost.$id) {
        state.currentPost = updatedPost;
      }
      
      state.loading = false;
      state.error = null;
    },
    removePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter(post => post.$id !== postId);
      state.userPosts = state.userPosts.filter(post => post.$id !== postId);
      if (state.currentPost && state.currentPost.$id === postId) {
        state.currentPost = null;
      }
      state.loading = false;
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.userPosts = [];
      state.currentPost = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export default postSlice.reducer;
export const {
  setPosts,
  setUserPosts,
  setCurrentPost,
  addPost,
  updatePost,
  removePost,
  clearCurrentPost,
  setLoading,
  setError,
  clearError,
  clearPosts,
} = postSlice.actions;