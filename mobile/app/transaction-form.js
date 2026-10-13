import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../constants/colors";
import { createTransaction, deleteTransaction, updateTransaction } from "../services/api";

const baseRevenus = ["Ventes", "Prestations", "Autre"];
const baseDepenses = ["Loyer", "Transport", "Salaires", "Fournitures", "Marketing", "Logiciels", "Autre"];

function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(str) {
  if (!str) return new Date();
  const parts = str.split("-");
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return new Date(str);
}

export default function TransactionForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editing = Boolean(params.id);
  const [type, setType] = useState(params.type || "depense");
  const [montant, setMontant] = useState(params.montant ? String(params.montant) : "");
  const [categorie, setCategorie] = useState(params.categorie || "Fournitures");
  const [date, setDate] = useState(params.date || formatDate(new Date()));
  const [dateObj, setDateObj] = useState(params.date ? parseLocalDate(params.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleTypeChange(newType) {
    setType(newType);
    setCategorie(newType === "revenu" ? "Ventes" : "Fournitures");
  }

  const currentCategories = type === "revenu" ? baseRevenus : baseDepenses;
  const categoriesList = categorie && !currentCategories.includes(categorie)
    ? [...currentCategories, categorie]
    : currentCategories;

  async function save() {
    if (loading) return;

    const value = Number(String(montant).replace(",", ".").replace(/\s/g, ""));
    if (isNaN(value) || value <= 0) {
      Alert.alert("Montant invalide", "Veuillez saisir un montant supérieur à 0.");
      return;
    }
    if (value > 99999999.99) {
      Alert.alert("Montant trop élevé", "Le montant ne peut pas dépasser 99 999 999,99 DH.");
      return;
    }
    if (!categorie || !categorie.trim()) {
      Alert.alert("Catégorie requise", "Choisissez une catégorie.");
      return;
    }
    if (!date) {
      Alert.alert("Date requise", "Choisissez une date.");
      return;
    }

    try {
      setLoading(true);
      const data = { type, montant: value, categorie: categorie.trim(), date };
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
    if (loading) return;
    Alert.alert("Supprimer", "Supprimer cette transaction ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteTransaction(params.id);
            router.replace("/transactions");
          } catch (error) {
            Alert.alert("Erreur", error.response?.data?.error || "Impossible de supprimer.");
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Retour">
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>
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
              {categoriesList.map((item) => (
                <Pressable key={item} onPress={() => setCategorie(item)} style={[styles.category, categorie === item && styles.categoryActive]}>
                  <Text style={[styles.categoryText, categorie === item && styles.categoryActiveText]}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Date</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn} accessibilityLabel="Choisir la date">
              <Text style={styles.datePickerText}>{date}</Text>
              <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
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
                    setDate(formatDate(selectedDate));
                  }
                }}
              />
            )}

            <View style={styles.btnSpacer} />
            <Button title={loading ? "Enregistrement..." : "Enregistrer"} onPress={save} disabled={loading} />
            {editing && <Button title="Supprimer" onPress={remove} danger disabled={loading} />}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  content: { flexGrow: 1, padding: 16, paddingTop: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { color: colors.text, fontSize: 16, fontWeight: "800" },
  types: { flexDirection: "row", gap: 8, marginBottom: 16 },
  type: { flex: 1, height: 44, borderRadius: 10, backgroundColor: "#F3F0EC", alignItems: "center", justifyContent: "center" },
  revenueActive: { backgroundColor: colors.income },
  expenseActive: { backgroundColor: colors.expense },
  typeText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  revenueText: { color: "#FFFFFF" },
  expenseText: { color: "#FFFFFF" },
  label: { color: colors.text, fontSize: 12, fontWeight: "600", marginBottom: 7 },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 14 },
  category: { paddingHorizontal: 10, height: 32, borderRadius: 9, backgroundColor: colors.primaryLight, justifyContent: "center" },
  categoryActive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.primary },
  categoryText: { color: colors.text, fontSize: 12 },
  categoryActiveText: { color: colors.primary, fontWeight: "700" },
  datePickerBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 48, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14 },
  datePickerText: { color: colors.text, fontSize: 14 },
  btnSpacer: { height: 24 }
});
