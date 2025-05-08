
import { Users, FileText, Award, TrendingUp } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface CounterProps {
  end: number;
  duration: number;
  prefix?: string;
  suffix?: string;
}

// Contador animado
const Counter: React.FC<CounterProps> = ({ end, duration, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * end));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    if (inView) {
      animationFrame = requestAnimationFrame(updateCount);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

export default function Metrics() {
  const metrics = [
    {
      icon: <FileText className="w-12 h-12 text-lfcom-black" />,
      value: 5870,
      label: "Análises realizadas",
      prefix: "",
      suffix: "+",
    },
    {
      icon: <Users className="w-12 h-12 text-lfcom-black" />,
      value: 1200,
      label: "Clientes ativos",
      prefix: "",
      suffix: "+",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-lfcom-black" />,
      value: 85,
      label: "Taxa média de retorno",
      prefix: "",
      suffix: "%",
    },
    {
      icon: <Award className="w-12 h-12 text-lfcom-black" />,
      value: 98,
      label: "Índice de satisfação",
      prefix: "",
      suffix: "%",
    },
  ];

  return (
    <section className="py-20 bg-lfcom-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">{metric.icon}</div>
              <div className="text-4xl font-bold mb-2">
                <Counter 
                  end={metric.value} 
                  duration={2000} 
                  prefix={metric.prefix} 
                  suffix={metric.suffix} 
                />
              </div>
              <div className="text-lfcom-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
