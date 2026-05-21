'use client';

export default function BackgroundStickers() {
  const stickers = [
    { emoji: '⭐', color: 'from-pink-300 to-rose-400', size: 'w-16 h-16', top: 'top-12', left: 'left-[8%]', animate: 'animate-float', delay: '0s' },
    { emoji: '💫', color: 'from-amber-200 to-yellow-400', size: 'w-20 h-20', top: 'top-32', right: 'right-[12%]', animate: 'animate-float-reverse', delay: '1.2s' },
    { emoji: '💖', color: 'from-rose-400 to-red-500', size: 'w-14 h-14', bottom: 'bottom-20', left: 'left-[10%]', animate: 'animate-float', delay: '2.5s' },
    { emoji: '✨', color: 'from-sky-300 to-indigo-400', size: 'w-18 h-18', top: 'top-1/2', right: 'right-[6%]', animate: 'animate-float-reverse', delay: '0.8s' },
    { emoji: '🌟', color: 'from-orange-300 to-amber-500', size: 'w-16 h-16', bottom: 'bottom-40', right: 'right-[15%]', animate: 'animate-float', delay: '3.1s' },
    { emoji: '💝', color: 'from-purple-300 to-pink-500', size: 'w-14 h-14', top: 'top-1/4', left: 'left-[22%]', animate: 'animate-float-reverse', delay: '1.8s' },
    { emoji: '🎀', color: 'from-amber-300 to-orange-400', size: 'w-14 h-14', bottom: 'bottom-48', left: 'left-[45%]', animate: 'animate-float', delay: '4.5s' },
    { emoji: '💕', color: 'from-yellow-200 to-amber-300', size: 'w-12 h-12', top: 'top-1/3', left: 'left-[35%]', animate: 'animate-float-reverse', delay: '0.2s' },
    { emoji: '🌸', color: 'from-pink-200 to-rose-300', size: 'w-14 h-14', top: 'top-16', left: 'left-[48%]', animate: 'animate-float', delay: '2.9s' },
    { emoji: '🦋', color: 'from-cyan-300 to-sky-400', size: 'w-16 h-16', bottom: 'bottom-12', left: 'left-[28%]', animate: 'animate-float-reverse', delay: '1.5s' },
    { emoji: '🌺', color: 'from-rose-300 to-pink-400', size: 'w-14 h-14', top: 'top-3/4', right: 'right-[32%]', animate: 'animate-float', delay: '3.7s' },
    { emoji: '💐', color: 'from-violet-300 to-fuchsia-400', size: 'w-14 h-14', top: 'top-1/4', right: 'right-[40%]', animate: 'animate-float-reverse', delay: '2.1s' },
    { emoji: '🎈', color: 'from-red-400 to-pink-500', size: 'w-14 h-14', bottom: 'bottom-1/3', left: 'left-[60%]', animate: 'animate-float', delay: '0.5s' },
    { emoji: '🎁', color: 'from-fuchsia-300 to-purple-500', size: 'w-16 h-16', top: 'top-2/3', right: 'right-[20%]', animate: 'animate-float-reverse', delay: '3.4s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Ambient Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-900/10 dark:to-purple-950/10 blur-[120px] animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-pink-200/15 to-amber-100/15 dark:from-purple-950/10 dark:to-zinc-900/10 blur-[140px] animate-float-slow-reverse" />
      <div className="absolute top-[35%] right-[10%] w-[35%] h-[35%] rounded-full bg-gradient-to-bl from-sky-200/20 to-teal-100/15 dark:from-blue-950/10 dark:to-zinc-950/10 blur-[100px] animate-float-slow" />

      {/* Floating Glass Emojis */}
      {stickers.map((sticker, index) => {
        const duration = (6 + (index % 4) * 1.5) + 's';
        
        return (
          <div
            key={index}
            className={`absolute ${sticker.size} opacity-40 dark:opacity-25 ${sticker.animate} ${sticker.top || ''} ${sticker.bottom || ''} ${sticker.left || ''} ${sticker.right || ''}`}
            style={{
              animationDuration: duration,
              animationDelay: sticker.delay,
            }}
          >
            <div
              className={`w-full h-full rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white/30 dark:border-zinc-800/20 bg-gradient-to-br ${sticker.color} backdrop-blur-[4px] p-2`}
              style={{
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.03)',
              }}
            >
              <span className="filter drop-shadow-md select-none transform scale-90">{sticker.emoji}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
