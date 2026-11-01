import type { IconName } from "@/content/site";

const paths: Record<IconName, React.ReactNode> = {
  camera: (<><path d="M4 7h3l2-3h6l2 3h3v13H4z" /><circle cx="12" cy="13" r="4" /></>),
  phone: <path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  pin: (<><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" /><path d="m3 6 9 7 9-7" /></>),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  left: <path d="M15 6l-6 6 6 6" />,
  right: <path d="M9 6l6 6-6 6" />,
  factory: (<><path d="M3 21V10l6 4V10l6 4V5h6v16z" /><path d="M7 18h2M13 18h2" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4" /></>),
  shield: (<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>),
  draft: (<><path d="M3 21h18M5 21V8l7-5 7 5v13" /><path d="M9 21v-6h6v6" /></>),
  wrench: (<><path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z" /><path d="M14.5 6.5 17 4l3 3-2.5 2.5" /></>),
  hand: <path d="M17 11V6a2 2 0 0 0-4 0v5M13 10V4a2 2 0 0 0-4 0v7M9 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 14 4l2.5-4.5a2 2 0 0 0-3.5-2L17 13" />,
  image: (<><rect x="3" y="3" width="18" height="18" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>),
  check: <path d="m5 12 5 5 9-10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></>),
};

export function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
