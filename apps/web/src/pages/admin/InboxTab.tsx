import React from 'react';
import { Mail, CheckCheck, Trash2 } from 'lucide-react';
import { useMessages, useMarkAsRead, useDeleteMessage } from '../../hooks/use-messages';

interface InboxTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function InboxTab({ token, setMessage }: Readonly<InboxTabProps>) {
  const { data: messages = [], isLoading: messagesLoading } = useMessages(token || '');
  const markAsReadMut = useMarkAsRead();
  const deleteMessageMut = useDeleteMessage();
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const isPending = markAsReadMut.isPending || deleteMessageMut.isPending;

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;
    try {
      await markAsReadMut.mutateAsync({ id, token });
      setMessage({ text: 'Message marked as read!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to mark message as read', type: 'error' });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteMessageMut.mutateAsync({ id, token });
      setMessage({ text: 'Message deleted successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to delete message', type: 'error' });
    }
  };
  const renderMessagesList = () => {
    if (messagesLoading) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] animate-pulse">
          Loading inbox messages...
        </div>
      );
    }
    if (messages.length === 0) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl p-8">
          No contact messages found. Your inbox is clean!
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-xl border transition-all ${
              !msg.isRead
                ? 'bg-[var(--color-bg-subtle)] border-2 border-[var(--color-primary)] shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                : 'bg-[var(--color-bg)] border-[var(--color-border)] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 border-b border-[var(--color-border)] pb-3">
              <div>
                <div className="font-mono font-bold text-sm flex items-center gap-2 text-[var(--color-text)]">
                  {msg.name}
                  {!msg.isRead && (
                    <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
                <a href={`mailto:${msg.email}`} className="text-xs font-mono text-[var(--color-primary)] hover:underline">
                  {msg.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
                {!msg.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    disabled={isPending}
                    className="flex items-center gap-1 bg-[var(--color-primary)] text-white text-xs font-mono px-3 py-1.5 rounded-lg hover:bg-[var(--color-primary-dim)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    title="Mark as Read"
                  >
                    <CheckCheck size={14} />
                    {isPending ? 'Updating...' : 'Mark Read'}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  disabled={isPending}
                  className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Delete Message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="font-mono text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)] space-y-6">
      <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-mono font-bold text-lg">Contact Messages Inbox</h3>
        </div>
        <span className="text-xs font-mono text-[var(--color-text-muted)]">
          Total: {messages.length} | Unread: {unreadCount}
        </span>
      </div>

      {renderMessagesList()}
    </div>
  );
}
