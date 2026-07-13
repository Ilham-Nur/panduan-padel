import type { HTMLAttributes, ReactNode } from "react";
import "./Card.css";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "article" | "section" | "div";
  interactive?: boolean;
};

export function Card({ as: Component = "article", children, className = "", interactive = false, ...props }: CardProps) {
  return (
    <Component className={`card ${interactive ? "card--interactive" : ""} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
