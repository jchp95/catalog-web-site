/**
 * Cheap, synchronous WebGL support probe.
 *
 * Used to progressively enhance a 2D/DOM presentation into a real-time 3D
 * one — never the other way around. Always call this after mount; it must
 * never run during SSR (canvas/WebGL do not exist on the server) and must
 * never gate content that a user needs, only a decorative upgrade.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(context);
  } catch {
    return false;
  }
}
