import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import TransactionItem from "../components/TransactionItem";
import BottomNav from "../components/BottomNav";
import { useTransactionsInfinite } from "../services/transactions/queries";
import colors from "../constants/colors";

export default function Transactions() {
  const router = useRouter();
  const [type, setType] = useState("");

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useTransactionsInfinite(type);

  const items = data ? data.pages.flatMap((page) => page.data || []) : [];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  function handleLoadMore() {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }

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
              <Pressable
                key={label}
                onPress={() => setType(value)}
                style={[styles.tab, type === value && styles.activeTab]}
                accessibilityRole="button"
                accessibilityLabel={`Filtrer par ${label}`}
              >
                <Text style={[styles.tabText, type === value && styles.activeTabText]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <Card style={styles.listCard}>
            {isLoading && items.length === 0 ? (
               <ActivityIndicator color={colors.primary} style={{ paddingVertical: 24 }} />
            ) : isError && items.length === 0 ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>Impossible de charger les transactions.</Text>
                <Pressable
                  onPress={() => refetch()}
                  style={styles.retryButton}
                  accessibilityRole="button"
                  accessibilityLabel="Réessayer"
                >
                  <Text style={styles.retryText}>Réessayer</Text>
                </Pressable>
              </View>
            ) : items.length === 0 ? (
              <Text style={styles.empty}>Aucune transaction.</Text>
            ) : (
              items.map((item) => (
                <TransactionItem
                  key={item.id}
                  item={item}
                  onPress={() =>
                    router.push({
                      pathname: "/transaction-form",
                      params: {
                        id: item.id,
                        type: item.type,
                        montant: item.montant,
                        categorie: item.categorie,
                        date: item.date
                      }
                    })
                  }
                />
              ))
            )}
          </Card>

          {hasNextPage && (
            <Pressable
              onPress={handleLoadMore}
              disabled={isLoading || isFetchingNextPage}
              style={styles.more}
              accessibilityLabel="Charger plus de transactions"
            >
              {isFetchingNextPage ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.moreText}>⌄  Charger plus</Text>
              )}
            </Pressable>
          )}
        </ScrollView>

        <Pressable
          onPress={() => router.push("/transaction-form")}
          style={styles.floating}
          accessibilityLabel="Ajouter une transaction"
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  content: { padding: 16, gap: 10, paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: colors.text, fontSize: 26, fontWeight: "800" },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 2 },
  tabs: { flexDirection: "row", backgroundColor: colors.primaryLight, borderRadius: 12, padding: 4 },
  tab: { flex: 1, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  activeTab: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  tabText: { color: colors.textMuted, fontSize: 14 },
  activeTabText: { color: colors.text, fontWeight: "700" },
  listCard: { paddingVertical: 4 },
  empty: { color: colors.textMuted, textAlign: "center", paddingVertical: 24, fontSize: 14 },
  errorBox: { alignItems: "center", justifyContent: "center", paddingVertical: 24, gap: 10 },
  errorText: { color: colors.textMuted, fontSize: 14, textAlign: "center" },
  retryButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.primaryLight, borderRadius: 8 },
  retryText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  more: { height: 44, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  moreText: { color: colors.text, fontSize: 14, fontWeight: "700" },
  floating: {
    position: "absolute",
    right: 18,
    bottom: 84,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
});
