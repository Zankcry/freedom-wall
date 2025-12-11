'use client';

export default function BackgroundStickers() {
  const stickers = [
    { emoji: '⭐', color: '#FFB6C1', size: 'w-16 h-16', top: 'top-10', left: 'left-10', delay: '0s' },
    { emoji: '💫', color: '#FFD700', size: 'w-20 h-20', top: 'top-32', right: 'right-20', delay: '0.5s' },
    { emoji: '💖', color: '#FF69B4', size: 'w-14 h-14', bottom: 'bottom-20', left: 'left-20', delay: '1s' },
    { emoji: '✨', color: '#87CEEB', size: 'w-18 h-18', top: 'top-1/2', right: 'right-10', delay: '0.3s' },
    { emoji: '🌟', color: '#FFA07A', size: 'w-16 h-16', bottom: 'bottom-40', right: 'right-32', delay: '1.2s' },
    { emoji: '💝', color: '#DDA0DD', size: 'w-12 h-12', top: 'top-64', left: 'left-1/4', delay: '0.8s' },
    { emoji: '🎀', color: '#FFB347', size: 'w-14 h-14', bottom: 'bottom-64', right: 'right-1/4', delay: '0.6s' },
    { emoji: '💕', color: '#F0E68C', size: 'w-10 h-10', top: 'top-1/3', left: 'left-1/3', delay: '1.5s' },
    { emoji: '🌸', color: '#FFC0CB', size: 'w-12 h-12', top: 'top-20', left: 'left-1/2', delay: '0.4s' },
    { emoji: '🦋', color: '#B0E0E6', size: 'w-16 h-16', bottom: 'bottom-20', left: 'left-1/3', delay: '0.9s' },
    { emoji: '🌺', color: '#FFB6C1', size: 'w-14 h-14', top: 'top-3/4', right: 'right-1/3', delay: '0.7s' },
    { emoji: '💐', color: '#FFB6C1', size: 'w-12 h-12', top: 'top-1/4', right: 'right-1/2', delay: '1.1s' },
    { emoji: '🎈', color: '#FF69B4', size: 'w-14 h-14', bottom: 'bottom-1/3', left: 'left-1/2', delay: '0.2s' },
    { emoji: '🎁', color: '#DDA0DD', size: 'w-16 h-16', top: 'top-2/3', right: 'right-1/5', delay: '1.3s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stickers.map((sticker, index) => {
        const isBounce = index % 2 === 0;
        const animationType = isBounce ? 'animate-bounce' : 'animate-pulse';
        const duration = (3 + (index % 3) * 0.5) + 's';
        
        return (
          <div
            key={index}
            className={`absolute ${sticker.size} opacity-15 ${animationType} ${sticker.top || ''} ${sticker.bottom || ''} ${sticker.left || ''} ${sticker.right || ''}`}
            style={{
              animationDuration: duration,
              animationDelay: sticker.delay,
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-4xl shadow-lg"
              style={{
                background: `radial-gradient(circle, ${sticker.color} 0%, ${sticker.color}dd 100%)`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            >
              {sticker.emoji}
            </div>
          </div>
        );
      })}
    </div>
  );
}

