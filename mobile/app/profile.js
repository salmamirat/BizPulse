import { useState } from "react";
import { Alert, StyleSheet, Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import useAuthStore from "../store/authStore";
import { logout, updateProfile } from "../services/api";

const InfoRow = ({ icon, label, value, isEditing, onChangeText, multiline }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={20} color="#800020" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput 
          style={[styles.input, multiline && styles.multilineInput]} 
          value={value} 
          onChangeText={onChangeText} 
          placeholder={`Ajouter ${label.toLowerCase()}...`}
          placeholderTextColor="#7A6A6D"
          multiline={multiline}
        />
      ) : (
        <Text style={[styles.infoValue, !value && styles.emptyValue]}>{value || "Non renseigné"}</Text>
      )}
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

export default function Profile() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const saveProfile = useAuthStore((state) => state.saveProfile);
  const clear = useAuthStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSector, setEditSector] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editOwner, setEditOwner] = useState("");

  async function handleLogout() {
    try { await logout(); } finally { await clear(); router.replace("/"); }
  }

  function handleEdit() {
    setEditName(profile?.nom || "");
    setEditEmail(profile?.email || "");
    setEditSector(profile?.secteur || "");
    setEditAbout(profile?.about || "");
    setEditOwner(profile?.owner || "");
    setIsEditing(true);
  }

  async function handleSave() {
    try {
      const updatedData = { 
        ...profile, 
        nom: editName.trim(), 
        email: editEmail.trim(),
        secteur: editSector.trim(),
        about: editAbout.trim(),
        owner: editOwner.trim()
      };
      
      const serverData = await updateProfile(updatedData);
      
      saveProfile({
        ...updatedData,
        ...serverData
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil. L'email est peut-être déjà utilisé.");
    }
  }

  const displayName = profile?.nom || "Mon Business";
  const email = profile?.email || "";
  const sector = profile?.secteur || "";
  const about = profile?.about || "";
  const owner = profile?.owner || "";

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Profil</Text>
            </View>
            {!isEditing ? (
              <Pressable onPress={handleEdit} hitSlop={10}><Text style={styles.editText}>Modifier</Text></Pressable>
            ) : (
              <Pressable onPress={() => setIsEditing(false)} hitSlop={10}><Text style={styles.cancelText}>Annuler</Text></Pressable>
            )}
          </View>
          
          <Card style={styles.profileCard}>
            <View style={styles.topSection}>
              <View style={styles.mainIconContainer}>
                <Ionicons name="storefront" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.topInfo}>
                {isEditing ? (
                   <TextInput style={styles.titleInput} value={editName} onChangeText={setEditName} placeholder="Nom de l'entreprise" />
                ) : (
                   <Text style={styles.companyName}>{displayName}</Text>
                )}
                
                <View style={[styles.badge, !sector && !isEditing && { backgroundColor: "transparent" }]}>
                  {sector || isEditing ? <Ionicons name="briefcase-outline" size={14} color="#800020" /> : null}
                  {isEditing ? (
                    <TextInput style={styles.badgeInput} value={editSector} onChangeText={setEditSector} placeholder="Secteur" />
                  ) : (
                    <Text style={styles.badgeText}>{sector}</Text>
                  )}
                </View>
              </View>
            </View>

            <Divider />
            <InfoRow icon="mail-outline" label="Email" value={isEditing ? editEmail : email} isEditing={isEditing} onChangeText={setEditEmail} />
            <Divider />
            <InfoRow icon="document-text-outline" label="À propos" value={isEditing ? editAbout : about} isEditing={isEditing} onChangeText={setEditAbout} multiline />
            <Divider />
            <InfoRow icon="person-outline" label="Gérant" value={isEditing ? editOwner : owner} isEditing={isEditing} onChangeText={setEditOwner} />
          </Card>
          
          <View style={styles.spacer} />
          
          {isEditing ? (
            <Button title="Enregistrer" onPress={handleSave} />
          ) : (
            <Button title="Se déconnecter" onPress={() => Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [{ text: "Annuler", style: "cancel" }, { text: "Déconnecter", style: "destructive", onPress: handleLogout }])} danger />
          )}
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
  editText: { color: "#800020", fontWeight: "600", fontSize: 14 },
  cancelText: { color: "#4A3F41", fontWeight: "600", fontSize: 14 },
  profileCard: { padding: 0, overflow: "hidden" },
  topSection: { flexDirection: "row", alignItems: "center", padding: 20, gap: 16 },
  mainIconContainer: { width: 60, height: 60, borderRadius: 16, backgroundColor: "#800020", alignItems: "center", justifyContent: "center" },
  topInfo: { flex: 1 },
  companyName: { color: "#1D1B17", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  titleInput: { color: "#1D1B17", fontSize: 20, fontWeight: "800", borderBottomWidth: 1, borderBottomColor: "#800020", paddingBottom: 4, marginBottom: 8 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: "#EED5DC", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: "#800020", fontSize: 12, fontWeight: "600" },
  badgeInput: { color: "#800020", fontSize: 12, fontWeight: "600", minWidth: 80, padding: 0, borderBottomWidth: 1, borderBottomColor: "#800020" },
  divider: { height: 1, backgroundColor: "#DBC6CB", marginHorizontal: 20 },
  infoRow: { flexDirection: "row", padding: 20, gap: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EED5DC", alignItems: "center", justifyContent: "center" },
  infoTextContainer: { flex: 1, justifyContent: "center" },
  infoLabel: { color: "#4A3F41", fontSize: 13, marginBottom: 4 },
  infoValue: { color: "#1D1B17", fontSize: 14, lineHeight: 22 },
  emptyValue: { color: "#5C4D51", fontStyle: "italic" },
  input: { color: "#1D1B17", fontSize: 14, borderBottomWidth: 1, borderBottomColor: "#800020", paddingBottom: 4 },
  multilineInput: { minHeight: 60, textAlignVertical: "top" },
  spacer: { flex: 1, minHeight: 20 }
});
