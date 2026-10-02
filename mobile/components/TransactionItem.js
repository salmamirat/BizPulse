import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TransactionItem({ item, onPress }) {
  const income = item.type === "revenu";
  const date = new Date(`${item.date}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.icon, income ? styles.incomeBg : styles.expenseBg]}>
        <Ionicons name={income ? "arrow-down" : "arrow-up"} size={15} color={income ? "#2E9E5B" : "#B3261E"} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.categorie}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={[styles.amount, income ? styles.income : styles.expense]}>
        {income ? "+" : "−"} {Number(item.montant).toLocaleString("fr-FR")} DH
      </Text>
      <Ionicons name="chevron-forward" size={15} color="#77736D" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 64, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#E8E2DA", gap: 10 },
  pressed: { opacity: 0.65 },
  icon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  incomeBg: { backgroundColor: "rgba(46, 158, 91, 0.12)" },
  expenseBg: { backgroundColor: "rgba(179, 38, 30, 0.12)" },
  info: { flex: 1 },
  title: { color: "#2D2B2F", fontSize: 13, fontWeight: "700" },
  date: { color: "#77736D", fontSize: 10, marginTop: 3 },
  amount: { fontSize: 12, fontWeight: "700" },
  income: { color: "#2E9E5B" },
  expense: { color: "#B3261E" }
});
