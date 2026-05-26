//can use dom is a check for SSR safety, common ssr-safe practice to prevent "window is not defined" errors - google it for more info
export default !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);
