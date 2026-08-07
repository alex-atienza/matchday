import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

export default function CountUp({
  to,
  decimals = 0,
  duration = 1,
  delay = 0,
  suffix = "",
  prefix = "",
}: {
  to: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    setVal(0);
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [to, duration, delay, reduce]);

  return (
    <>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </>
  );
}
