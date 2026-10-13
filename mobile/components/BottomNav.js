import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../constants/colors";

const items = [
  ["dashboard", "Accueil", "home-outline", "home"],
  ["transactions", "Transactions", "receipt-outline", "receipt"],
  ["chat", "Assistant IA", "sparkles-outline", "sparkles"],
  ["profile", "Profil", "person-outline", "person"]
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 6), height: 60 + Math.max(insets.bottom, 6) }]}>
      {items.map(([route, label, icon, activeIcon]) => {
        const active = pathname.includes(route);
        return (
          <Pressable
            key={route}
            onPress={() => router.replace(`/${route}`)}
            style={styles.item}
            accessibilityLabel={`Onglet ${label}`}
            accessibilityRole="tab"
          >
            <Ionicons name={active ? activeIcon : icon} size={20} color={active ? colors.primary : colors.textMuted} />
            <Text style={[styles.label, active && styles.active]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center" },
  label: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  active: { color: colors.primary, fontWeight: "700" }
});
