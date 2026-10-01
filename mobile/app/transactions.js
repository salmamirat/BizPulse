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
  const [sort, setSort] = useState("date");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (nextPage = 1, append = false) => {
    try {
      setLoading(true);
      const data = await getTransactions({ page: nextPage, limit: 10, ...(type ? { type } : {}), sort });
      setItems((old) => append ? [...old, ...(data.data || [])] : (data.data || []));
      setPage(nextPage);
      setTotal(data.total || 0);
    } catch {
      if (!append) setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type, sort]);

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
              <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.title}>Transactions</Text>
              <Text style={styles.subtitle}>Historique financier</Text>
            </View>
            <Pressable onPress={() => router.push("/transaction-form")} style={styles.add}><Ionicons name="add" size={22} color="#FFFFFF" /></Pressable>
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
            {loading && items.length === 0 ? <ActivityIndicator color="#4A7C59" /> : items.length === 0 ? (
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
  screen: { flex: 1, backgroundColor: "#F0FDEC" },
  page: { flex: 1 },
  content: { padding: 16, gap: 10, paddingBottom: 22 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#1F2A1F", fontSize: 20, fontWeight: "800" },
  logoImage: { height: 28, width: 100, marginBottom: 8 },
  subtitle: { color: "#5C6E5C", fontSize: 10, marginTop: 2 },
  add: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#4A7C59", alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row", backgroundColor: "#EAF7E6", borderRadius: 12, padding: 4 },
  tab: { flex: 1, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  activeTab: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D4E5D4" },
  tabText: { color: "#6E7B6E", fontSize: 11 },
  activeTabText: { color: "#1F2A1F", fontWeight: "700" },
  sortHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  sortLabel: { color: "#6E7B6E", fontSize: 10 },
  sorts: { flex: 1, flexDirection: "row", gap: 6 },
  sort: { paddingHorizontal: 9, height: 28, justifyContent: "center", borderRadius: 9, backgroundColor: "#EAF7E6" },
  sortActive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D4E5D4" },
  sortText: { color: "#6E7B6E", fontSize: 9 },
  sortActiveText: { color: "#1F2A1F", fontWeight: "700" },
  listCard: { paddingVertical: 4 },
  empty: { color: "#6E7B6E", textAlign: "center", paddingVertical: 24, fontSize: 11 },
  more: { height: 40, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D4E5D4", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  moreText: { color: "#1F2A1F", fontSize: 10, fontWeight: "700" },
  floating: { position: "absolute", right: 18, bottom: 76, width: 42, height: 42, borderRadius: 21, backgroundColor: "#4A7C59", alignItems: "center", justifyContent: "center" }
});
