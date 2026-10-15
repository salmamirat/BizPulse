import { useCallback } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import { useDashboard } from "../services/dashboard/queries";
import useAuthStore from "../store/authStore";
import colors from "../constants/colors";

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} DH`;

function formatMonthLabel(m) {
  if (!m || m === "Aucun") return m;
  const parts = m.split("-");
  if (parts.length === 2) {
    return `${parts[1]}/${parts[0].slice(2)}`;
  }
  return m;
}

export default function Dashboard() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const { data: summaryData, isLoading, isError, refetch } = useDashboard();
  const summary = summaryData || { revenus: 0, depenses: 0, solde: 0, parCategorie: {}, evolution: null };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.primary} />
          <Text style={styles.errorTitle}>Impossible de charger les données.</Text>
          <Text style={styles.errorSubtitle}>Vérifiez votre connexion au serveur puis réessayez.</Text>
          <View style={{ width: "100%", maxWidth: 280, marginTop: 16 }}>
            <Button title="Réessayer" onPress={() => refetch()} />
          </View>
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  const categories = Object.entries(summary?.parCategorie || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCategory = categories[0]?.[1] || 1;
  const hasEvolution = summary.evolution && summary.evolution.labels && summary.evolution.labels.length > 1 && summary.evolution.labels[0] !== "Aucun";

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.pageTitle}>Tableau de bord</Text>
              <Text style={styles.hello}>Bonjour, {profile?.nom || "Mon Business"}</Text>
            </View>
            <Pressable onPress={() => router.push("/profile")} style={styles.avatar} accessibilityLabel="Accéder au profil">
              <Ionicons name="person" size={15} color="#FFFFFF" />
            </Pressable>
          </View>

          <Card style={styles.balanceCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>Solde estimé (toutes périodes)</Text>
            </View>
            <Text style={[styles.balance, summary.solde < 0 && { color: colors.expense }]}>{money(summary.solde)}</Text>
          </Card>

          <View style={styles.metrics}>
            <Card style={styles.metric}>
              <View style={styles.metricTitle}>
                <Text style={styles.label}>Revenus</Text>
                <Ionicons name="arrow-up-circle-outline" size={18} color={colors.income} />
              </View>
              <Text style={styles.income}>{money(summary.revenus)}</Text>
            </Card>
            <Card style={styles.metric}>
              <View style={styles.metricTitle}>
                <Text style={styles.label}>Dépenses</Text>
                <Ionicons name="arrow-down-circle-outline" size={18} color={colors.expense} />
              </View>
              <Text style={styles.expense}>{money(summary.depenses)}</Text>
            </Card>
          </View>

          <Card>
            <Text style={styles.sectionTitle}>Dépenses par catégorie</Text>
            {categories.length === 0 ? (
              <Text style={styles.empty}>Aucune dépense pour le moment.</Text>
            ) : (
              categories.map(([name, value]) => (
                <View key={name} style={styles.category}>
                  <View style={styles.categoryLine}>
                    <Text style={styles.categoryName}>{name}</Text>
                    <Text style={styles.categoryValue}>{money(value)}</Text>
                  </View>
                  <View style={styles.bar}>
                    <View style={[styles.fill, { width: `${(value / maxCategory) * 100}%` }]} />
                  </View>
                </View>
              ))
            )}
          </Card>

          <Card>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Évolution</Text>
              {hasEvolution && (
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
                    <Text style={styles.legendText}>Revenus</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
                    <Text style={styles.legendText}>Dépenses</Text>
                  </View>
                </View>
              )}
            </View>
            {hasEvolution ? (
              <LineChart
                data={{
                  labels: summary.evolution.labels.map(formatMonthLabel),
                  datasets: [
                    { data: summary.evolution.revenus, color: () => colors.income },
                    { data: summary.evolution.depenses, color: () => colors.expense }
                  ]
                }}
                width={Dimensions.get("window").width - 64}
                height={220}
                chartConfig={{
                  backgroundColor: "#FFFFFF",
                  backgroundGradientFrom: "#FFFFFF",
                  backgroundGradientTo: "#FFFFFF",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(95, 91, 86, ${opacity})`
                }}
                style={{ marginVertical: 8 }}
              />
            ) : (
              <Text style={styles.empty}>Pas assez de données pour afficher l'évolution.</Text>
            )}
          </Card>

          <Button title="Ajouter une transaction" onPress={() => router.push("/transaction-form")} />
        </ScrollView>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 12 },
  errorSubtitle: { color: colors.textMuted, fontSize: 14, textAlign: "center", marginTop: 6 },
  page: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pageTitle: { color: colors.text, fontSize: 26, fontWeight: "800" },
  hello: { color: colors.textMuted, fontSize: 15, marginTop: 3 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  balanceCard: { paddingVertical: 18 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: colors.textMuted, fontSize: 14 },
  balance: { color: colors.text, fontSize: 34, fontWeight: "800", marginTop: 4 },
  metrics: { flexDirection: "row", gap: 10 },
  metric: { flex: 1, paddingVertical: 15 },
  metricTitle: { flexDirection: "row", justifyContent: "space-between" },
  income: { color: colors.income, fontSize: 20, fontWeight: "800", marginTop: 6 },
  expense: { color: colors.expense, fontSize: 20, fontWeight: "800", marginTop: 6 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 14 },
  category: { marginBottom: 14 },
  categoryLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  categoryName: { color: colors.text, fontSize: 14, fontWeight: "600" },
  categoryValue: { color: colors.textMuted, fontSize: 14 },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.primaryLight, overflow: "hidden" },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  empty: { color: colors.textMuted, fontSize: 14, textAlign: "center", paddingVertical: 12 },
  chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  chartTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  legendContainer: { flexDirection: "row", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: colors.textMuted, fontWeight: "600" }
});
