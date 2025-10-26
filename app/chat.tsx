import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useUser } from '@/contexts/UserContext';
import { aiAgentService, ChatMessage, ToolCall } from '@/services/aiAgentService';

export default function ChatScreen() {
  const router = useRouter();
  const { user, userId } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    console.log('🎯 Chat screen - User context:', { user, userId });
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! 👋 I'm Dr. Gut, your personal gut health assistant. I can help you understand your bowel health patterns, answer questions about symptoms, and provide personalized insights based on your data.\n\nWhat would you like to know about your gut health today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user, userId]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    console.log('🚀 Sending message with userId:', userId);
    console.log('🚀 User object:', user);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!userId) {
        console.error('❌ No userId available for chat');
        Alert.alert('Error', 'User not logged in. Please try logging in again.');
        return;
      }

      const response = await aiAgentService.chatWithAgent(
        userMessage.content,
        messages,
        userId
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        toolCalls: response.toolCalls,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <View key={message.id} style={styles.messageContainer}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
            {message.content}
          </Text>
          
          {/* Tool calls indicator */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <View style={styles.toolCallsContainer}>
              <Text style={styles.toolCallsTitle}>🔧 Used tools:</Text>
              {message.toolCalls.map((toolCall, index) => (
                <View key={index} style={styles.toolCallItem}>
                  <Text style={styles.toolCallName}>• {toolCall.name}</Text>
                  {toolCall.result?.error && (
                    <Text style={styles.toolCallError}>Error: {toolCall.result.error}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
          
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" color={colors.text} size={24} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dr. Gut</Text>
          <Text style={styles.headerSubtitle}>Your AI Gut Health Assistant</Text>
          {userId && (
            <Text style={styles.debugText}>User ID: {userId.substring(0, 8)}...</Text>
          )}
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.messageContainer}>
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Dr. Gut is thinking...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me about your gut health..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <Pressable 
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <IconSymbol 
            name="paperplane.fill" 
            color={(!inputText.trim() || isLoading) ? colors.textSecondary : colors.primary} 
            size={20} 
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  debugText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '400',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  userText: {
    color: 'white',
  },
  assistantText: {
    color: colors.text,
  },
  toolCallsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toolCallsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  toolCallItem: {
    marginBottom: 2,
  },
  toolCallName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  toolCallError: {
    fontSize: 11,
    color: colors.error,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 8,
    fontWeight: '500',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: colors.textSecondary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
