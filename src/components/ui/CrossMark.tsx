interface CrossMarkProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  size?: number;
  color?: string;
}

const CrossMark: React.FC<CrossMarkProps> = ({ position, size = 20, color = '#000' }) => {
  const posMap: Record<string, string> = {
    'top-left': 'top-5 left-5',
    'top-right': 'top-5 right-5',
    'bottom-left': 'bottom-5 left-5',
    'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-5 right-5',
  };

  return (
    <div className={`absolute pointer-events-none ${posMap[position]} z-20`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke={color} strokeWidth={1} />
        <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke={color} strokeWidth={1} />
      </svg>
    </div>
  );
};

export default CrossMark;
