"use client";

import { useEffect, useState } from "react";

const styles = `
:root {
  --digit-dur: 500ms;
  --digit-distance: 8px;
  --digit-stagger: 70ms;
  --digit-blur: 2px;
  --digit-ease: cubic-bezier(0.34, 1.45, 0.64, 1);
}

@keyframes t-digit-pop-in {
  0% {
    transform: translateY(8px);
    opacity: 0;
    filter: blur(var(--digit-blur));
  }
  100% { transform: translateY(0); opacity: 1; filter: blur(0); }
}

.t-digit-group { display: inline-flex; align-items: baseline; }
.t-digit { display: inline-block; will-change: transform, opacity, filter; }
.t-digit-group.is-animating .t-digit {
  animation: t-digit-pop-in var(--digit-dur) var(--digit-ease) both;
}
.t-digit-group.is-animating .t-digit[data-stagger="1"] { animation-delay: var(--digit-stagger); }
.t-digit-group.is-animating .t-digit[data-stagger="2"] { animation-delay: calc(var(--digit-stagger) * 2); }
.t-digit-group.is-animating .t-digit[data-stagger="3"] { animation-delay: calc(var(--digit-stagger) * 3); }
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("digit-styles")
) {
  const style = document.createElement("style");
  style.id = "digit-styles";
  style.textContent = styles;
  document.head.appendChild(style);
}

// Длительности из CSS: --digit-dur (500ms) + --digit-stagger * 3 (210ms) + запас
const ANIMATION_MS = 800;

export function NumberPopIn({ value }: { value: any }) {
  const str = String(value);
  const [playing, setPlaying] = useState(true);

  // Запускаем анимацию при появлении и при смене значения, затем «схлопываем»
  // в обычный текст — чтобы число выделялось и копировалось как цельная строка,
  // а не по символу (каждый символ — отдельный inline-block).
  useEffect(() => {
    setPlaying(true);
    const id = setTimeout(() => setPlaying(false), ANIMATION_MS);
    return () => clearTimeout(id);
  }, [str]);

  const replay = () => {
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
  };

  // После анимации — обычный текст (нормальное выделение/копирование)
  if (!playing) {
    return (
      <span onClick={replay} style={{ cursor: "pointer" }}>
        {str}
      </span>
    );
  }

  // Во время анимации — посимвольный pop-in. aria-label даёт скринридерам
  // цельную строку, сами символы скрыты от них.
  return (
    <span
      className="t-digit-group is-animating"
      onClick={replay}
      style={{ cursor: "pointer" }}
      aria-label={str}
    >
      {str
        .split("")
        .map((ch: string, i: number) => (
          <span
            key={i}
            className="t-digit"
            aria-hidden="true"
            data-stagger={i > 0 ? String(Math.min(i, 3)) : undefined}
          >
            {/* Пробел оборачиваем в неразрывный, иначе inline-block его схлопывает */}
            {ch === " " ? " " : ch}
          </span>
        ))}
    </span>
  );
}
