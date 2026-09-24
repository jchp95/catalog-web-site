"use client";

import { useRef } from "react";
import type { ReactNode, MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
  "data-cursor"?: string;
};

/** Magnetic hover — max pull kept tiny for premium feel. */
export function MagneticButton({
  children,
  className = "",
  strength = 0.28,
  as = "button",
  href,
  onClick,
  type = "button",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  const shared = {
    ref: ref as never,
    className: `munich-magnetic ${className}`,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    ...rest,
  };

  if (as === "a" && href) {
    return (
      <a href={href} {...shared}>
        {children}
      </a>
    );
  }
  if (as === "div") {
    return <div {...shared}>{children}</div>;
  }
  return (
    <button type={type} {...shared}>
      {children}
    </button>
  );
}
