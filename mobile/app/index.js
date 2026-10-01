import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [logged, setLogged] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then((token) => setLogged(Boolean(token)));
  }, []);

  if (logged === null) return <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#F0FDEC" }}><ActivityIndicator color="#4A7C59" /></View>;
  return logged ? <Redirect href="/dashboard" /> : <Redirect href="/login" />;
}
