import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { glyph: ReactNode; size?: number; strokeWidth?: number };

const Icon = ({ glyph, size = 20, strokeWidth = 1.75, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {glyph}
  </svg>
);

type P = Omit<IconProps, "glyph">;

export const IconMenu = (p: P) => (
  <Icon {...p} glyph={<><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>} />
);
export const IconX = (p: P) => (
  <Icon {...p} glyph={<><path d="M18 6 6 18" /><path d="M6 6l12 12" /></>} />
);
export const IconSearch = (p: P) => (
  <Icon {...p} glyph={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>} />
);
export const IconSend = (p: P) => (
  <Icon {...p} glyph={<><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></>} />
);
export const IconScale = (p: P) => (
  <Icon
    {...p}
    glyph={
      <>
        <path d="M12 3v18" />
        <path d="M5 7h14" />
        <path d="M5 7 2 15a3.5 3.5 0 0 0 7 0z" />
        <path d="M19 7l-3 8a3.5 3.5 0 0 0 7 0z" />
        <path d="M8 21h8" />
      </>
    }
  />
);
export const IconBriefcase = (p: P) => (
  <Icon
    {...p}
    glyph={
      <>
        <rect x="2.5" y="7" width="19" height="13" rx="1.5" />
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
        <path d="M2.5 12.5h19" />
      </>
    }
  />
);
export const IconHeart = (p: P) => (
  <Icon {...p} glyph={<path d="M12 20.5S3.5 15 3.5 9a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2c0 6-8.5 11.5-8.5 11.5Z" />} />
);
export const IconUsers = (p: P) => (
  <Icon
    {...p}
    glyph={
      <>
        <circle cx="8.5" cy="8" r="3.2" />
        <path d="M2.5 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
        <path d="M15.5 6a3.2 3.2 0 0 1 0 6.3" />
        <path d="M17.2 14.6c2.6.5 4.3 2.4 4.3 5.4" />
      </>
    }
  />
);
export const IconArrowRight = (p: P) => (
  <Icon {...p} glyph={<><path d="M4 12h16" /><path d="M14 6l6 6-6 6" /></>} />
);
export const IconAlert = (p: P) => (
  <Icon
    {...p}
    glyph={
      <>
        <path d="M10.6 3.6 2.4 18a1.6 1.6 0 0 0 1.4 2.4h16.4a1.6 1.6 0 0 0 1.4-2.4L13.4 3.6a1.6 1.6 0 0 0-2.8 0Z" />
        <path d="M12 9.5v4" />
        <path d="M12 17h.01" />
      </>
    }
  />
);
export const IconBot = (p: P) => (
  <Icon
    {...p}
    glyph={
      <>
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M12 8V4" />
        <circle cx="12" cy="3" r="1.2" fill="currentColor" stroke="none" />
        <path d="M9 13v1.5" />
        <path d="M15 13v1.5" />
        <path d="M2 13h2" />
        <path d="M20 13h2" />
      </>
    }
  />
);
export const IconCheck = (p: P) => <Icon {...p} glyph={<path d="M4 12l5.5 5.5L20 6" />} />;
export const IconClock = (p: P) => (
  <Icon {...p} glyph={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>} />
);
export const IconDownload = (p: P) => (
  <Icon {...p} glyph={<><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 20h16" /></>} />
);
export const IconExternalLink = (p: P) => (
  <Icon {...p} glyph={<><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>} />
);
export const IconMapPin = (p: P) => (
  <Icon
    {...p}
    glyph={
      <>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.3" />
      </>
    }
  />
);
export const IconTelegram = (p: P) => <Icon {...p} strokeWidth={1.5} glyph={<path d="M21 4 3 11.2l5.2 1.8L10 19l3-3.6L18 19Z" />} />;
export const IconLinkedin = (p: P) => (
  <Icon
    {...p}
    strokeWidth={1.6}
    glyph={
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7.5 10.5v6" />
        <circle cx="7.5" cy="7.3" r="0.2" fill="currentColor" />
        <path d="M12 16.5v-3.3a2 2 0 0 1 4 0v3.3" />
        <path d="M12 10.5v6" />
      </>
    }
  />
);
export const IconFacebook = (p: P) => (
  <Icon {...p} glyph={<path d="M14.5 21v-6.5H17l.5-3H14.5V9.2c0-1 .3-1.7 1.8-1.7H17.5V4.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.2H8v3h2.5V21Z" />} />
);
export const IconXTwitter = (p: P) => (
  <Icon {...p} strokeWidth={1.9} glyph={<><path d="M4 4l16 16" /><path d="M20 4 4 20" /></>} />
);
