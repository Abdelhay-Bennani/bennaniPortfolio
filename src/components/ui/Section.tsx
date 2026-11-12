import type { ReactNode } from "react";
import ScrollReveal from "@/components/scene/ScrollReveal";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
  titleClassName = "section-title-reveal",
  maxWidth,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  maxWidth?: number;
}) {
  return (
    <section
      id={id}
      className={`mb-24 md:mb-40 ${className}`.trim()}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && (
        <ScrollReveal
          as="h2"
          mode="scrub"
          splitBy="words"
          effect="rise"
          baseOpacity={0.12}
          baseOffset={24}
          enableBlur
          blurStrength={2}
          stagger={0.08}
          smoothing={0.45}
          containerClassName={titleClassName}
        >
          {title}
        </ScrollReveal>
      )}
      {children}
    </section>
  );
}
