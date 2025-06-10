import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import service from '../appwrite/config';
import { 
  setPosts, 
  setUserPosts, 
  setCurrentPost, 
  addPost, 
  updatePost, 
  removePost, 
  setLoading, 
  setError, 
  clearError,
  clearCurrentPost 
} from '../store/postSlice';

export const usePostService = () => {
  const dispatch = useDispatch();
  const { posts, userPosts, currentPost, loading, error } = useSelector(
    state => state.posts
  );

  const getAllPosts = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await service.getPosts();
      if (response && response.documents) {
        dispatch(setPosts(response.documents));
        return response.documents;
      } else {
        dispatch(setPosts([]));
        return [];
      }
    } catch (error) {
      console.error("Error fetching all posts:", error);
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const getUserPosts = useCallback(async (userId) => {
    if (!userId) {
      dispatch(setError("User ID is required"));
      return [];
    }

    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await service.getUserPosts(userId);
      if (response && response.documents) {
        dispatch(setUserPosts(response.documents));
        return response.documents;
      } else {
        dispatch(setUserPosts([]));
        return [];
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const getPostById = useCallback(async (postId) => {
    if (!postId) {
      dispatch(setError("Post ID is required"));
      return null;
    }

    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const post = await service.getPost(postId);
      if (post) {
        dispatch(setCurrentPost(post));
        return post;
      } else {
        dispatch(setError("Post not found"));
        return null;
      }
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      dispatch(setError(error.message));
      return null;
    }
  }, [dispatch]);

  const createNewPost = useCallback(async (postData) => {
    if (!postData) {
      dispatch(setError("Post data is required"));
      throw new Error("Post data is required");
    }

    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const newPost = await service.createPost(postData);
      if (newPost) {
        dispatch(addPost(newPost));
        return newPost;
      } else {
        dispatch(setError("Failed to create post"));
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const updateExistingPost = useCallback(async (postData) => {
    if (!postData || !postData.postId) {
      dispatch(setError("Post data with ID is required"));
      return { success: false, message: "Post data with ID is required" };
    }

    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const updatedPost = await service.updatePost(postData);
      if (updatedPost) {
        dispatch(updatePost(updatedPost));
        return { success: true, post: updatedPost };
      } else {
        const errorMessage = "Failed to update post";
        dispatch(setError(errorMessage));
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Error updating post:", error);
      dispatch(setError(error.message));
      return { success: false, message: error.message };
    }
  }, [dispatch]);

  const deleteExistingPost = useCallback(async (postId, featuredImage = null) => {
    if (!postId) {
      dispatch(setError("Post ID is required"));
      return false;
    }

    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const success = await service.deletePost(postId);
      if (success) {
        // Also delete featured image if it exists
        if (featuredImage) {
          try {
            await service.deleteFile(featuredImage);
          } catch (fileError) {
            console.warn("Error deleting featured image:", fileError);
            // Don't fail the entire operation if image deletion fails
          }
        }
        dispatch(removePost(postId));
        return true;
      } else {
        dispatch(setError("Failed to delete post"));
        return false;
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      dispatch(setError(error.message));
      return false;
    }
  }, [dispatch]);

  const uploadImage = useCallback(async (file) => {
    if (!file) {
      dispatch(setError("File is required"));
      return null;
    }

    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const uploadedFile = await service.uploadImage(file);
      if (uploadedFile) {
        dispatch(setLoading(false));
        return uploadedFile;
      } else {
        dispatch(setError("Failed to upload image"));
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      dispatch(setError(error.message));
      return null;
    }
  }, [dispatch]);

  const getImagePreview = useCallback((fileId) => {
    try {
      return service.getFilePreview(fileId);
    } catch (error) {
      console.error("Error getting image preview:", error);
      return null;
    }
  }, []);

  const getImageView = useCallback((fileId) => {
    try {
      return service.getFileView(fileId);
    } catch (error) {
      console.error("Error getting image view:", error);
      return null;
    }
  }, []);

  const clearCurrentPostData = useCallback(() => {
    dispatch(clearCurrentPost());
  }, [dispatch]);

  const clearPostError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    posts,
    userPosts,
    currentPost,
    loading,
    error,
    
    // Methods
    getAllPosts,
    getUserPosts,
    getPostById,
    createNewPost,
    updateExistingPost,
    deleteExistingPost,
    uploadImage,
    getImagePreview,
    getImageView,
    clearCurrentPostData,
    clearPostError,
  };
};

export default usePostService;