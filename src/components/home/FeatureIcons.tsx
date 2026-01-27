type IconProps = {
  className?: string;
  title: string;
};

function IconBase({
  className,
  title,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

const stroke = "currentColor";

export function GroupPlanningIcon(props: Omit<IconProps, "title">) {
  return (
    <IconBase title="Group Planning" {...props}>
      <path
        d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
      <path
        d="M8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
      <path
        d="M4 20c0-3 2.5-5 6-5"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 20c0-3-2.5-5-6-5"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 20c0-3 1-5 2-5s2 2 2 5"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function SmartSchedulingIcon(props: Omit<IconProps, "title">) {
  return (
    <IconBase title="Smart Scheduling" {...props}>
      <path
        d="M7 4v2M17 4v2"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 8h12"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 6h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
      <path
        d="M12 12v4l3 2"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

export function VenueVotingIcon(props: Omit<IconProps, "title">) {
  return (
    <IconBase title="Venue Voting" {...props}>
      <path
        d="M9 5h10a2 2 0 0 1 2 2v10"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
      <path
        d="M8 11l2 2 4-5"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16h6"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconBase>
  );
}


