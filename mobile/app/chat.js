import { useCallback, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { getConversations, getMessages, streamMessage } from "../services/api";

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState([]);

  const load = useCallback(async () => {
    try {
      const list = await getConversations();
      setConversations(list || []);
      if (list?.[0]) {
        setConversationId(list[0].id);
        setMessages(await getMessages(list[0].id));
      }
    } catch {
      setConversations([]);
      setMessages([]);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function openConversation(id) {
    try {
      setConversationId(id);
      setMessages(await getMessages(id));
    } catch {}
  }

  function newConversation() {
    setConversationId(null);
    setMessages([]);
  }

  async function send(text = question) {
    if (!text.trim() || sending) return;
    const value = text.trim();
    setQuestion("");
    setMessages((old) => [...old, { role: "user", contenu: value }, { role: "assistant", contenu: "" }]);
    setSending(true);
    let answer = "";

    try {
      await streamMessage(value, conversationId, (word) => {
        answer += word;
        setMessages((old) => {
          const next = [...old];
          next[next.length - 1] = { role: "assistant", contenu: answer };
          return next;
        });
      }, (id) => setConversationId(id));
      setConversations(await getConversations());
    } catch {
      setMessages((old) => {
        const next = [...old];
        next[next.length - 1] = { role: "assistant", contenu: "Une erreur est survenue. Réessayez plus tard." };
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Assistant IA</Text>
            <Text style={styles.status}>●  BizPulse IA · financier</Text>
          </View>
          <View style={styles.actions}>
            <Pressable onPress={newConversation} style={styles.newButton}><Text style={styles.newText}>＋ Nouveau</Text></Pressable>
            <Pressable onPress={load} hitSlop={8}><Ionicons name="refresh" size={17} color="#4A7C59" /></Pressable>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          {conversations.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyRow}>
              {conversations.slice(0, 3).map((item) => (
                <Pressable key={item.id} onPress={() => openConversation(item.id)} style={[styles.history, conversationId === item.id && styles.historyActive]}>
                  <Text style={styles.historyText}>Conversation · {new Date(item.createdAt).toLocaleDateString("fr-FR")}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {messages.length === 0 && (
            <View style={styles.welcome}>
              <View style={styles.botIcon}><Ionicons name="sparkles" size={15} color="#4A7C59" /></View>
              <Text style={styles.botTitle}>Bonjour, je suis votre assistant financier BizPulse.</Text>
              <Text style={styles.botText}>Posez-moi une question sur vos revenus, dépenses ou simulations.</Text>
            </View>
          )}

          {messages.map((message, index) => (
            <View key={`${index}-${message.role}`} style={[styles.message, message.role === "user" ? styles.userMessage : styles.assistantMessage]}>
              {message.role === "assistant" && <Text style={styles.assistantLabel}>BizPulse IA</Text>}
              <Text style={message.role === "user" ? styles.userText : styles.assistantText}>{message.contenu || (sending && index === messages.length - 1 ? "L'assistant écrit…" : "")}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.suggestions}>
          <Text style={styles.suggestTitle}>Suggestions rapides</Text>
          <View style={styles.suggestList}>
            <Pressable onPress={() => send("Résume ma situation financière")} style={styles.suggestion}><Text style={styles.suggestionText}>Résume ma situation financière</Text></Pressable>
            <Pressable onPress={() => send("Quelle catégorie coûte le plus ?")} style={styles.suggestion}><Text style={styles.suggestionText}>Quelle catégorie coûte le plus ?</Text></Pressable>
            <Pressable onPress={() => send("Simule une embauche à 4 000 DH")} style={styles.suggestion}><Text style={styles.suggestionText}>Simule une embauche à 4 000 DH</Text></Pressable>
          </View>
        </View>

        <View style={styles.inputRow}>
          <TextInput value={question} onChangeText={setQuestion} placeholder="Posez votre question financière…" placeholderTextColor="#7A897A" style={styles.input} multiline />
          <Pressable onPress={() => send()} style={styles.send}>{sending ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="arrow-up" size={18} color="#FFFFFF" />}</Pressable>
        </View>
        <BottomNav />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0FDEC" },
  page: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#D4E5D4" },
  title: { color: "#1F2A1F", fontSize: 16, fontWeight: "800" },
  status: { color: "#4A7C59", fontSize: 9, marginTop: 3 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  newButton: { paddingHorizontal: 9, height: 28, borderRadius: 8, backgroundColor: "#EAF7E6", justifyContent: "center" },
  newText: { color: "#4A7C59", fontSize: 9, fontWeight: "700" },
  scroll: { flex: 1 },
  messages: { padding: 14, gap: 9 },
  historyRow: { gap: 7 },
  history: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8, backgroundColor: "#EAF7E6" },
  historyActive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#4A7C59" },
  historyText: { color: "#5C6E5C", fontSize: 9 },
  welcome: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D4E5D4", borderRadius: 14, padding: 14 },
  botIcon: { width: 28, height: 28, borderRadius: 9, backgroundColor: "#EAF7E6", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  botTitle: { color: "#1F2A1F", fontSize: 12, lineHeight: 18, fontWeight: "700" },
  botText: { color: "#5C6E5C", fontSize: 11, lineHeight: 17, marginTop: 5 },
  message: { maxWidth: "86%", padding: 11, borderRadius: 13 },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#4A7C59" },
  assistantMessage: { alignSelf: "flex-start", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D4E5D4" },
  assistantLabel: { color: "#4A7C59", fontSize: 9, fontWeight: "700", marginBottom: 4 },
  userText: { color: "#FFFFFF", fontSize: 11, lineHeight: 17 },
  assistantText: { color: "#1F2A1F", fontSize: 11, lineHeight: 17 },
  suggestions: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 7 },
  suggestTitle: { color: "#5C6E5C", fontSize: 10, marginBottom: 6, fontWeight: "700" },
  suggestList: { gap: 5 },
  suggestion: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D4E5D4", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7 },
  suggestionText: { color: "#1F2A1F", fontSize: 9 },
  inputRow: { flexDirection: "row", padding: 10, gap: 8, backgroundColor: "#F0FDEC", borderTopWidth: 1, borderTopColor: "#D4E5D4" },
  input: { flex: 1, minHeight: 44, maxHeight: 90, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D4E5D4", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, color: "#1F2A1F", fontSize: 11 },
  send: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#4A7C59", alignItems: "center", justifyContent: "center" }
});
