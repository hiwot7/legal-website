import { T } from "@/lib/i18n";

export const EDITABLE_CONTENT_KEYS = [
  "heroKicker",
  "heroTitle",
  "heroSub",
  "ctaPrimary",
  "ctaSecondary",
  "insightsEyebrow",
  "insightsTitle",
  "footerNote",
] as const;

export type EditableContentKey = (typeof EDITABLE_CONTENT_KEYS)[number];

export function defaultContentValue(key: EditableContentKey) {
  return { valueEn: T.en[key], valueAm: T.am[key], valueOm: T.om[key] };
}
