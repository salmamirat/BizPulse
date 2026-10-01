import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import { getDashboard, getTransactions } from "../services/api";
import useAuthStore from "../store/authStore";

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} DH`;

export default function Dashboard() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const [summary, setSummary] = useState({ revenus: 0, depenses: 0, solde: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryData, expenseData] = await Promise.all([
        getDashboard(),
        getTransactions({ page: 1, limit: 100, type: "depense", sort: "montant" })
      ]);
      setSummary(summaryData);

      const totals = {};
      (expenseData.data || []).forEach((item) => {
        totals[item.categorie] = (totals[item.categorie] || 0) + Number(item.montant);
      });
      setCategories(Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5));
    } catch {
      setSummary({ revenus: 0, depenses: 0, solde: 0 });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return <SafeAreaView style={styles.loading}><ActivityIndicator color="#4A7C59" /></SafeAreaView>;
  }

  const maxCategory = categories[0]?.[1] || 1;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.pageTitle}>Tableau de bord</Text>
              <Text style={styles.hello}>Bonjour, {profile?.nom || "votre entreprise"}</Text>
            </View>
            <Pressable onPress={() => router.push("/profile")} style={styles.avatar}>
              <Ionicons name="person" size={15} color="#FFFFFF" />
            </Pressable>
          </View>

          <Card style={styles.balanceCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>Solde estimé</Text>
              <Ionicons name="wallet-outline" size={18} color="#4A7C59" />
            </View>
            <Text style={styles.balance}>{money(summary.solde)}</Text>
          </Card>

          <View style={styles.metrics}>
            <Card style={styles.metric}>
              <View style={styles.metricTitle}><Text style={styles.label}>Revenus</Text><Text style={styles.up}>↗</Text></View>
              <Text style={styles.income}>{money(summary.revenus)}</Text>
            </Card>
            <Card style={styles.metric}>
              <View style={styles.metricTitle}><Text style={styles.label}>Dépenses</Text><Text style={styles.down}>↘</Text></View>
              <Text style={styles.expense}>{money(summary.depenses)}</Text>
            </Card>
          </View>

          <Card>
            <Text style={styles.sectionTitle}>Dépenses par catégorie</Text>
            {categories.length === 0 ? (
              <Text style={styles.empty}>Aucune dépense pour le moment.</Text>
            ) : categories.map(([name, value]) => (
              <View key={name} style={styles.category}>
                <View style={styles.categoryLine}>
                  <Text style={styles.categoryName}>{name}</Text>
                  <Text style={styles.categoryValue}>{money(value)}</Text>
                </View>
                <View style={styles.bar}><View style={[styles.fill, { width: `${(value / maxCategory) * 100}%` }]} /></View>
              </View>
            ))}
          </Card>

          <Button title="＋  Ajouter une transaction" onPress={() => router.push("/transaction-form")} />
        </ScrollView>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0FDEC" },
  loading: { flex: 1, backgroundColor: "#F0FDEC", alignItems: "center", justifyContent: "center" },
  page: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pageTitle: { color: "#1F2A1F", fontSize: 17, fontWeight: "800" },
  logoImage: { height: 28, width: 100, marginBottom: 8 },
  hello: { color: "#5C6E5C", fontSize: 11, marginTop: 3 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#4A7C59", alignItems: "center", justifyContent: "center" },
  balanceCard: { paddingVertical: 15 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: "#5C6E5C", fontSize: 10 },
  balance: { color: "#1F2A1F", fontSize: 29, fontWeight: "800", marginTop: 4 },
  metrics: { flexDirection: "row", gap: 10 },
  metric: { flex: 1, paddingVertical: 13 },
  metricTitle: { flexDirection: "row", justifyContent: "space-between" },
  income: { color: "#2E9E5B", fontSize: 16, fontWeight: "800", marginTop: 6 },
  expense: { color: "#D9534F", fontSize: 16, fontWeight: "800", marginTop: 6 },
  up: { color: "#2E9E5B", fontSize: 14 },
  down: { color: "#D9534F", fontSize: 14 },
  sectionTitle: { color: "#1F2A1F", fontSize: 13, fontWeight: "800", marginBottom: 12 },
  category: { marginBottom: 11 },
  categoryLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  categoryName: { color: "#1F2A1F", fontSize: 11, fontWeight: "600" },
  categoryValue: { color: "#5C6E5C", fontSize: 10 },
  bar: { height: 6, borderRadius: 4, backgroundColor: "#E8F2E8", overflow: "hidden" },
  fill: { height: 6, borderRadius: 4, backgroundColor: "#4A7C59" },
  empty: { color: "#5C6E5C", fontSize: 11 }
});
