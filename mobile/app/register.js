import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import { useRegister } from "../services/auth/mutations";
import colors from "../constants/colors";

export default function Register() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [secteur, setSecteur] = useState("");
  const registerMutation = useRegister();
  const loading = registerMutation.isPending;

  function handleRegister() {
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

    registerMutation.mutate(
      {
        nom: nom.trim(),
        email: email.trim(),
        motDePasse,
        secteur: secteur.trim() || undefined
      },
      {
        onSuccess: () => {
          Alert.alert("Compte créé", "Votre compte a été créé. Vous pouvez maintenant vous connecter.");
        },
        onError: (error) => {
          Alert.alert("Inscription", error.response?.data?.error || "Impossible de créer le compte.");
        }
      }
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Pressable onPress={() => router.replace("/login")} hitSlop={12} accessibilityLabel="Retour à la connexion">
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <View style={styles.secureRow}>
            <Ionicons name="shield-checkmark-outline" size={15} color={colors.primary} />
            <Text style={styles.secure}>Données sécurisées</Text>
          </View>
        </View>

        <Image source={require('../assets/logo.svg')} style={styles.logoImage} contentFit="contain" />
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Commencez la gestion claire et sereine de votre activité.</Text>

        <Input label="Nom de l'entreprise" required value={nom} onChangeText={setNom} placeholder="Ex: Atlas Tech SARL" autoCapitalize="words" />
        <Input label="Email" required value={email} onChangeText={setEmail} placeholder="contact@atlastech.ma" keyboardType="email-address" autoCapitalize="none" />
        <Input label="Mot de passe (6 caractères min)" required value={motDePasse} onChangeText={setMotDePasse} placeholder="Au moins 6 caractères" secure autoCapitalize="none" />
        <Input label="Secteur d'activité (optionnel)" value={secteur} onChangeText={setSecteur} placeholder="Ex: Commerce, Services..." autoCapitalize="words" />

        <Button title={loading ? "Création..." : "Créer mon compte"} onPress={handleRegister} disabled={loading} />

        <Text style={styles.loginText}>Déjà un compte ? <Link href="/login" style={styles.link}>Se connecter</Link></Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  secureRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  secure: { color: colors.primary, fontSize: 12, fontWeight: "700" },
  logoImage: { height: 80, width: 280, alignSelf: "center", marginBottom: 24 },
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 5, marginBottom: 20 },
  loginText: { textAlign: "center", color: colors.textMuted, fontSize: 13, marginTop: 15 },
  link: { color: colors.primary, fontWeight: "700" }
});
