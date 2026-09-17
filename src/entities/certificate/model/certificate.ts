/** @format */

import { API_URL } from "@/shared/config";
import type { ApiBoolean, CertificateListItem } from "./types";

export function parseApiBoolean(value: ApiBoolean): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return undefined;
}

export function normalizeStatus(status: string | null | undefined) {
  return (status ?? "").trim().toUpperCase();
}

// Candidate sertifikatni faqat shu holatlarda tahrirlay oladi
const EDITABLE_STATUSES = ["NEW", "PROBLEM"];

export function canEditCertificate(
  certificate: Pick<CertificateListItem, "status" | "is_edit">,
) {
  // Backend is_edit'ni o'zi hisoblab beradi — kelsa unga ishoniladi, kelmasa holatdan aniqlanadi
  return (
    parseApiBoolean(certificate.is_edit) ??
    EDITABLE_STATUSES.includes(normalizeStatus(certificate.status))
  );
}

export function isCertificatePaid(
  certificate: Pick<CertificateListItem, "is_paid">,
) {
  return parseApiBoolean(certificate.is_paid) ?? false;
}

export type StatusTone = "info" | "success" | "warning" | "danger" | "neutral";

// Holat kodlarining to'liq ro'yxati swagger'da yo'q — ma'lum kodlar va umumiy
// so'z ildizlari bo'yicha rang tanlanadi, tanilmagani neytral qoladi.
export function getStatusTone(status: string | null | undefined): StatusTone {
  const normalized = normalizeStatus(status);

  if (normalized === "NEW") return "info";
  if (normalized === "PROBLEM" || normalized.includes("REJECT"))
    return "danger";
  if (
    ["APPROV", "ACCEPT", "CONFIRM", "SUCCESS"].some((root) =>
      normalized.includes(root),
    )
  ) {
    return "success";
  }
  if (
    ["REVIEW", "PROCESS", "PENDING"].some((root) => normalized.includes(root))
  )
    return "warning";
  return "neutral";
}

/** URL'dagi :id parametri — musbat butun son bo'lmasa null. */
export function parseCertificateId(value: string | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Fayl manzili to'liq URL yoki API'ga nisbatan yo'l ("/media/...") bo'lib kelishi mumkin.
// Backend proksi ortida to'liq URL'ni "http://" bilan qaytaradi, server esa http so'roviga
// 403 beradi (CORS sarlavhalarisiz) — API bilan bir xil hostdagi manzil API_URL protokoliga keltiriladi.
export function getCertificateFileUrl(path: string | null | undefined) {
  if (!path) return null;
  if (!/^https?:\/\//.test(path)) {
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  try {
    const url = new URL(path);
    const apiUrl = new URL(API_URL);
    if (url.host === apiUrl.host) url.protocol = apiUrl.protocol;
    return url.href;
  } catch {
    return path;
  }
}

// swagger: ScoreRead — [{ id, section: "Reading", score: "7.5" }], section bo'lim NOMI
function fromScoreList(items: readonly unknown[]): Record<string, string> {
  return Object.fromEntries(
    items.flatMap((item) => {
      if (typeof item !== "object" || item === null) return [];
      const { section, score } = item as { section?: unknown; score?: unknown };
      if (section === null || section === undefined) return [];
      return [
        [
          String(section),
          score === null || score === undefined ? "" : String(score),
        ],
      ];
    }),
  );
}

/**
 * extra_data'ni "maydon nomi → qiymat" ko'rinishiga keltiradi. Backend ballar massivini
 * (ScoreRead) yoki JSON satr-obyektni qaytarishi mumkin; buzilgan qiymat bo'sh obyekt beradi.
 */
export function parseExtraData(raw: unknown): Record<string, string> {
  if (Array.isArray(raw)) return fromScoreList(raw);
  if (typeof raw !== "string" || !raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return fromScoreList(parsed);
    if (typeof parsed !== "object" || parsed === null) return {};

    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        value == null ? "" : String(value),
      ]),
    );
  } catch {
    return {};
  }
}
