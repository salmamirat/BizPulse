import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TransactionItem({ item, onPress }) {
  const income = item.type === "revenu";
  const date = new Date(`${item.date}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.icon, income ? styles.incomeBg : styles.expenseBg]}>
        <Ionicons name={income ? "arrow-down" : "arrow-up"} size={15} color={income ? "#2E9E5B" : "#D9534F"} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.categorie}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={[styles.amount, income ? styles.income : styles.expense]}>
        {income ? "+" : "−"} {Number(item.montant).toLocaleString("fr-FR")} DH
      </Text>
      <Ionicons name="chevron-forward" size={15} color="#9AAA9A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 64, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#EEF5EE", gap: 10 },
  pressed: { opacity: 0.65 },
  icon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  incomeBg: { backgroundColor: "#E7F6E9" },
  expenseBg: { backgroundColor: "#FCE8E6" },
  info: { flex: 1 },
  title: { color: "#1F2A1F", fontSize: 13, fontWeight: "700" },
  date: { color: "#6E7B6E", fontSize: 10, marginTop: 3 },
  amount: { fontSize: 12, fontWeight: "700" },
  income: { color: "#2E9E5B" },
  expense: { color: "#D9534F" }
});
