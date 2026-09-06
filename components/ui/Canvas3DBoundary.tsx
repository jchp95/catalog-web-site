"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { failed: boolean };

/**
 * React Three Fiber has no built-in recovery from a lost/failed WebGL
 * context, so a 3D scene is always wrapped in this boundary. Any render or
 * lifecycle error inside — driver crash, context loss, an unsupported
 * feature — quietly swaps back to the ordinary 2D presentation instead of
 * breaking the page a prospect is looking at.
 */
export class Canvas3DBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") console.error("3D scene fell back to 2D:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
