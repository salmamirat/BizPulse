import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Input({ label, value, onChangeText, placeholder, secure = false, keyboardType = "default" }) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7A897A"
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
  label: { color: "#1F2A1F", fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D4E5D4",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#1F2A1F",
    fontSize: 14
  }
});
