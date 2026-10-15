import { useCallback, useState, useEffect, useRef } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Animated } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import BottomNav from "../components/BottomNav";
import { useConversations, useMessages } from "../services/agent/queries";
import { useSendMessage } from "../services/agent/mutations";
import colors from "../constants/colors";

function formatConversationDate(dateStr) {
  const d = new Date(dateStr);
  const dateFormatted = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeFormatted = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${dateFormatted} ${timeFormatted}`;
}

const TypingIndicator = () => {
  const opacities = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current];

  useEffect(() => {
    let mounted = true;
    const animate = () => {
      Animated.sequence([
        Animated.stagger(200, opacities.map(anim => Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }))),
        Animated.stagger(200, opacities.map(anim => Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true })))
      ]).start((result) => {
        if (mounted && result.finished) animate();
      });
    };
    animate();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, height: 22, paddingHorizontal: 4, paddingTop: 4 }}>
      {opacities.map((anim, i) => (
        <Animated.View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.primary, opacity: anim }} />
      ))}
    </View>
  );
};

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const scrollRef = useRef(null);

  const {
    data: conversations = [],
    refetch: refetchConversations,
    isFetching: refreshing
  } = useConversations();

  const {
    data: serverMessages = [],
    refetch: refetchMessages
  } = useMessages(conversationId);

  const sendMessageMutation = useSendMessage();
  const sending = sendMessageMutation.isPending;

  const messages = [...serverMessages, ...pendingMessages];

  useFocusEffect(
    useCallback(() => {
      refetchConversations();
      if (conversationId) {
        refetchMessages();
      }
    }, [refetchConversations, refetchMessages, conversationId])
  );

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, sending]);

  function openConversation(id) {
    setConversationId(id);
    setPendingMessages([]);
  }

  function newConversation() {
    setConversationId(null);
    setPendingMessages([]);
  }

  function send(text = question) {
    if (!text.trim() || sending) return;
    const value = text.trim();
    setQuestion("");
    setPendingMessages([{ role: "user", contenu: value }, { role: "assistant", contenu: "" }]);

    sendMessageMutation.mutate(
      { message: value, conversationId },
      {
        onSuccess: (data) => {
          setPendingMessages([]);
          setConversationId(data.conversationId);
        },
        onError: (err) => {
          const errorMsg = err.response?.data?.error || "Une erreur est survenue. Réessayez plus tard.";
          setPendingMessages([
            { role: "user", contenu: value },
            { role: "assistant", contenu: `⚠️ ${errorMsg}` }
          ]);
        }
      }
    );
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
            <Pressable onPress={newConversation} style={styles.newButton} accessibilityLabel="Nouvelle conversation">
              <Text style={styles.newText}>＋ Nouveau</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                refetchConversations();
                if (conversationId) refetchMessages();
              }}
              hitSlop={8}
              accessibilityLabel="Rafraîchir les conversations"
              style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="refresh" size={18} color={colors.primary} />
              )}
            </Pressable>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        >
          {conversations.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyRow}>
              {conversations.slice(0, 5).map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => openConversation(item.id)}
                  style={[styles.history, conversationId === item.id && styles.historyActive]}
                  accessibilityLabel={`Ouvrir conversation du ${formatConversationDate(item.createdAt)}`}
                >
                  <Text style={[styles.historyText, conversationId === item.id && styles.historyActiveText]}>
                    Conversation · {formatConversationDate(item.createdAt)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {messages.length === 0 && (
            <View style={styles.welcome}>
              <View style={styles.botIcon}><Ionicons name="sparkles" size={16} color={colors.primary} /></View>
              <Text style={styles.botTitle}>Bonjour, je suis votre assistant financier BizPulse.</Text>
              <Text style={styles.botText}>Posez-moi une question sur vos revenus, dépenses ou simulations.</Text>
            </View>
          )}

          {messages.map((message, index) => (
            <View
              key={`${index}-${message.role}`}
              style={[styles.message, message.role === "user" ? styles.userMessage : styles.assistantMessage]}
            >
              {message.role === "assistant" && <Text style={styles.assistantLabel}>BizPulse IA</Text>}
              {message.role === "assistant" ? (
                message.contenu ? (
                  <Markdown style={markdownStyles}>{message.contenu}</Markdown>
                ) : (
                  sending && index === messages.length - 1 ? <TypingIndicator /> : <Text />
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
              <Pressable onPress={() => send("Résume ma situation financière")} style={styles.suggestion}>
                <Text style={styles.suggestionText}>Résume ma situation financière</Text>
              </Pressable>
              <Pressable onPress={() => send("Quelle catégorie coûte le plus ?")} style={styles.suggestion}>
                <Text style={styles.suggestionText}>Quelle catégorie coûte le plus ?</Text>
              </Pressable>
              <Pressable onPress={() => send("Simule une embauche à 4 000 DH")} style={styles.suggestion}>
                <Text style={styles.suggestionText}>Simule une embauche à 4 000 DH</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Posez votre question financière…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            maxLength={1000}
            multiline
          />
          <Pressable
            onPress={() => send()}
            style={styles.send}
            disabled={sending || !question.trim()}
            accessibilityLabel="Envoyer le message"
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
        <BottomNav />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const markdownStyles = {
  body: { color: colors.text, fontSize: 14, lineHeight: 22 },
  strong: { fontWeight: "bold" },
  p: { marginTop: 0, marginBottom: 8 },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: 4, overflow: "hidden" },
  th: { backgroundColor: colors.primaryLight, padding: 6, fontWeight: "bold" },
  td: { padding: 6, borderColor: colors.border, borderWidth: 1 }
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  status: { color: colors.primary, fontSize: 13, marginTop: 3 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  newButton: { paddingHorizontal: 10, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight, justifyContent: "center" },
  newText: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  scroll: { flex: 1 },
  messages: { padding: 14, gap: 12 },
  historyRow: { gap: 7 },
  history: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.primaryLight },
  historyActive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.primary },
  historyText: { color: colors.textMuted, fontSize: 12 },
  historyActiveText: { color: colors.primary, fontWeight: "700" },
  welcome: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14 },
  botIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  botTitle: { color: colors.text, fontSize: 16, lineHeight: 24, fontWeight: "700" },
  botText: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 5 },
  message: { maxWidth: "86%", padding: 14, borderRadius: 13 },
  userMessage: { alignSelf: "flex-end", backgroundColor: colors.primary },
  assistantMessage: { alignSelf: "flex-start", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border },
  assistantLabel: { color: colors.primary, fontSize: 12, fontWeight: "700", marginBottom: 4 },
  userText: { color: "#FFFFFF", fontSize: 14, lineHeight: 22 },
  suggestions: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 10 },
  suggestTitle: { color: colors.textMuted, fontSize: 14, marginBottom: 8, fontWeight: "700" },
  suggestList: { gap: 6 },
  suggestion: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  suggestionText: { color: colors.text, fontSize: 13 },
  inputRow: { flexDirection: "row", padding: 10, gap: 8, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, minHeight: 52, maxHeight: 100, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingTop: 16, paddingBottom: 16, color: colors.text, fontSize: 14 },
  send: { width: 52, height: 52, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }
});
