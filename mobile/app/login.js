import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import { Image } from "expo-image";
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Connexion", "Veuillez entrer une adresse email valide.");
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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topSpace} />
        
        <Image source={require('../assets/logo.svg')} style={styles.logoImage} contentFit="contain" />
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Connectez-vous pour gérer votre activité.</Text>
        
        <View style={styles.form}>
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="contact@entreprise.ma" keyboardType="email-address" />
          <Input label="Mot de passe" value={motDePasse} onChangeText={setMotDePasse} placeholder="••••••••" secure />
          <Button title={loading ? "Connexion..." : "Se connecter"} onPress={handleLogin} disabled={loading} />
        </View>

        <Text style={styles.registerText}>
          Pas encore de compte ? <Link href="/register" style={styles.link}>S'inscrire</Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7F5" },
  content: { flexGrow: 1, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30 },
  topSpace: { height: 40 }, // to roughly match register's top bar height
  logoImage: { height: 80, width: 280, alignSelf: "center", marginBottom: 24 },
  title: { color: "#2D2B2F", fontSize: 22, fontWeight: "800" },
  subtitle: { color: "#77736D", fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 20 },
  form: { width: "100%" },
  registerText: { textAlign: "center", color: "#77736D", fontSize: 12, marginTop: 15 },
  link: { color: "#6D1B3B", fontWeight: "700" }
});
