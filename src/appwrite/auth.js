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
      if (error.code === 401 || error.type === "general_unauthorized_scope") {
        console.log("User not authenticated (guest user)");
        return null;
      }
      console.error("Error getting current user:", error);
      return null; 
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
    if (
      this.userCache[userId] &&
      Date.now() - this.userCache[userId].timestamp < 3600000
    ) {
      return this.userCache[userId].data;
    }

    try {
      const user = await this.account.get(userId);

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
      await this.account.updatePassword(newPassword, currentPassword);
      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      if (
        error.code === 401 ||
        error.code === "user_invalid_credentials" ||
        error.type === "authentication_failed" ||
        (error.message &&
          (error.message.includes("Invalid credentials") ||
            error.message.includes("authentication failed") ||
            error.message.includes("Password update failed")))
      ) {
        return {
          success: false,
          message: "Current password is incorrect",
          code: 401,
          requiresLogout: true,
        };
      }
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
