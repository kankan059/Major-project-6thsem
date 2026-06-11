'use client';
import { useEffect, useState } from 'react';

// TypeScript ko bataya ki global window ke paas Razorpay custom entity hai
declare global {
  interface Window {
    Razorpay: {
      open(): void;
      close(): void;
    };
  }
}

export function useRazorpay() {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (window.Razorpay) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);



  return loaded;
}