import { motion, type HTMLMotionProps } from 'framer-motion';

interface AnimatedSectionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  ...props 
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ 
        type: "spring",
        stiffness: 80,
        damping: 18,
        mass: 0.85,
        delay
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
