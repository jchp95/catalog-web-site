"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./DemoDialog.css";

type DemoDialogProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
};

let scrollLocks = 0;
let restoreScroll: (() => void) | undefined;

function lockPageScroll() {
  if (scrollLocks === 0) {
    const body = document.body;
    const root = document.documentElement;
    const overflow = body.style.overflow;
    const rootOverflow = root.style.overflow;
    const paddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const bodyPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;
    restoreScroll = () => {
      body.style.overflow = overflow;
      root.style.overflow = rootOverflow;
      body.style.paddingRight = paddingRight;
    };
  }
  scrollLocks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLocks -= 1;
    if (scrollLocks === 0) {
      restoreScroll?.();
      restoreScroll = undefined;
    }
  };
}

/** Native top-layer dialog with focus trapping, background inertness and Escape support. */
export function DemoDialog({ open, onClose, label, children, className = "", panelClassName = "" }: DemoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  const pointerStartedOutside = useRef(false);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    const unlock = lockPageScroll();
    return () => {
      if (dialog.open) dialog.close();
      unlock();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      aria-modal="true"
      className={`demo-dialog ${className}`.trim()}
      onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
      onClose={() => { if (open && !dialogRef.current?.open) closeRef.current(); }}
      onPointerDown={(event) => { pointerStartedOutside.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (pointerStartedOutside.current && event.target === event.currentTarget) closeRef.current();
        pointerStartedOutside.current = false;
      }}
    >
      <div className={`demo-dialog-panel ${panelClassName}`.trim()}>{children}</div>
    </dialog>
  );
}
