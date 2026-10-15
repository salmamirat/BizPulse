import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";
import { login, register, logout, updateProfile } from "./api";

export function useLogin() {
  const router = useRouter();
  const saveSession = useAuthStore((state) => state.saveSession);

  return useMutation({
    mutationFn: ({ email, motDePasse }) => login(email, motDePasse),
    onSuccess: async (data) => {
      await saveSession(data.accessToken, data.refreshToken, data.profile);
      router.replace("/dashboard");
    }
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ nom, email, motDePasse, secteur }) =>
      register(nom, email, motDePasse, secteur),
    onSuccess: () => {
      router.replace("/login");
    }
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      await clear();
      queryClient.clear();
      router.replace("/login");
    }
  });
}

export function useUpdateProfile() {
  const saveProfile = useAuthStore((state) => state.saveProfile);

  return useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: async (serverData) => {
      const currentProfile = useAuthStore.getState().profile;
      await saveProfile({
        ...currentProfile,
        ...serverData
      });
    }
  });
}
