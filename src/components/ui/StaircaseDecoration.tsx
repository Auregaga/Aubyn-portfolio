interface StaircaseDecorationProps {
  color?: string;
  reverse?: boolean;
}

const StaircaseDecoration: React.FC<StaircaseDecorationProps> = ({
  color = '#ffffff',
  reverse = false,
}) => {
  const steps = [
    { size: 60, offset: 0 },
    { size: 100, offset: 60 },
    { size: 160, offset: 160 },
  ];

  return (
    <div
      className={`absolute top-1/4 flex flex-col ${reverse ? 'items-end' : 'items-start'}`}
      style={{ [reverse ? 'right' : 'left']: '5vw' }}
    >
      {steps.map((step, i) => (
        <div
          key={i}
          style={{
            width: step.size,
            height: step.size,
            marginLeft: reverse ? 0 : step.offset,
            marginRight: reverse ? step.offset : 0,
            marginTop: i === 0 ? 0 : -1,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

export default StaircaseDecoration;
