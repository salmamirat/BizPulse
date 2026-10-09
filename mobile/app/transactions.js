import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import TransactionItem from "../components/TransactionItem";
import BottomNav from "../components/BottomNav";
import { deleteTransaction, getTransactions } from "../services/api";

export default function Transactions() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (nextPage = 1, append = false) => {
    try {
      setLoading(true);
      const data = await getTransactions({ page: nextPage, limit: 10, ...(type ? { type } : {}), sort: "date" });
      setItems((old) => append ? [...old, ...(data.data || [])] : (data.data || []));
      setPage(nextPage);
      setTotal(data.total || 0);
    } catch {
      if (!append) setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function remove(id) {
    Alert.alert("Supprimer", "Supprimer cette transaction ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        try {
          await deleteTransaction(id);
          load(1);
        } catch (error) {
          Alert.alert("Erreur", error.response?.data?.error || "Impossible de supprimer.");
        }
      }}
    ]);
  }

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

          <Card style={styles.listCard}>
            {loading && items.length === 0 ? <ActivityIndicator color="#6D1B3B" /> : items.length === 0 ? (
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
  screen: { flex: 1, backgroundColor: "#FAF7F5" },
  page: { flex: 1 },
  content: { padding: 16, gap: 10, paddingBottom: 22 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#2D2B2F", fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#77736D", fontSize: 14, marginTop: 2 },
  tabs: { flexDirection: "row", backgroundColor: "#F8E9EC", borderRadius: 12, padding: 4 },
  tab: { flex: 1, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  activeTab: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  tabText: { color: "#77736D", fontSize: 14 },
  activeTabText: { color: "#2D2B2F", fontWeight: "700" },
  listCard: { paddingVertical: 4 },
  empty: { color: "#77736D", textAlign: "center", paddingVertical: 24, fontSize: 14 },
  more: { height: 44, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  moreText: { color: "#2D2B2F", fontSize: 14, fontWeight: "700" },
  floating: { position: "absolute", right: 18, bottom: 84, width: 56, height: 56, borderRadius: 28, backgroundColor: "#6D1B3B", alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }
});
