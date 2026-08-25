import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import { X, Sparkles, Send, Bot, User } from 'lucide-react-native';
import { askGeminiChef } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface GeminiChefChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChefChatModal: React.FC<GeminiChefChatModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Bonjour! I am Chef Rosette 👩‍🍳, your CakeBox Sweet Sommelier & Pastry Master! How can I help you design the perfect celebratory cake, calculate portions, or discover delicious flavor pairings today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Feeds 15 guests?',
    'Fun 30th Birthday cake text',
    'Best chocolate pairings?',
    'Gluten-free options'
  ];

  const handleSend = async (textToSend?: string) => {
    const userPrompt = textToSend || input.trim();
    if (!userPrompt || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: userPrompt }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Call live Gemini AI API directly
      const reply = await askGeminiChef(messages, userPrompt);
      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local guidelines:', err);
      // Intelligent offline Pastry Chef fallback
      let fallback = "A wonderful idea! For celebrations, I recommend an 8\" Cake which serves 8-10 people generously, or a 10\" Cake for 12-15 guests. Pair a light Swiss Vanilla Meringue with fresh strawberry compote or rich Belgian Dark Chocolate Ganache!";
      if (userPrompt.toLowerCase().includes('text') || userPrompt.toLowerCase().includes('inscription')) {
        fallback = "Here are cute topper & inscription ideas:\n✨ \"Level 30 Unlocked!\"\n✨ \"Sweetest 30 & Fabulous!\"\n✨ \"Aging Like Fine Ganache 🍫\"\n✨ \"Another Year Sweeter!\"";
      } else if (userPrompt.toLowerCase().includes('guest') || userPrompt.toLowerCase().includes('feed')) {
        fallback = "Here are our chef portion guidelines:\n🍰 6\" Cake: 4-6 servings\n🍰 8\" Cake: 8-10 servings\n🍰 10\" Cake: 12-15 servings\n🍰 Two-Tier Custom: 20-25 servings!";
      }

      setMessages((prev) => [...prev, { role: 'model', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.chefAvatar}>
                <Text style={{ fontSize: 18 }}>👩‍🍳</Text>
              </View>
              <View>
                <Text style={styles.title}>Chef Rosette</Text>
                <Text style={styles.subtitle}>Gemini AI Pastry Master</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.darkChocolate} />
            </TouchableOpacity>
          </View>

          {/* Quick Suggestion Chips */}
          <View style={styles.quickRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {quickPrompts.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  onPress={() => handleSend(prompt)}
                  style={styles.quickChip}
                >
                  <Text style={styles.quickChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat Messages */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <View
                  key={idx}
                  style={[
                    styles.msgRow,
                    isUser ? styles.msgRowUser : styles.msgRowModel
                  ]}
                >
                  {!isUser && (
                    <View style={styles.bubbleAvatar}>
                      <Bot size={14} color={COLORS.primary} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.bubbleUser : styles.bubbleModel
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        isUser ? styles.bubbleTextUser : styles.bubbleTextModel
                      ]}
                    >
                      {m.text}
                    </Text>
                  </View>
                </View>
              );
            })}

            {loading && (
              <View style={[styles.msgRow, styles.msgRowModel]}>
                <View style={styles.bubbleAvatar}>
                  <Bot size={14} color={COLORS.primary} />
                </View>
                <View style={[styles.bubble, styles.bubbleModel]}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Ask Chef Rosette for cake inspiration..."
              placeholderTextColor={COLORS.textSecondary}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={loading || !input.trim()}
              style={[
                styles.sendBtn,
                (!input.trim() || loading) && styles.sendBtnDisabled
              ]}
              activeOpacity={0.8}
            >
              <Send size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(59, 44, 48, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.bgCream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    height: '85%',
    padding: 16,
    gap: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderPink
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  chefAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickRow: {
    paddingVertical: 2
  },
  quickChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    gap: 12,
    paddingVertical: 8
  },
  msgRow: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '85%'
  },
  msgRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse'
  },
  msgRowModel: {
    alignSelf: 'flex-start'
  },
  bubbleAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.borderDark,
    borderBottomRightRadius: 4
  },
  bubbleModel: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderPink,
    borderBottomLeftRadius: 4
  },
  bubbleText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600'
  },
  bubbleTextUser: {
    color: COLORS.white
  },
  bubbleTextModel: {
    color: COLORS.darkChocolate
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderPink
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 42,
    fontSize: 12,
    color: COLORS.darkChocolate,
    fontWeight: '600'
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pink
  },
  sendBtnDisabled: {
    opacity: 0.5
  }
});
