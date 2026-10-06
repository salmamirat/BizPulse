import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
      await saveSession(
        data.accessToken,
        data.refreshToken,
        data.profile
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
        <Image source={require('../assets/logo.svg')} style={styles.logoImage} contentFit="contain" />
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
  screen: { flex: 1, backgroundColor: "#FAF7F5" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  backButton: { position: "absolute", top: 60, left: 20, zIndex: 10 },
  logoImage: { height: 80, width: 280, alignSelf: "center", marginBottom: 24 },
  subtitle: { color: "#77736D", fontSize: 16, fontWeight: "600", marginBottom: 22 },
  form: { width: "100%" },
  registerText: { color: "#77736D", textAlign: "center", fontSize: 12, marginTop: 17 },
  link: { color: "#6D1B3B", fontWeight: "700" }
});
