import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";
export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.account = new Account(this.client);
  }
  userCache = {};
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      // Handle guest users gracefully - don't throw error
      if (error.code === 401 || error.type === "general_unauthorized_scope") {
        console.log("User not authenticated (guest user)");
        return null;
      }
      console.error("Error getting current user:", error);
      return null; // Return null instead of throwing
    }
  }
  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async getUserById(userId) {
    // Return from cache if available to reduce API calls
    if (
      this.userCache[userId] &&
      Date.now() - this.userCache[userId].timestamp < 3600000
    ) {
      // Cache for 1 hour
      return this.userCache[userId].data;
    }

    try {
      // This gets the user from Appwrite's auth system
      const user = await this.account.get(userId);

      // Store relevant user data in cache
      this.userCache[userId] = {
        data: {
          $id: user.$id,
          name: user.name,
          email: user.email,
        },
        timestamp: Date.now(),
      };

      return this.userCache[userId].data;
    } catch (error) {
      console.error("Error fetching user from Auth:", error);
      return {
        $id: userId,
        name: `User ${userId.substring(0, 4)}`,
      };
    }
  }

  async updatePassword(currentPassword, newPassword) {
    try {
      // Appwrite's updatePassword requires the new password first, then the old password
      await this.account.updatePassword(newPassword, currentPassword);

      // If we reach here, the password update was successful
      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);

      // Detect authentication errors which indicate incorrect current password
      if (
        error.code === 401 ||
        error.code === "user_invalid_credentials" ||
        error.type === "authentication_failed" ||
        (error.message &&
          (error.message.includes("Invalid credentials") ||
            error.message.includes("authentication failed") ||
            error.message.includes("Password update failed")))
      ) {
        // Return a specific error object for incorrect password
        return {
          success: false,
          message: "Current password is incorrect",
          code: 401,
          requiresLogout: true, // Flag to indicate security logout is needed
        };
      }

      // For other types of errors, return a generic error
      return {
        success: false,
        message: "Failed to update password",
        code: error.code || 500,
        requiresLogout: false,
      };
    }
  }

  clearCache() {
    this.userCache = {};
  }
}

const authService = new AuthService();
export default authService;
