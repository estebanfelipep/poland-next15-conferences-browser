'use client';

import React, { useEffect, useState, unstable_ViewTransition as ReactViewTransition } from 'react';

export default function ViewTransition({ children }: React.ViewTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <ReactViewTransition>{children}</ReactViewTransition> : <>{children}</>;
}
