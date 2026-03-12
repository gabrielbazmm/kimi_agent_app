export function SoundWaveAnimation() {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-neutral-800 rounded-full sound-bar"
          style={{ height: '20%', animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
