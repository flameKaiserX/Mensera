import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed right-4 bottom-20 z-40 w-12 h-12 rounded-full bg-[#B4232A] text-white shadow-lg shadow-[#B4232A]/20 flex items-center justify-center hover:bg-[#8F1D25]"
    aria-label="Open Mensera Guide"
    title="Ask Mensera Guide"
  >
    <MessageCircle size={20} />
  </button>
);
