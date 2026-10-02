import { Alert, StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import useAuthStore from "../store/authStore";
import { logout } from "../services/api";

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={20} color="#800020" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, !value && styles.emptyValue]}>{value || "Non renseigné"}</Text>
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

export default function Profile() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const clear = useAuthStore((state) => state.logout);

  async function handleLogout() {
    try { await logout(); } finally { await clear(); router.replace("/"); }
  }

  const displayName = profile?.nom || "Mon entreprise";
  const email = profile?.email || "";
  const sector = profile?.secteur || "";

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/")} hitSlop={15}>
                <Ionicons name="arrow-back" size={24} color="#800020" />
              </Pressable>
              <Text style={styles.title}>Profil</Text>
            </View>
          </View>
          
          <Card style={styles.profileCard}>
            <View style={styles.topSection}>
              <View style={styles.mainIconContainer}>
                <Ionicons name="business" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.topInfo}>
                <Text style={styles.companyName}>{displayName}</Text>
                
                <View style={[styles.badge, !sector && { backgroundColor: "transparent" }]}>
                  {sector ? <Ionicons name="briefcase-outline" size={14} color="#800020" /> : null}
                  <Text style={styles.badgeText}>{sector}</Text>
                </View>
              </View>
            </View>

            <Divider />
            <InfoRow icon="mail-outline" label="Email" value={email} />
          </Card>
          
          <View style={styles.spacer} />
          
          <Button title="Se déconnecter" onPress={() => Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [{ text: "Annuler", style: "cancel" }, { text: "Déconnecter", style: "destructive", onPress: handleLogout }])} danger />
        </ScrollView>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF8F9" },
  page: { flex: 1 },
  content: { flexGrow: 1, padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  title: { color: "#1D1B17", fontSize: 24, fontWeight: "800" },
  profileCard: { padding: 0, overflow: "hidden" },
  topSection: { flexDirection: "row", alignItems: "center", padding: 20, gap: 16 },
  mainIconContainer: { width: 60, height: 60, borderRadius: 16, backgroundColor: "#800020", alignItems: "center", justifyContent: "center" },
  topInfo: { flex: 1 },
  companyName: { color: "#1D1B17", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: "#EED5DC", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: "#800020", fontSize: 12, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#DBC6CB", marginHorizontal: 20 },
  infoRow: { flexDirection: "row", padding: 20, gap: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EED5DC", alignItems: "center", justifyContent: "center" },
  infoTextContainer: { flex: 1, justifyContent: "center" },
  infoLabel: { color: "#4A3F41", fontSize: 13, marginBottom: 4 },
  infoValue: { color: "#1D1B17", fontSize: 14, lineHeight: 22 },
  emptyValue: { color: "#5C4D51", fontStyle: "italic" },
  spacer: { flex: 1, minHeight: 20 }
});
