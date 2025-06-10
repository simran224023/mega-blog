import conf from "../conf/conf";
import { Client } from "appwrite";

export class PreferencesService {
  client = new Client();

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
  }

  async getUserPreferences(userId) {
    try {
      const preferences = localStorage.getItem(`user_preferences_${userId}`);
      return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return this.getDefaultPreferences();
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      const updatedPreferences = {
        ...preferences,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(
        `user_preferences_${userId}`,
        JSON.stringify(updatedPreferences)
      );

      // Apply dark mode to the document if it's enabled
      this.applyThemePreferences(updatedPreferences);

      return updatedPreferences;
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  }

  getDefaultPreferences() {
    return {
      profile: {
        bio: "",
      },
      displayPreferences: {
        darkMode: false,
        compactView: false,
      },
      initialized: false,
    };
  }

  applyThemePreferences(preferences) {
    try {
      if (preferences.displayPreferences?.darkMode) {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }
    } catch (error) {
      console.error("Error applying theme preferences:", error);
    }
  }

  clearPreferencesCache(userId) {
    try {
      localStorage.removeItem(`user_preferences_${userId}`);
    } catch (error) {
      console.error("Error clearing preferences cache:", error);
    }
  }
}

const preferencesService = new PreferencesService();
export default preferencesService;