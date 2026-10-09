import { useCallback, useState, useEffect, useRef } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Animated } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import BottomNav from "../components/BottomNav";
import { getConversations, getMessages, streamMessage } from "../services/api";

let globalConversationId = undefined;
let globalInitialized = false;

export default function Chat() {
  const [conversationId, setConversationId] = useState(globalConversationId || null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await getConversations();
      setConversations(list || []);
      
      setConversationId((currentId) => {
        if (currentId && list?.find(c => c.id === currentId)) {
          getMessages(currentId).then(setMessages).catch(() => {});
          globalConversationId = currentId;
          return currentId;
        } else if (!globalInitialized && list?.[0]) {
          globalInitialized = true;
          globalConversationId = list[0].id;
          getMessages(list[0].id).then(setMessages).catch(() => {});
          return list[0].id;
        }
        
        if (!currentId) {
          globalConversationId = null;
          setMessages([]);
          return null;
        }
        globalConversationId = null;
        setMessages([]);
        return null;
      });
    } catch {
      setConversations([]);
      setMessages([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function openConversation(id) {
    try {
      globalConversationId = id;
      setConversationId(id);
      setMessages(await getMessages(id));
    } catch {}
  }

  function newConversation() {
    globalConversationId = null;
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
      }, (id) => {
        globalConversationId = id;
        setConversationId(id);
      });
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
            <Pressable onPress={() => load()} hitSlop={8} style={{ width: 17, height: 17, justifyContent: 'center', alignItems: 'center' }}>
              {refreshing ? <ActivityIndicator size="small" color="#6D1B3B" /> : <Ionicons name="refresh" size={17} color="#6D1B3B" />}
            </Pressable>
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
              <View style={styles.botIcon}><Ionicons name="sparkles" size={15} color="#6D1B3B" /></View>
              <Text style={styles.botTitle}>Bonjour, je suis votre assistant financier BizPulse.</Text>
              <Text style={styles.botText}>Posez-moi une question sur vos revenus, dépenses ou simulations.</Text>
            </View>
          )}

          {messages.map((message, index) => (
            <View key={`${index}-${message.role}`} style={[styles.message, message.role === "user" ? styles.userMessage : styles.assistantMessage]}>
              {message.role === "assistant" && <Text style={styles.assistantLabel}>BizPulse IA</Text>}
              {message.role === "assistant" ? (
                message.contenu ? (
                  <Markdown style={markdownStyles}>{message.contenu}</Markdown>
                ) : (
                  (sending && index === messages.length - 1) ? <TypingIndicator /> : <Text></Text>
                )
              ) : (
                <Text style={styles.userText}>{message.contenu}</Text>
              )}
            </View>
          ))}
        </ScrollView>

        {messages.length === 0 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestTitle}>Suggestions rapides</Text>
            <View style={styles.suggestList}>
              <Pressable onPress={() => send("Résume ma situation financière")} style={styles.suggestion}><Text style={styles.suggestionText}>Résume ma situation financière</Text></Pressable>
              <Pressable onPress={() => send("Quelle catégorie coûte le plus ?")} style={styles.suggestion}><Text style={styles.suggestionText}>Quelle catégorie coûte le plus ?</Text></Pressable>
              <Pressable onPress={() => send("Simule une embauche à 4 000 DH")} style={styles.suggestion}><Text style={styles.suggestionText}>Simule une embauche à 4 000 DH</Text></Pressable>
            </View>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput value={question} onChangeText={setQuestion} placeholder="Posez votre question financière…" placeholderTextColor="#77736D" style={styles.input} multiline />
          <Pressable onPress={() => send()} style={styles.send}>{sending ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="arrow-up" size={18} color="#FFFFFF" />}</Pressable>
        </View>
        <BottomNav />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const markdownStyles = {
  body: { color: "#2D2B2F", fontSize: 14, lineHeight: 22 },
  strong: { fontWeight: "bold" },
  p: { marginTop: 0, marginBottom: 8 },
  table: { borderWidth: 1, borderColor: "#E8E2DA", borderRadius: 4, overflow: "hidden" },
  th: { backgroundColor: "#F8E9EC", padding: 6, fontWeight: "bold" },
  td: { padding: 6, borderColor: "#E8E2DA", borderWidth: 1 }
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7F5" },
  page: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E8E2DA" },
  title: { color: "#2D2B2F", fontSize: 24, fontWeight: "800" },
  status: { color: "#6D1B3B", fontSize: 13, marginTop: 3 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  newButton: { paddingHorizontal: 10, height: 32, borderRadius: 8, backgroundColor: "#F8E9EC", justifyContent: "center" },
  newText: { color: "#6D1B3B", fontSize: 13, fontWeight: "700" },
  scroll: { flex: 1 },
  messages: { padding: 14, gap: 12 },
  historyRow: { gap: 7 },
  history: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: "#F8E9EC" },
  historyActive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#6D1B3B" },
  historyText: { color: "#77736D", fontSize: 12 },
  welcome: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA", borderRadius: 14, padding: 14 },
  botIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: "#F8E9EC", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  botTitle: { color: "#2D2B2F", fontSize: 16, lineHeight: 24, fontWeight: "700" },
  botText: { color: "#77736D", fontSize: 14, lineHeight: 20, marginTop: 5 },
  message: { maxWidth: "86%", padding: 14, borderRadius: 13 },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#6D1B3B" },
  assistantMessage: { alignSelf: "flex-start", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA" },
  assistantLabel: { color: "#6D1B3B", fontSize: 12, fontWeight: "700", marginBottom: 4 },
  userText: { color: "#FFFFFF", fontSize: 14, lineHeight: 22 },
  assistantText: { color: "#2D2B2F", fontSize: 14, lineHeight: 22 },
  suggestions: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 10 },
  suggestTitle: { color: "#77736D", fontSize: 14, marginBottom: 8, fontWeight: "700" },
  suggestList: { gap: 6 },
  suggestion: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  suggestionText: { color: "#2D2B2F", fontSize: 13 },
  inputRow: { flexDirection: "row", padding: 10, gap: 8, backgroundColor: "#FAF7F5", borderTopWidth: 1, borderTopColor: "#E8E2DA" },
  input: { flex: 1, minHeight: 52, maxHeight: 100, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8E2DA", borderRadius: 12, paddingHorizontal: 14, paddingTop: 16, paddingBottom: 16, color: "#2D2B2F", fontSize: 14 },
  send: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#6D1B3B", alignItems: "center", justifyContent: "center" }
});

const TypingIndicator = () => {
  const opacities = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current];

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.stagger(200, opacities.map(anim => Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }))),
        Animated.stagger(200, opacities.map(anim => Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true })))
      ]).start((result) => { if (result.finished) animate(); });
    };
    animate();
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, height: 22, paddingHorizontal: 4, paddingTop: 4 }}>
      {opacities.map((anim, i) => (
        <Animated.View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#6D1B3B", opacity: anim }} />
      ))}
    </View>
  );
};
