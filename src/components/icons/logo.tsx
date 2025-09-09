import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
      <path d="M8 8l2 2" />
      <path d="M14 8l-2 2" />
      <path d="M8 16l2-2" />
      <path d="M14 16l-2-2" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}
