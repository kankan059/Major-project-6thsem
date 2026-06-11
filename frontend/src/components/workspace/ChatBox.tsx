'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/app/types/socket';
import { Socket } from 'socket.io-client';
import { Send, Terminal } from 'lucide-react';
import api from '@/utils/api';

interface ChatBoxProps {
  jobId: string;
  currentUserId: string;
  socket: Socket | null; // Allow null to tolerate broken connection links safely
  initialMessages: Message[];
}

export default function ChatBox({ jobId, currentUserId, socket, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live Socket Realtime Listener
  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (newMessage: Message) => {
        if (newMessage.job === jobId) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }
    return () => {
      if (socket) socket.off('receive_message');
    };
  }, [socket, jobId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const textToSend = typedMessage.trim();
    setTypedMessage('');

    try {
      // 1. PERSISTENCE FALLBACK FIRST: Save to DB via HTTP POST
      const res = await api.post<Message>('/messages', { jobId, text: textToSend ,});
      const savedMessage = res.data;

      // 2. Update local UI component grid instantly for the sender
      setMessages((prev) => [...prev, savedMessage]);

      // 3. BROADCAST LIVE: Emit socket packet only if the web server socket node is up and running
      if (socket && socket.connected) {
        socket.emit('send_message', savedMessage);
      }
    } catch (error) {
      console.error('Failed to dispatch text data layer via network pipelines.');
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl flex flex-col h-[520px] shadow-sm overflow-hidden">
      
      <div className="bg-[#0A1931] px-4 py-3 border-b border-[#1A3D63] text-white flex items-center justify-between font-mono text-xs font-bold tracking-wider">
        <span className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#4AFAF7]" /> ENCRYPTED PIPELINE CORE
        </span>
        <span className={`text-[9px] px-2 py-0.5 rounded ${socket?.connected ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {socket?.connected ? 'SOCKET//LIVE' : 'HTTP//FALLBACK'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F6FAFD]">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUserId;
          return (
            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm ${
                isMe ? 'bg-[#0A1931] text-white rounded-br-none' : 'bg-white border border-neutral-200 text-[#0A1931] rounded-bl-none'
              }`}>
                <p>{msg.text}</p>
                <span className="block text-[8px] opacity-60 text-right mt-1 font-mono">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-100 bg-white flex gap-2">
        <input 
          type="text" required
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder="Type message or paste resource credentials..."
          className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-[#0A1931] text-sm text-[#0A1931] font-medium"
        />
        <button type="submit" className="bg-[#0A1931] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center">
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}