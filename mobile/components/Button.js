import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function Button({ title, onPress, outline = false, danger = false, disabled = false, icon, accessibilityLabel }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        danger && styles.danger,
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={18} color={outline ? colors.primary : danger ? colors.expense : "#FFFFFF"} style={styles.icon} />}
        <Text style={[styles.text, outline && styles.outlineText, danger && styles.dangerText]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  icon: { marginRight: 8 },
  outline: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.primary },
  danger: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.expense },
  pressed: { backgroundColor: colors.primaryDark },
  disabled: { opacity: 0.6 },
  text: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  outlineText: { color: colors.primary },
  dangerText: { color: colors.expense }
});
