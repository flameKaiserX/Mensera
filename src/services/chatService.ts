import type { CurrentCycleStatus } from '../types';
import { supabase } from '../lib/supabase';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatContext {
  cycleDay: number;
  phase: string;
  energyForecast: string;
}

interface ChatMessageRow {
  id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

const MAX_MESSAGE_LENGTH = 800;

export const CHAT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hi, I am Mensera Guide. Ask me about cycle education, movement, nutrition, or common period questions. I can share general information, but I cannot diagnose or replace a clinician.',
  createdAt: new Date().toISOString(),
};

export function toChatMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function loadChatMessages(userId: string, conversationId: string): Promise<{
  messages: ChatMessage[];
  error: string | null;
}> {
  if (!supabase) return { messages: [], error: 'Cloud chat is not configured.' };

  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('user_id', userId)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .returns<ChatMessageRow[]>();

  return {
    messages: data?.map(toChatMessage) ?? [],
    error: error?.message ?? null,
  };
}

export async function createChatConversation(userId: string): Promise<{
  id: string | null;
  error: string | null;
}> {
  if (!supabase) return { id: null, error: 'Cloud chat is not configured.' };

  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({ user_id: userId })
    .select('id')
    .single<{ id: string }>();

  return { id: data?.id ?? null, error: error?.message ?? null };
}

export async function deleteChatConversation(userId: string, conversationId: string): Promise<string | null> {
  if (!supabase) return 'Cloud chat is not configured.';

  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);
  return error?.message ?? null;
}

export async function sendChatMessage(
  message: string,
  conversationId: string | null,
  context: Pick<CurrentCycleStatus, 'currentDay' | 'phaseDisplayName' | 'energyForecast'>
): Promise<{ message: ChatMessage | null; conversationId: string | null; error: string | null }> {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return { message: null, conversationId, error: 'Please enter a question.' };
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return { message: null, conversationId, error: `Please keep questions under ${MAX_MESSAGE_LENGTH} characters.` };
  }
  if (!supabase) return { message: null, conversationId, error: 'Cloud chat is not configured.' };

  const { data, error } = await supabase.functions.invoke('mensera-chat', {
    body: {
      message: trimmedMessage,
      conversationId,
      context: {
        cycleDay: context.currentDay,
        phase: context.phaseDisplayName,
        energyForecast: context.energyForecast,
      } satisfies ChatContext,
    },
  });

  if (error) return { message: null, conversationId, error: error.message };
  return {
    message: data?.message ?? null,
    conversationId: data?.conversationId ?? conversationId,
    error: data?.error ?? null,
  };
}
