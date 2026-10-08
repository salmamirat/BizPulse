import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import useAuthStore from "../store/authStore";
import { register } from "../services/api";

export default function Register() {
  const router = useRouter();
  const saveProfile = useAuthStore((state) => state.saveProfile);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [secteur, setSecteur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nom.trim() || !email.trim() || !motDePasse) {
      Alert.alert("Inscription", "Veuillez remplir les champs obligatoires.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Inscription", "Veuillez entrer une adresse email valide.");
      return;
    }

    if (motDePasse.length < 6) {
      Alert.alert("Inscription", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setLoading(true);
      const data = await register(nom.trim(), email.trim(), motDePasse, secteur.trim() || undefined);
      await saveProfile({ nom: data.nom, email: data.email, secteur: secteur.trim() });
      Alert.alert("Compte créé", "Votre compte a été créé. Vous pouvez maintenant vous connecter.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Inscription", error.response?.data?.error || "Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Pressable onPress={() => router.replace("/login")} hitSlop={12}>
            <Ionicons name="arrow-back" size={19} color="#2D2B2F" />
          </Pressable>
          <View style={styles.secureRow}>
            <Ionicons name="shield-checkmark-outline" size={13} color="#6D1B3B" />
            <Text style={styles.secure}>Données sécurisées</Text>
          </View>
        </View>

        <Image source={require('../assets/logo.svg')} style={styles.logoImage} contentFit="contain" />
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Commencez la gestion claire et sereine de votre activité.</Text>

        <Input label="Nom de l'entreprise" value={nom} onChangeText={setNom} placeholder="Ex: Atlas Tech SARL" />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="contact@atlastech.ma" keyboardType="email-address" />
        <Input label="Mot de passe (6 caractères min)" value={motDePasse} onChangeText={setMotDePasse} placeholder="Au moins 6 caractères" secure />
        <Input label="Secteur d'activité (optionnel)" value={secteur} onChangeText={setSecteur} placeholder="Ex: Commerce, Services..." />

        <Button title={loading ? "Création..." : "Créer mon compte"} onPress={handleRegister} disabled={loading} />

        <Text style={styles.loginText}>Déjà un compte ? <Link href="/login" style={styles.link}>Se connecter</Link></Text>
        <Text style={styles.legal}>En continuant, vous acceptez les conditions d'utilisation et la politique de confidentialité.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7F5" },
  content: { flexGrow: 1, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  secureRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  secure: { color: "#6D1B3B", fontSize: 10, fontWeight: "700" },
  logoImage: { height: 80, width: 280, alignSelf: "center", marginBottom: 24 },
  title: { color: "#2D2B2F", fontSize: 22, fontWeight: "800" },
  subtitle: { color: "#77736D", fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 20 },
  loginText: { textAlign: "center", color: "#77736D", fontSize: 12, marginTop: 15 },
  link: { color: "#6D1B3B", fontWeight: "700" },
  legal: { textAlign: "center", color: "#77736D", fontSize: 9, lineHeight: 13, marginTop: 14 }
});
