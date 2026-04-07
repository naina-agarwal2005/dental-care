"use client";

import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  size: number;
  left: number;
  animationDuration: number;
  delay: number;
  opacity: number;
}

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate random bubbles on mount
    const generatedBubbles: Bubble[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 200 + 100, // 100px to 300px
      left: Math.random() * 100, // 0% to 100%
      animationDuration: Math.random() * 15 + 20, // 20s to 35s
      delay: Math.random() * -20, // Stagger start times
      opacity: Math.random() * 0.08 + 0.04, // 0.04 to 0.12
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Animated floating bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            backgroundColor: bubble.id % 3 === 0 
              ? `rgba(0, 105, 113, ${bubble.opacity})` // secondary
              : bubble.id % 3 === 1 
                ? `rgba(48, 86, 139, ${bubble.opacity})` // primary
                : `rgba(131, 70, 0, ${bubble.opacity})`, // tertiary
            animation: `floatBubble ${bubble.animationDuration}s ease-in-out infinite`,
            animationDelay: `${bubble.delay}s`,
            filter: 'blur(40px)',
          }}
        />
      ))}

      {/* Static large gradient orbs for depth */}
      <div 
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 105, 113, 0.12) 0%, transparent 70%)',
        }} 
      />
      <div 
        className="absolute top-1/3 -left-48 w-[400px] h-[400px] rounded-full"
        style={{ 
          background: 'radial-gradient(circle, rgba(48, 86, 139, 0.10) 0%, transparent 70%)',
        }} 
      />
      <div 
        className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] rounded-full"
        style={{ 
          background: 'radial-gradient(circle, rgba(131, 70, 0, 0.08) 0%, transparent 70%)',
        }} 
      />

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes floatBubble {
          0%, 100% {
            transform: translateY(100vh) scale(1);
          }
          50% {
            transform: translateY(-20vh) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
