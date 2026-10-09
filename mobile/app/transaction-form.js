import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { createTransaction, deleteTransaction, updateTransaction } from "../services/api";

const categoriesRevenu = ["Ventes", "Prestations", "Loyer (Revenu)", "Autre"];
const categoriesDepense = ["Loyer", "Transport", "Salaires", "Fournitures", "Marketing", "Logiciels", "Autre"];

export default function TransactionForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editing = Boolean(params.id);
  const [type, setType] = useState(params.type || "depense");
  const [montant, setMontant] = useState(params.montant ? String(params.montant) : "");
  const [categorie, setCategorie] = useState(params.categorie || "Fournitures");
  const [date, setDate] = useState(params.date || new Date().toISOString().slice(0, 10));
  const [dateObj, setDateObj] = useState(params.date ? new Date(params.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleTypeChange(newType) {
    setType(newType);
    setCategorie(newType === "revenu" ? "Ventes" : "Fournitures");
  }

  async function save() {
    const value = Number(String(montant).replace(",", ".").replace(/\s/g, ""));
    if (!value || value <= 0 || !categorie || !date) {
      Alert.alert("Transaction", "Vérifiez le montant, la catégorie et la date.");
      return;
    }

    try {
      setLoading(true);
      const data = { type, montant: value, categorie, date };
      if (editing) await updateTransaction(params.id, data);
      else await createTransaction(data);
      router.replace("/transactions");
    } catch (error) {
      Alert.alert("Transaction", error.response?.data?.error || "Impossible d'enregistrer la transaction.");
    } finally {
      setLoading(false);
    }
  }

  function remove() {
    Alert.alert("Supprimer", "Supprimer cette transaction ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        try { await deleteTransaction(params.id); router.replace("/transactions"); }
        catch (error) { Alert.alert("Erreur", error.response?.data?.error || "Impossible de supprimer."); }
      }}
    ]);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={20} color="#2D2B2F" /></Pressable>
            <Text style={styles.title}>{editing ? "Modifier la transaction" : "Ajouter une transaction"}</Text>
            <View style={{ width: 20 }} />
          </View>

          <Card>
            <View style={styles.types}>
              <Pressable onPress={() => handleTypeChange("revenu")} style={[styles.type, type === "revenu" && styles.revenueActive]}>
                <Text style={[styles.typeText, type === "revenu" && styles.revenueText]}>↑  Revenu</Text>
              </Pressable>
              <Pressable onPress={() => handleTypeChange("depense")} style={[styles.type, type === "depense" && styles.expenseActive]}>
                <Text style={[styles.typeText, type === "depense" && styles.expenseText]}>↓  Dépense</Text>
              </Pressable>
            </View>

            <Input label="Montant (DH)" value={montant} onChangeText={setMontant} placeholder="2 500" keyboardType="decimal-pad" />

            <Text style={styles.label}>Catégorie</Text>
            <View style={styles.categories}>
              {(type === "revenu" ? categoriesRevenu : categoriesDepense).map((item) => (
                <Pressable key={item} onPress={() => setCategorie(item)} style={[styles.category, categorie === item && styles.categoryActive]}>
                  <Text style={[styles.categoryText, categorie === item && styles.categoryActiveText]}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Date</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
              <Text style={styles.datePickerText}>{date}</Text>
              <Ionicons name="calendar-outline" size={18} color="#77736D" />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setDateObj(selectedDate);
                    setDate(selectedDate.toISOString().slice(0, 10));
                  }
                }}
              />
            )}
            
            <View style={styles.btnSpacer} />
            <Button title={loading ? "Enregistrement..." : "Enregistrer"} onPress={save} />
            {editing && <Button title="Supprimer" onPress={remove} danger />}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7F5" },
  page: { flex: 1 },
  content: { flexGrow: 1, padding: 16, paddingTop: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { color: "#2D2B2F", fontSize: 16, fontWeight: "800" },
  types: { flexDirection: "row", gap: 8, marginBottom: 16 },
  type: { flex: 1, height: 44, borderRadius: 10, backgroundColor: "#F3F0EC", alignItems: "center", justifyContent: "center" },
  revenueActive: { backgroundColor: "#2E9E5B" },
  expenseActive: { backgroundColor: "#B3261E" },
  typeText: { color: "#77736D", fontSize: 12, fontWeight: "700" },
  revenueText: { color: "#FFFFFF" },
  expenseText: { color: "#FFFFFF" },
  label: { color: "#2D2B2F", fontSize: 12, fontWeight: "600", marginBottom: 7 },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 14 },
  category: { paddingHorizontal: 10, height: 32, borderRadius: 9, backgroundColor: "#F8E9EC", justifyContent: "center" },
  categoryActive: { backgroundColor: "#F8F4F0", borderWidth: 1, borderColor: "#6D1B3B" },
  categoryText: { color: "#2D2B2F", fontSize: 10 },
  categoryActiveText: { color: "#6D1B3B", fontWeight: "700" },
  datePickerBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 48, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA", borderRadius: 12, paddingHorizontal: 14 },
  datePickerText: { color: "#2D2B2F", fontSize: 14 },
  btnSpacer: { height: 24 }
});
