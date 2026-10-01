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
    backgroundColor: "#4A7C59",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  outline: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#4A7C59" },
  danger: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D9534F" },
  pressed: { backgroundColor: "#3B6447" },
  text: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  outlineText: { color: "#4A7C59" },
  dangerText: { color: "#D9534F" }
});
