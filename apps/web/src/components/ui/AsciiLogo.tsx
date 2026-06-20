import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LOGO_ASCII_TEMPLATE = `
████   █████████████  
████   █████    █████ 
████   █████    █████ 
████   █████████████  
████   ███████████    
████   █████ ▀█████   
████   █████   ▀█████ 
████   █████     ▀█████
`.trim();

const GLITCH_CHARS = ['0', '1', '/', '\\', '|', '_', '*', '+', '?', '%', '$', '#', '@', 'X', 'Y', 'Z'];

export default function AsciiLogo() {
  const [glitchedLogo, setGlitchedLogo] = useState(LOGO_ASCII_TEMPLATE);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const glitchChance = isHovered ? 0.08 : 0.015;
      
      const charArray = LOGO_ASCII_TEMPLATE.split('');
      const length = charArray.length;
      
      const numToGlitch = Math.floor(length * glitchChance);

      for (let i = 0; i < numToGlitch; i++) {
        const randomIndex = Math.floor(Math.random() * length);
        const char = charArray[randomIndex];
        
        if (char === '█' || char === '▀') {
          charArray[randomIndex] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      }

      setGlitchedLogo(charArray.join(''));
    }, 80);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-[450px] hidden lg:flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`absolute w-72 h-72 bg-primary rounded-full blur-[100px] pointer-events-none transition-opacity duration-500 ${
          isHovered ? 'opacity-15' : 'opacity-5'
        }`} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ 
          scale: { duration: 0.15, ease: 'easeInOut' },
          default: { duration: 0.8, ease: 'easeOut' }
        }}
        className="relative p-0 group transition-transform duration-300"
      >
        <pre className="font-mono text-2xl sm:text-3xl md:text-4xl leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-primary-dim to-blue-400 animate-ascii-glow select-none drop-shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all duration-300">
          {glitchedLogo}
        </pre>
      </motion.div>
    </div>
  );
}
