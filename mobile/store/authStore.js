import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const PROFILE_KEY = "bizpulse_profile";

const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  profile: null,
  loading: true,

  loadSession: async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const profileText = await SecureStore.getItemAsync(PROFILE_KEY);
    let profile = null;
    try { profile = profileText ? JSON.parse(profileText) : null; } catch { profile = null; }
    set({ accessToken, refreshToken, profile, loading: false });

    // Met à jour le profil si un token existe (ignore si échec)
    if (accessToken) {
      try {
        const { getMe } = require("../services/api");
        const meData = await getMe();
        await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(meData));
        set({ profile: meData });
      } catch (e) {}
    }
  },

  saveSession: async (accessToken, refreshToken, profile) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    if (profile) {
      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
      set({ accessToken, refreshToken, profile });
    } else {
      set({ accessToken, refreshToken });
    }
  },

  saveProfile: async (profile) => {
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
    set({ profile });
  },

  setAccessToken: async (accessToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    set({ accessToken });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync(PROFILE_KEY);
    set({ accessToken: null, refreshToken: null, profile: null });
  }
}));

export default useAuthStore;
