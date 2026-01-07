import { useEffect, useState } from "react";

export const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (end === start) {
      setCount(end);
      return;
    }

    setIsAnimating(true);
    const startTime = Date.now();
    const endTime = startTime + duration;
    const difference = end - start;

    const animate = () => {
      const now = Date.now();
      const remaining = Math.max(endTime - now, 0);
      const progress = Math.min((duration - remaining) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.round(start + difference * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return { count, isAnimating };
};
