import { useState } from 'react';
import { Mail, Linkedin, Github, Send, Terminal, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../services/api.service';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => apiClient.post('/contact', data),
    onSuccess: () => {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setError(null);
    },
    onError: () => setError('Failed to send message. Please try again later.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all fields.');
      return;
    }
    mutation.mutate({ name, email, message });
  };

  return (
    <section id="contact" className="py-20 w-full border-t border-[var(--color-border)]">
      <AnimatedSection>
        <SectionHeader icon={Terminal} title="contact.sh" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-[var(--color-primary)]" />
                Let's Connect
              </h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Got an exciting project idea, want to collaborate, or just looking for a casual chat? Feel free to reach out through the contact details below!
              </p>
            </div>

            <div className="space-y-4">
              <a 
                href="mailto:m.ihsan.r30@gmail.com" 
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group"
              >
                <div className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--color-text-muted)]">Email</p>
                  <p className="font-mono text-sm">m.ihsan.r30@gmail.com</p>
                </div>
              </a>

              <a 
                href="https://linkedin.com/in/m-ihsan-r" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group"
              >
                <div className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <Linkedin size={20} />
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--color-text-muted)]">LinkedIn</p>
                  <p className="font-mono text-sm">m-ihsan-r</p>
                </div>
              </a>

              <a 
                href="https://github.com/ihsan-ramadhan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group"
              >
                <div className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <Github size={20} />
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--color-text-muted)]">GitHub</p>
                  <p className="font-mono text-sm">ihsan-ramadhan</p>
                </div>
              </a>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Send size={120} />
            </div>
            
            {submitted ? (
              <div className="p-8 text-center space-y-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                <CheckCircle size={64} className="text-green-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold font-mono text-[var(--color-text)]">MESSAGE_SENT</h4>
                <p className="text-sm text-[var(--color-text-muted)] font-mono">Thank you for reaching out! I will get back to you as soon as possible.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-lg bg-[var(--color-terminal)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  SEND_ANOTHER
                </button>
              </div>
            ) : (
              <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-xs font-mono flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-widest">Name</label>
                  <input 
                    id="name"
                    name="name"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={mutation.isPending}
                    className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-mono text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-widest">Email</label>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    disabled={mutation.isPending}
                    className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-mono text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-widest">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello, Ihsan..."
                    disabled={mutation.isPending}
                    className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-mono text-sm resize-none disabled:opacity-50"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-4 rounded-lg bg-[var(--color-primary)] text-white font-bold font-mono hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send size={18} className={mutation.isPending ? "animate-pulse" : ""} /> 
                  {mutation.isPending ? "SENDING..." : "SEND_MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}