import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function TransactionItem({ item, onPress }) {
  const income = item.type === "revenu";
  const date = new Date(`${item.date}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Transaction ${item.categorie}, ${income ? "revenu" : "dépense"} de ${Number(item.montant).toLocaleString("fr-FR")} DH`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.icon, income ? styles.incomeBg : styles.expenseBg]}>
        <Ionicons name={income ? "arrow-up" : "arrow-down"} size={15} color={income ? colors.income : colors.expense} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.categorie}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={[styles.amount, income ? styles.income : styles.expense]}>
        {income ? "+" : "−"} {Number(item.montant).toLocaleString("fr-FR")} DH
      </Text>
      <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 64, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 },
  pressed: { opacity: 0.65 },
  icon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  incomeBg: { backgroundColor: "rgba(30, 123, 69, 0.12)" },
  expenseBg: { backgroundColor: "rgba(179, 38, 30, 0.12)" },
  info: { flex: 1 },
  title: { color: colors.text, fontSize: 14, fontWeight: "700" },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  amount: { fontSize: 14, fontWeight: "700" },
  income: { color: colors.income },
  expense: { color: colors.expense }
});
