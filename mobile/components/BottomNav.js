import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

const items = [
  ["dashboard", "Accueil", "home-outline", "home"],
  ["transactions", "Transactions", "receipt-outline", "receipt"],
  ["chat", "Assistant IA", "sparkles-outline", "sparkles"],
  ["profile", "Profil", "person-outline", "person"]
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      {items.map(([route, label, icon, activeIcon]) => {
        const active = pathname.includes(route);
        return (
          <Pressable key={route} onPress={() => router.replace(`/${route}`)} style={styles.item}>
            <Ionicons name={active ? activeIcon : icon} size={18} color={active ? "#4A7C59" : "#6E7B6E"} />
            <Text style={[styles.label, active && styles.active]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 66,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#D4E5D4",
    paddingBottom: 5
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center" },
  label: { color: "#6E7B6E", fontSize: 9, marginTop: 4 },
  active: { color: "#4A7C59", fontWeight: "700" }
});
