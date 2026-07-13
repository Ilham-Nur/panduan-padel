type IconProps = {
  name: string;
  filled?: boolean;
  className?: string;
  label?: string;
};

export function Icon({ name, filled = false, className = "", label }: IconProps) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={`material-symbols-outlined icon ${className}`.trim()}
      role={label ? "img" : undefined}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
    >
      {name}
    </span>
  );
}
