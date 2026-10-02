import { Pressable, StyleSheet, Text } from "react-native";

export default function Button({ title, onPress, outline = false, danger = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        danger && styles.danger,
        pressed && styles.pressed
      ]}
    >
      <Text style={[styles.text, outline && styles.outlineText, danger && styles.dangerText]}>{title}</Text>
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
  outline: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#6D1B3B" },
  danger: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#B3261E" },
  pressed: { backgroundColor: "#4A1028" },
  text: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  outlineText: { color: "#6D1B3B" },
  dangerText: { color: "#B3261E" }
});
