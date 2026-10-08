import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Input({ label, value, onChangeText, placeholder, secure = false, keyboardType = "default" }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isSecureInput = secure && !isPasswordVisible;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#77736D"
          secureTextEntry={isSecureInput}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={styles.input}
        />
        {secure && (
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={10}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#77736D"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { color: "#2D2B2F", fontSize: 12, fontWeight: "600", marginBottom: 6 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2DA",
    borderRadius: 12,
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: 14,
    color: "#2D2B2F",
    fontSize: 14,
  },
  eyeIcon: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  }
});
