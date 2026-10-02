import { StyleSheet, View } from "react-native";

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2DA",
    borderRadius: 16,
    padding: 14
  }
});
