// plugins/scale.client.ts
export default defineNuxtPlugin(() => {
  const scale = 0.8; // желаемый масштаб

  // простая детекция Safari (не идеальна, но рабочая для большинства случаев)
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua);

  if (isSafari) {
    // ставим CSS переменную — transform fallback для Safari
    document.documentElement.style.setProperty('--app-scale', String(scale));
  } else {
    // прочие браузеры: можем попробовать zoom
    try {
      // некоторые браузеры поддерживают числовой zoom
      (document.documentElement.style as any).zoom = String(scale);
      (document.body.style as any).zoom = String(scale);
    } catch (e) {
      // если упало — ставим CSS fallback
      document.documentElement.style.setProperty('--app-scale', String(scale));
    }
  }
});
