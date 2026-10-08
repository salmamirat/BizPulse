import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Button({ title, onPress, outline = false, danger = false, disabled = false, icon }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        danger && styles.danger,
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={18} color={outline ? "#6D1B3B" : danger ? "#B3261E" : "#FFFFFF"} style={styles.icon} />}
        <Text style={[styles.text, outline && styles.outlineText, danger && styles.dangerText]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#6D1B3B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  icon: { marginRight: 8 },
  outline: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#6D1B3B" },
  danger: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#B3261E" },
  pressed: { backgroundColor: "#4A1028" },
  disabled: { opacity: 0.6 },
  text: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  outlineText: { color: "#6D1B3B" },
  dangerText: { color: "#B3261E" }
});
