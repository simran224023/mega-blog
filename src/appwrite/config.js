import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // Helper function for filtering by userId
  getFilterByUserId(userId) {
    return Query.equal("userId", userId);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        ID.unique(),
        {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  async updatePost({ postId, title, slug, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        postId,
        {
          title,
          slug,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
      await this.databases.deleteDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        postId
      );
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  }

  async getPost(postId) {
    try {
      return await this.databases.getDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        postId
      );
    } catch (error) {
      console.error("Error fetching post:", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        queries
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
      return false;
    }
  }
  async getUserPosts(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        [Query.equal("userId", userId), Query.equal("status", "active")]
      );
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return false;
    }
  }
  async uploadImage(file) {
    try {
      return await this.bucket.createFile(
        conf.appWriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appWriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    try {
      return this.bucket.getFileView(conf.appWriteBucketId, fileId);
    } catch (error) {
      console.error("Error getting file view:", error);
      return null;
    }
  }

  getFileView(fileId) {
    return this.bucket.getFileView(conf.appWriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
