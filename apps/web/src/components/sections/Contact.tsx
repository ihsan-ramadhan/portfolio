import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send, Terminal, MessageSquare } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

export default function Contact() {
  return (
    <section id="contact" className="py-20 w-full border-t border-[var(--color-border)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <SectionHeader icon={Terminal} title="contact.sh" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-[var(--color-primary)]" />
                Let's Connect
              </h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Ada ide proyek seru, mau ajak kolaborasi, atau sekadar ingin diskusi santai? Boleh banget, hubungi saya lewat kontak di bawah ini!
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
            
            <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-widest">Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-widest">Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-widest">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Hello, Ihsan..."
                  className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-mono text-sm resize-none"
                ></textarea>
              </div>
              <button className="w-full py-4 rounded-lg bg-[var(--color-primary)] text-white font-bold font-mono hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
                <Send size={18} /> SEND_MESSAGE
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}