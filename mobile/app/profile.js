import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import useAuthStore from "../store/authStore";
import { logout } from "../services/api";

export default function Profile() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const clear = useAuthStore((state) => state.logout);

  async function handleLogout() {
    try { await logout(); } finally { await clear(); router.replace("/login"); }
  }

  const displayName = profile?.nom || "Mon entreprise";
  const email = profile?.email || "";
  const sector = profile?.secteur || "Secteur non renseigné";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.page}>
        <View style={styles.content}>
          <Text style={styles.title}>Profil</Text>
          <Card>
            <View style={styles.profileRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
              <View style={styles.identity}><Text style={styles.name}>{displayName}</Text><Text style={styles.email}>{email}</Text></View>
            </View>
            <View style={styles.badge}><Ionicons name="business-outline" size={12} color="#4A7C59" /><Text style={styles.badgeText}>{sector}</Text></View>
          </Card>
          <Button title="Se déconnecter" onPress={() => Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [{ text: "Annuler", style: "cancel" }, { text: "Déconnecter", style: "destructive", onPress: handleLogout }])} danger />
        </View>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0FDEC" },
  page: { flex: 1 },
  content: { flex: 1, padding: 16, gap: 12 },
  title: { color: "#1F2A1F", fontSize: 20, fontWeight: "800" },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#4A7C59", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontWeight: "800" },
  identity: { flex: 1 },
  name: { color: "#1F2A1F", fontSize: 14, fontWeight: "800" },
  email: { color: "#6E7B6E", fontSize: 11, marginTop: 3 },
  badge: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", backgroundColor: "#EAF7E6", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginTop: 12 },
  badgeText: { color: "#4A7C59", fontSize: 10 }
});
