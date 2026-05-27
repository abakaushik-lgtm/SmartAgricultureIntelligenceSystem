import clsx from "clsx";
import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx("rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950", className)}>{children}</section>;
}
