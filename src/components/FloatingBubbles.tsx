"use client";

export default function FloatingBubbles() {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Large floating bubble 1 - Top Right */}
      <div 
        className="absolute bubble-animate-1"
        style={{
          width: '500px',
          height: '500px',
          top: '-150px',
          right: '-100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(0, 105, 113, 0.25), rgba(0, 105, 113, 0.08) 70%, transparent)',
        }}
      />
      
      {/* Large floating bubble 2 - Left Side */}
      <div 
        className="absolute bubble-animate-2"
        style={{
          width: '450px',
          height: '450px',
          top: '25%',
          left: '-120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 30%, rgba(48, 86, 139, 0.22), rgba(48, 86, 139, 0.06) 70%, transparent)',
        }}
      />
      
      {/* Large floating bubble 3 - Bottom Right */}
      <div 
        className="absolute bubble-animate-3"
        style={{
          width: '550px',
          height: '550px',
          bottom: '-150px',
          right: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(131, 70, 0, 0.18), rgba(131, 70, 0, 0.05) 70%, transparent)',
        }}
      />
    </div>
  );
}
