import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import TransactionItem from "../components/TransactionItem";
import BottomNav from "../components/BottomNav";
import Button from "../components/Button";
import { deleteTransaction, getTransactions } from "../services/api";

export default function Transactions() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [sort, setSort] = useState("date");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (nextPage = 1, append = false) => {
    try {
      setLoading(true);
      setError(false);
      const data = await getTransactions({ page: nextPage, limit: 10, ...(type ? { type } : {}), sort });
      setItems((old) => append ? [...old, ...(data.data || [])] : (data.data || []));
      setPage(nextPage);
      setTotal(data.total || 0);
    } catch {
      if (!append) {
        setItems([]);
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [type, sort]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const hasMore = items.length < total;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Transactions</Text>
              <Text style={styles.subtitle}>Historique financier</Text>
            </View>
          </View>

          <View style={styles.tabs}>
            {[['', 'Toutes'], ['revenu', 'Revenus'], ['depense', 'Dépenses']].map(([value, label]) => (
              <Pressable key={label} onPress={() => setType(value)} style={[styles.tab, type === value && styles.activeTab]}>
                <Text style={[styles.tabText, type === value && styles.activeTabText]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sortHeader}><Text style={styles.sortLabel}>Trier par :</Text><View style={styles.sorts}>
            {[['date', 'Date ↓'], ['montant', 'Montant'], ['categorie', 'Catégorie']].map(([value, label]) => (
              <Pressable key={value} onPress={() => setSort(value)} style={[styles.sort, sort === value && styles.sortActive]}>
                <Text style={[styles.sortText, sort === value && styles.sortActiveText]}>{label}</Text>
              </Pressable>
            ))}
          </View></View>

          <Card style={styles.listCard}>
            {loading && items.length === 0 ? <ActivityIndicator color="#6D1B3B" /> : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Impossible de charger les données</Text>
                <Button title="Réessayer" onPress={() => load()} />
              </View>
            ) : items.length === 0 ? (
              <Text style={styles.empty}>Aucune transaction.</Text>
            ) : items.map((item) => (
              <TransactionItem
                key={item.id}
                item={item}
                onPress={() => router.push({ pathname: "/transaction-form", params: { id: item.id, type: item.type, montant: item.montant, categorie: item.categorie, date: item.date } })}
              />
            ))}
          </Card>

          {hasMore && <Pressable onPress={() => load(page + 1, true)} style={styles.more}><Text style={styles.moreText}>⌄  Charger plus</Text></Pressable>}
        </ScrollView>
        <Pressable onPress={() => router.push("/transaction-form")} style={styles.floating}><Ionicons name="add" size={23} color="#FFFFFF" /></Pressable>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorContainer: { padding: 20, alignItems: "center", justifyContent: "center", gap: 10 },
  errorText: { color: "red", fontSize: 14, fontWeight: "600" },
  screen: { flex: 1, backgroundColor: "#FAF7F5" },
  page: { flex: 1 },
  content: { padding: 16, gap: 10, paddingBottom: 22 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#2D2B2F", fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#77736D", fontSize: 14, marginTop: 2 },
  tabs: { flexDirection: "row", backgroundColor: "#F8E9EC", borderRadius: 12, padding: 4 },
  tab: { flex: 1, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  activeTab: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA" },
  tabText: { color: "#77736D", fontSize: 14 },
  activeTabText: { color: "#2D2B2F", fontWeight: "700" },
  sortHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  sortLabel: { color: "#77736D", fontSize: 13 },
  sorts: { flex: 1, flexDirection: "row", gap: 6 },
  sort: { paddingHorizontal: 9, height: 32, justifyContent: "center", borderRadius: 9, backgroundColor: "#F8E9EC" },
  sortActive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA" },
  sortText: { color: "#77736D", fontSize: 12 },
  sortActiveText: { color: "#2D2B2F", fontWeight: "700" },
  listCard: { paddingVertical: 4 },
  empty: { color: "#77736D", textAlign: "center", paddingVertical: 24, fontSize: 14 },
  more: { height: 44, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  moreText: { color: "#2D2B2F", fontSize: 14, fontWeight: "700" },
  floating: { position: "absolute", right: 18, bottom: 76, width: 42, height: 42, borderRadius: 21, backgroundColor: "#6D1B3B", alignItems: "center", justifyContent: "center" }
});
