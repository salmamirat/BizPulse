import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import Input from "../components/Input";
import Button from "../components/Button";
import useAuthStore from "../store/authStore";
import { login } from "../services/api";

export default function Login() {
  const router = useRouter();
  const saveSession = useAuthStore((state) => state.saveSession);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !motDePasse) {
      Alert.alert("Connexion", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email.trim(), motDePasse);
const oldProfile = useAuthStore.getState().profile;

await saveSession(
  data.accessToken,
  data.refreshToken,
  {
    ...oldProfile,
    email: email.trim()
  }
);
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Connexion", error.response?.data?.error || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.subtitle}>Connexion</Text>

        <View style={styles.form}>
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="contact@entreprise.ma" keyboardType="email-address" />
          <Input label="Mot de passe" value={motDePasse} onChangeText={setMotDePasse} placeholder="••••••••" secure />
          <Button title={loading ? "Connexion..." : "Se connecter"} onPress={handleLogin} />
        </View>

        <Text style={styles.registerText}>
          Pas encore de compte ? <Link href="/register" style={styles.link}>S'inscrire</Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0FDEC" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  logoImage: { height: 36, width: 140, marginBottom: 20 },
  subtitle: { color: "#5C6E5C", fontSize: 16, fontWeight: "600", marginBottom: 22 },
  form: { width: "100%" },
  registerText: { color: "#5C6E5C", textAlign: "center", fontSize: 12, marginTop: 17 },
  link: { color: "#4A7C59", fontWeight: "700" }
});
