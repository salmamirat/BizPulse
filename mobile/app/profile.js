import { useState } from "react";
import { Alert, StyleSheet, Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import useAuthStore from "../store/authStore";
import { useLogout, useUpdateProfile } from "../services/auth/mutations";
import colors from "../constants/colors";

const InfoRow = ({ icon, label, value, isEditing, onChangeText, multiline, keyboardType, autoCapitalize = "sentences" }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={20} color={colors.primary} />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Ajouter ${label.toLowerCase()}...`}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      ) : (
        <Text style={[styles.infoValue, !value && styles.emptyValue]}>
          {value || "Non renseigné"}
        </Text>
      )}
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

export default function Profile() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);

  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const saving = updateProfileMutation.isPending;
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSector, setEditSector] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editOwner, setEditOwner] = useState("");

  function handleLogout() {
    logoutMutation.mutate();
  }

  function handleEdit() {
    setEditName(profile?.nom || "");
    setEditEmail(profile?.email || "");
    setEditSector(profile?.secteur || "");
    setEditAbout(profile?.about || "");
    setEditOwner(profile?.owner || "");
    setIsEditing(true);
  }

  function handleSave() {
    if (saving) return;

    if (!editName.trim()) {
      Alert.alert("Profil", "Le nom de l'entreprise est obligatoire.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail.trim())) {
      Alert.alert("Profil", "Veuillez entrer une adresse email valide.");
      return;
    }

    const updatedData = {
      nom: editName.trim(),
      email: editEmail.trim(),
      secteur: editSector.trim(),
      about: editAbout.trim(),
      owner: editOwner.trim()
    };

    updateProfileMutation.mutate(updatedData, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: (error) => {
        Alert.alert("Erreur", error.response?.data?.error || "Impossible de mettre à jour le profil.");
      }
    });
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
              <Pressable
                onPress={handleEdit}
                hitSlop={10}
                style={styles.editButton}
                accessibilityLabel="Modifier le profil"
              >
                <Ionicons name="pencil" size={16} color={colors.primary} />
              </Pressable>
            ) : (
              <Pressable onPress={() => setIsEditing(false)} hitSlop={10} accessibilityLabel="Annuler les modifications">
                <Text style={styles.cancelText}>Annuler</Text>
              </Pressable>
            )}
          </View>

          <Card style={styles.profileCard}>
            <View style={styles.topSection}>
              <View style={styles.mainIconContainer}>
                <Ionicons name="storefront" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.topInfo}>
                {isEditing ? (
                  <TextInput
                    style={styles.titleInput}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Nom de l'entreprise"
                    placeholderTextColor={colors.textMuted}
                  />
                ) : (
                  <Text style={styles.companyName}>{displayName}</Text>
                )}

                <View style={[styles.badge, !sector && !isEditing && { backgroundColor: "transparent" }]}>
                  {sector || isEditing ? <Ionicons name="briefcase-outline" size={14} color={colors.primary} /> : null}
                  {isEditing ? (
                    <TextInput
                      style={styles.badgeInput}
                      value={editSector}
                      onChangeText={setEditSector}
                      placeholder="Secteur"
                      placeholderTextColor={colors.textMuted}
                    />
                  ) : (
                    <Text style={styles.badgeText}>{sector}</Text>
                  )}
                </View>
              </View>
            </View>

            <Divider />
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={isEditing ? editEmail : email}
              isEditing={isEditing}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Divider />
            <InfoRow
              icon="document-text-outline"
              label="À propos"
              value={isEditing ? editAbout : about}
              isEditing={isEditing}
              onChangeText={setEditAbout}
              multiline
            />
            <Divider />
            <InfoRow
              icon="person-outline"
              label="Gérant"
              value={isEditing ? editOwner : owner}
              isEditing={isEditing}
              onChangeText={setEditOwner}
            />
          </Card>

          <View style={styles.spacer} />

          {isEditing ? (
            <Button
              title={saving ? "Enregistrement..." : "Enregistrer"}
              onPress={handleSave}
              disabled={saving}
            />
          ) : (
            <Button
              title="Se déconnecter"
              onPress={() =>
                Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [
                  { text: "Annuler", style: "cancel" },
                  { text: "Déconnecter", style: "destructive", onPress: handleLogout }
                ])
              }
              danger
            />
          )}
          <Text style={styles.version}>BizPulse v1.0.0</Text>
        </ScrollView>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  content: { flexGrow: 1, padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  editButton: { padding: 4, backgroundColor: colors.primaryLight, borderRadius: 12, width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  cancelText: { color: colors.textMuted, fontWeight: "600", fontSize: 14 },
  profileCard: { padding: 0, overflow: "hidden" },
  topSection: { flexDirection: "row", alignItems: "center", padding: 20, gap: 16 },
  mainIconContainer: { width: 60, height: 60, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  topInfo: { flex: 1 },
  companyName: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 8 },
  titleInput: { color: colors.text, fontSize: 20, fontWeight: "800", borderBottomWidth: 1, borderBottomColor: colors.primary, paddingBottom: 4, marginBottom: 8 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: colors.primaryLight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: colors.primary, fontSize: 12, fontWeight: "600" },
  badgeInput: { color: colors.primary, fontSize: 12, fontWeight: "600", minWidth: 80, padding: 0, borderBottomWidth: 1, borderBottomColor: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20 },
  infoRow: { flexDirection: "row", padding: 20, gap: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  infoTextContainer: { flex: 1, justifyContent: "center" },
  infoLabel: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
  infoValue: { color: colors.text, fontSize: 14, lineHeight: 22 },
  emptyValue: { color: colors.textMuted, fontStyle: "italic", fontSize: 13 },
  input: { color: colors.text, fontSize: 14, borderBottomWidth: 1, borderBottomColor: colors.primary, paddingBottom: 4 },
  multilineInput: { minHeight: 60, textAlignVertical: "top" },
  spacer: { flex: 1, minHeight: 20 },
  version: { textAlign: "center", color: colors.textMuted, fontSize: 12, marginTop: 16 }
});
