import React, { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, Send, ShieldAlert, Trash2, UserRound, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CHAT_WELCOME_MESSAGE,
  deleteChatConversation,
  loadChatMessages,
  sendChatMessage,
  type ChatMessage,
} from '../../services/chatService';

interface ChatbotPanelProps {
  onClose: () => void;
}

const CONVERSATION_KEY = 'mensera_chat_conversation_v1';

function localGuestReply(question: string): string {
  const normalized = question.toLowerCase();
  if (normalized.includes('cramp')) {
    return 'Mild cramps can happen as the uterus contracts. Gentle heat, light movement, hydration, and rest may help. Severe, worsening, or unusual pain should be discussed with a clinician.';
  }
  if (normalized.includes('period') || normalized.includes('cycle')) {
    return 'Cycle timing varies between people and from month to month. Tracking bleeding, pain, energy, and other symptoms can help you notice your own pattern. I am a local educational helper while you are using guest mode.';
  }
  if (normalized.includes('exercise') || normalized.includes('workout')) {
    return 'Movement can be adjusted to how you feel today: gentle walking, mobility, strength work, or rest can all be reasonable choices. Pain, dizziness, or feeling unwell is a reason to pause and seek advice.';
  }
  return 'I can share general education about periods, cycle phases, movement, nutrition, and common symptoms. For personalized medical advice, persistent symptoms, or anything worrying, please speak with a qualified clinician. Sign in to use the AI guide and save your conversation.';
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ onClose }) => {
  const { session, currentCycle } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([CHAT_WELCOME_MESSAGE]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user.id) return;
    const savedConversationId = localStorage.getItem(`${CONVERSATION_KEY}_${session.user.id}`);
    if (!savedConversationId) return;

    setConversationId(savedConversationId);
    loadChatMessages(session.user.id, savedConversationId).then((result) => {
      if (result.error) {
        setError(result.error);
      } else if (result.messages.length > 0) {
        setMessages([CHAT_WELCOME_MESSAGE, ...result.messages]);
      }
    });
  }, [session?.user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    const userMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: trimmedQuestion,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setError(null);

    if (!session) {
      setMessages((current) => [
        ...current,
        {
          id: `guest-${Date.now()}`,
          role: 'assistant',
          content: localGuestReply(trimmedQuestion),
          createdAt: new Date().toISOString(),
        },
      ]);
      return;
    }

    setLoading(true);
    const result = await sendChatMessage(trimmedQuestion, conversationId, currentCycle);
    setLoading(false);
    if (result.error || !result.message) {
      setError(result.error || 'The guide could not answer right now.');
      return;
    }
    if (result.conversationId) {
      setConversationId(result.conversationId);
      localStorage.setItem(`${CONVERSATION_KEY}_${session.user.id}`, result.conversationId);
    }
    setMessages((current) => [...current, result.message!]);
  };

  const clearConversation = async () => {
    if (session && conversationId) {
      const deleteError = await deleteChatConversation(session.user.id, conversationId);
      if (deleteError) {
        setError(deleteError);
        return;
      }
      localStorage.removeItem(`${CONVERSATION_KEY}_${session.user.id}`);
    }
    setConversationId(null);
    setMessages([CHAT_WELCOME_MESSAGE]);
    setError(null);
  };

  const suggestedQuestions = ['What can help with cramps?', 'How do cycle phases affect training?', 'When should I speak to a doctor?'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 bg-black/25">
      <section className="w-full max-w-lg h-[min(720px,92dvh)] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden" aria-label="Mensera Guide chat">
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200/80 bg-[#FAF7F2]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700"><Bot size={18} /></div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Mensera Guide</h2>
              <p className="text-[10px] text-slate-500">General education, not medical diagnosis</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={clearConversation} className="p-2 rounded-full text-slate-500 hover:bg-slate-200/60" aria-label="Clear conversation" title="Clear conversation"><Trash2 size={15} /></button>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-200/60" aria-label="Close chat" title="Close chat"><X size={17} /></button>
          </div>
        </header>

        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/70 flex items-start gap-2 text-[10px] text-amber-900 leading-relaxed">
          <ShieldAlert size={14} className="shrink-0 mt-0.5" />
          <span>If symptoms are severe, worsening, unusual, or urgent, contact a qualified clinician or local emergency service.</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="mt-1 p-1.5 rounded-full bg-violet-100 text-violet-700 h-fit"><Bot size={12} /></div>}
              <div className={`max-w-[84%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'bg-violet-700 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'}`}>
                {message.content}
              </div>
              {message.role === 'user' && <div className="mt-1 p-1.5 rounded-full bg-slate-200 text-slate-600 h-fit"><UserRound size={12} /></div>}
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin" /> Mensera Guide is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {suggestedQuestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuestion(suggestion)} className="shrink-0 px-2.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-[10px] font-semibold text-violet-700">{suggestion}</button>)}
        </div>

        {error && <p className="px-4 pb-2 text-[11px] font-semibold text-rose-700">{error}</p>}
        {!session && <p className="px-4 pb-2 text-[10px] text-slate-400">Guest replies stay on this device. Sign in to use the AI guide and save chats.</p>}
        <form onSubmit={submitQuestion} className="p-3 border-t border-slate-200/80 flex items-end gap-2">
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your cycle..." rows={1} maxLength={800} className="flex-1 resize-none px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-violet-500" aria-label="Ask Mensera Guide" />
          <button type="submit" disabled={!question.trim() || loading} className="p-2.5 rounded-full bg-violet-700 text-white disabled:opacity-40" aria-label="Send question" title="Send question"><Send size={16} /></button>
        </form>
      </section>
    </div>
  );
};
