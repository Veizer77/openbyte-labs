import Link from "next/link";
import type { ReactNode } from "react";

export function BentoCard({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-[16px] p-5 shadow-[0px_1px_2px_#0000000d] transition-all ${
        dark
          ? "bg-[#18181a] text-white"
          : "border border-[#eaeaea] bg-white text-[#18181a]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  subtext,
  icon,
  badgeType = "neutral",
  dark = false,
  href,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: string;
  badgeType?: "success" | "warning" | "danger" | "lime" | "neutral";
  dark?: boolean;
  href?: string;
}) {
  const badgeClasses = {
    success: "text-[#82b440]",
    warning: "text-[#f97316]",
    danger: "text-[#ba1a1a]",
    lime: "text-[#e2e89d]",
    neutral: "text-[#71717a]",
  }[badgeType];

  const content = (
    <div
      className={`relative flex h-[132px] flex-col justify-between rounded-[16px] p-5 shadow-[0px_1px_2px_#0000000d] transition-all hover:translate-y-[-1px] hover:shadow-md ${
        dark
          ? "bg-[#18181a] text-white"
          : "border border-[#eaeaea] bg-white text-[#18181a]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[12px] font-medium tracking-[0.12px] ${
            dark ? "text-[#e2e89d]" : "text-[#52525b]"
          }`}
        >
          {label}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${
            dark
              ? "bg-[#242427] text-[#e2e89d]"
              : badgeType === "danger"
              ? "bg-[#ffdad6] text-[#ba1a1a]"
              : "bg-[#f0f0f0] text-[#18181a]"
          }`}
        >
          <span className="symbol text-[18px]" aria-hidden="true">
            {icon}
          </span>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[36px] font-semibold leading-none tracking-[-1px] tabular-nums">
          {value}
        </span>
        {subtext ? (
          <span className={`text-[12px] font-medium tracking-[0.12px] ${badgeClasses}`}>
            {subtext}
          </span>
        ) : null}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block no-underline">
      {content}
    </Link>
  ) : (
    content
  );
}

export function Chip({
  children,
  variant = "neutral",
  size = "md",
}: {
  children: ReactNode;
  variant?: "neutral" | "lime" | "success" | "warning" | "danger" | "dark";
  size?: "sm" | "md";
}) {
  const styles = {
    neutral: "bg-[#f0f0f0] text-[#18181a]",
    lime: "bg-[#e2e89d] text-[#454a10]",
    success: "bg-[#eef8ed] text-[#457c1d] border border-[#d6eed3]",
    warning: "bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]",
    danger: "bg-[#fef2f2] text-[#991b1b] border border-[#fee2e2]",
    dark: "bg-[#18181a] text-white",
  }[variant];

  const sizeClass = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] font-medium tracking-[0.2px] leading-tight ${sizeClass} ${styles}`}
    >
      {children}
    </span>
  );
}

export function ToolbarButton({
  children,
  icon,
  onClick,
  href,
  variant = "light",
  className = "",
  disabled = false,
  type = "button",
  title,
}: {
  children: ReactNode;
  icon?: string;
  onClick?: () => void;
  href?: string;
  variant?: "dark" | "light" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 h-[34px] px-3.5 rounded-[12px] text-[13px] font-medium transition-all shadow-[0px_1px_2px_#0000000d] disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "dark"
      ? "bg-[#18181a] text-white hover:bg-black"
      : variant === "danger"
      ? "bg-[#fef2f2] text-[#991b1b] border border-[#fee2e2] hover:bg-[#fee2e2]"
      : "bg-white border border-[#eaeaea] text-[#18181a] hover:bg-[#f9f9f9]";

  const content = (
    <>
      {icon ? (
        <span className="symbol text-[18px]" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  );

  return href ? (
    <Link href={href} title={title} className={`${base} ${styles} ${className}`}>
      {content}
    </Link>
  ) : (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {content}
    </button>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Cari data...",
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-[10px] bg-[#f0f0f0] px-3 py-1.5 text-[#595962] ${className}`}
    >
      <span className="symbol text-[18px]">search</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-[#18181a] placeholder-[#71717a] outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="symbol text-sm text-[#71717a] hover:text-[#18181a]"
        >
          close
        </button>
      ) : null}
    </div>
  );
}

export function TabFilter<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: T; label: string; count?: number }>;
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-[12px] bg-[#f0f0f0] p-1">
      {tabs.map((tab) => {
        const isCurrent = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-medium transition-all ${
              isCurrent
                ? "bg-white text-[#18181a] shadow-sm font-semibold"
                : "text-[#52525b] hover:text-[#18181a]"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" ? (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isCurrent ? "bg-[#f0f0f0] text-[#18181a]" : "bg-white/60 text-[#71717a]"
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          {icon ? <span className="symbol text-[20px] text-[#52525b]">{icon}</span> : null}
          <h2 className="m-0 text-base font-semibold text-[#18181a]">{title}</h2>
          {badge}
        </div>
        {subtitle ? <p className="mt-0.5 text-xs text-[#71717a]">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function EmptyState({
  title = "Tidak ada data",
  description,
  icon = "inbox",
  action,
}: {
  title?: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] bg-[#f9f9f9] p-8 text-center">
      <span className="symbol text-3xl text-[#a1a1aa] mb-2">{icon}</span>
      <h3 className="m-0 text-sm font-medium text-[#18181a]">{title}</h3>
      {description ? (
        <p className="mt-1 text-xs text-[#71717a] max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
