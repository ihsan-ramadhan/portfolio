import { motion } from 'framer-motion';
import { MapPin, Terminal, Image as ImageIcon } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

export default function About() {
  return (
    <section id="about" className="py-20 w-full border-t border-[var(--color-border)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader icon={Terminal} title="whoami" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Text Content */}
          <div className="md:col-span-2 space-y-6 text-[var(--color-text-muted)] leading-relaxed">
            <p>
              Halo! Saya <span className="text-[var(--color-text)] font-semibold">Ihsan</span>, mahasiswa Teknik Informatika di Politeknik Negeri Bandung. Saya seorang pengembang perangkat lunak yang berfokus pada pembuatan solusi digital yang fungsional dan user-friendly melalui Web, Mobile, dan Game Development.
            </p>
            <p>
              Selain sisi teknis, saya memiliki jiwa wirausaha yang kuat. Sebagai <span className="text-[var(--color-text)]">Founder Teladan Store</span>, saya telah mengelola lebih dari 375 transaksi aset digital dengan fokus utama pada keamanan dan kepuasan pelanggan.
            </p>
            <p>
              Saat ini, saya sedang memperdalam keahlian di bidang <span className="text-[var(--color-primary)]">Quality Assurance</span>. Saya percaya bahwa aplikasi yang hebat tidak hanya tentang kode yang berjalan, tetapi tentang kualitas dan keandalan sistem yang teruji.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-[var(--color-text)] font-mono text-sm">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                <span>Indonesia</span>
              </div>
            </div>
          </div>

          <div className="relative group mx-auto w-4/5 md:w-full max-w-sm">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative aspect-square rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-2 flex items-center justify-center overflow-hidden">
               <div className="w-full h-full rounded-lg bg-[var(--color-terminal)] flex flex-col items-center justify-center text-[var(--color-text-muted)] border border-dashed border-[var(--color-text-muted)]/30">
                 <ImageIcon size={40} className="mb-3 opacity-40" />
                 <span className="font-mono text-xs">/assets/profile-ihsan.jpg</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}