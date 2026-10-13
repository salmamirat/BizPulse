import { useMutation } from '@tanstack/react-query';
import * as apis from './apis';

export const useLogin = () => useMutation({ mutationFn: (data) => apis.login(data.email, data.motDePasse) });
export const useRegister = () => useMutation({ mutationFn: (data) => apis.register(data.nom, data.email, data.motDePasse, data.secteur) });
export const useLogout = () => useMutation({ mutationFn: apis.logout });
export const useUpdateProfile = () => useMutation({ mutationFn: apis.updateProfile });
