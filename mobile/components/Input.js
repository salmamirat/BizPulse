import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Input({ label, value, onChangeText, placeholder, secure = false, keyboardType = "default" }) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#77736D"
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { color: "#2D2B2F", fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2DA",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#2D2B2F",
    fontSize: 14
  }
});
