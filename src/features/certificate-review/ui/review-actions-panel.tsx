/** @format */

import {
  ChevronDown,
  CircleCheck,
  CircleX,
  LoaderCircle,
  Settings,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  isCertificatePaid,
  type CertificateDetail,
} from "@/entities/certificate";
import { getApiErrorMessage, getHttpStatus } from "@/shared/api";
import { cn } from "@/shared/lib/cn";
import { Button, SelectField } from "@/shared/ui";
import {
  useReviewStatuses,
  useSmsMessages,
  useUpdateCertificateStatus,
} from "../api/certificate-review-api";
import {
  findStatusId,
  getReviewStep,
  getStatusCode,
  requiresSmsMessage,
  type ReviewStatusCode,
} from "../model/review";
import { ReviewStepper } from "./review-stepper";

const ACTIONS = [
  {
    code: "approved",
    labelKey: "dashboard.review.actions.approve",
    confirmKey: "dashboard.review.actions.confirmApprove",
    icon: CircleCheck,
    className: "bg-primary text-on-primary hover:bg-primary-hover",
  },
  {
    code: "rejected",
    labelKey: "dashboard.review.actions.reject",
    confirmKey: "dashboard.review.actions.confirmReject",
    icon: CircleX,
    className: "bg-danger text-on-primary hover:bg-danger/90",
  },
  {
    code: "problem",
    labelKey: "dashboard.review.actions.problem",
    confirmKey: "dashboard.review.actions.confirmProblem",
    icon: TriangleAlert,
    // Oltin fon ikkala mavzuda bir xil — ustidagi matn doim to'q bo'lishi kerak
    className: "bg-gold text-[#14181f] hover:bg-gold/90",
  },
] as const satisfies readonly {
  code: ReviewStatusCode;
  labelKey: string;
  confirmKey: string;
  icon: LucideIcon;
  className: string;
}[];

// 503 — ma'lumotnoma PDF yaratilmadi, status ham saqlanmadi (qayta urinish mumkin)
const SERVICE_UNAVAILABLE = 503;

type ReviewActionsPanelProps = {
  certificate: CertificateDetail;
  onStatusUpdated: (code: ReviewStatusCode) => void;
  /** Berilsa — "Avtomatik rejim" (status qo'yilgach keyingi arizaga o'tish) sozlamasi ko'rsatiladi */
  autoNext?: { value: boolean; onChange: (value: boolean) => void };
};

/**
 * "Tekshirish holati" kartochkasi: bosqichlar, avtomatik rejim va status tugmalari.
 * Tugma bosilganda darhol yuborilmaydi — tasdiqlash (va kerak bo'lsa sabab tanlash) bloki ochiladi.
 * Boshqa arizaga o'tilganda holat tozalanishi uchun chaqiruvchi `key={certificate.id}` beradi.
 */
export function ReviewActionsPanel({
  certificate,
  onStatusUpdated,
  autoNext,
}: ReviewActionsPanelProps) {
  const { t } = useTranslation();
  const { statuses } = useReviewStatuses();
  const { smsMessages } = useSmsMessages();
  const { updateStatus, isPending } = useUpdateCertificateStatus();
  const [selectedCode, setSelectedCode] = useState<ReviewStatusCode | null>(
    null,
  );
  const [smsMessageId, setSmsMessageId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isAutoModeOpen, setIsAutoModeOpen] = useState(false);

  console.log(certificate);

  const isPaid = isCertificatePaid(certificate);
  const currentCode = getStatusCode(certificate);
  const selectedAction = ACTIONS.find((action) => action.code === selectedCode);

  const selectAction = (code: ReviewStatusCode) => {
    setSelectedCode(code);
    setSmsMessageId("");
    setError(null);
    setIsSaved(false);
  };

  const submit = async () => {
    if (!selectedCode) return;

    const statusId = findStatusId(statuses, selectedCode);
    if (statusId === null) {
      setError(t("dashboard.review.actions.statusMissing"));
      return;
    }

    const needsSmsMessage = requiresSmsMessage(selectedCode);
    if (needsSmsMessage && !smsMessageId) {
      setError(t("dashboard.review.actions.reasonRequired"));
      return;
    }

    setError(null);
    try {
      await updateStatus({
        certificate: certificate.id,
        status: statusId,
        ...(needsSmsMessage && { sms_message: Number(smsMessageId) }),
      });
      setSelectedCode(null);
      setIsSaved(true);
      onStatusUpdated(selectedCode);
    } catch (updateError) {
      setError(
        getHttpStatus(updateError) === SERVICE_UNAVAILABLE
          ? t("dashboard.review.actions.serviceError")
          : getApiErrorMessage(
              updateError,
              t("dashboard.review.actions.error"),
            ),
      );
    }
  };

  return (
    <section className="bg-surface shadow-card border-line rounded-2xl border p-5 sm:p-6">
      <h2 className="text-heading text-[18px] font-bold tracking-tight">
        {t("dashboard.review.actions.title")}
      </h2>

      <div className="border-line mt-4 border-b pb-5">
        <ReviewStepper currentStep={getReviewStep(certificate)} />
      </div>

      {autoNext && (
        <div className="border-line mt-5 overflow-hidden rounded-xl border">
          <button
            type="button"
            aria-expanded={isAutoModeOpen}
            onClick={() => setIsAutoModeOpen((prev) => !prev)}
            className="hover:bg-surface-sky flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
          >
            <Settings
              className="text-body size-4.5 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-heading min-w-0 flex-1 text-[14px] font-semibold">
              {t("dashboard.review.actions.autoMode")}
            </span>
            {autoNext.value && (
              <span className="bg-primary-soft text-primary rounded-full px-2.5 py-0.5 text-[12px] font-semibold">
                {t("dashboard.review.actions.autoModeOn")}
              </span>
            )}
            <ChevronDown
              className={cn(
                "text-body size-4.5 shrink-0 transition-transform",
                isAutoModeOpen && "rotate-180",
              )}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
          {isAutoModeOpen && (
            <label className="border-line flex cursor-pointer items-start gap-3 border-t px-4 py-3">
              <input
                type="checkbox"
                checked={autoNext.value}
                onChange={(event) => autoNext.onChange(event.target.checked)}
                className="accent-primary mt-0.5 size-4 shrink-0"
              />
              <span className="text-body text-[13.5px]">
                {t("dashboard.review.actions.autoNext")}
              </span>
            </label>
          )}
        </div>
      )}

      {!isPaid && (
        <p className="bg-gold/15 text-heading mt-5 rounded-xl px-4 py-3 text-[13.5px]">
          {t("dashboard.review.actions.unpaid")}
        </p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const isSelected = action.code === selectedCode;

          return (
            <button
              key={action.code}
              type="button"
              aria-pressed={isSelected}
              // Backend oxirgi status bilan bir xil statusni qayta qo'yishga ruxsat bermaydi
              disabled={!isPaid || isPending || action.code === currentCode}
              onClick={() => selectAction(action.code)}
              className={cn(
                "ring-offset-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-[14px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
                action.className,
                isSelected && "ring-heading/40 ring-2 ring-offset-2",
              )}
            >
              <Icon
                className="size-4.5 shrink-0"
                strokeWidth={2.2}
                aria-hidden="true"
              />
              {t(action.labelKey)}
            </button>
          );
        })}
      </div>

      {selectedAction && (
        <div className="bg-surface-sky border-line mt-4 rounded-2xl border p-4 sm:p-5">
          <p className="text-heading text-[14px] font-semibold">
            {t(selectedAction.confirmKey)}
          </p>

          {requiresSmsMessage(selectedAction.code) && (
            <SelectField
              className="mt-4"
              label={t("dashboard.review.actions.reason")}
              placeholder={t("dashboard.review.actions.reasonPlaceholder")}
              options={smsMessages.map((message) => ({
                value: String(message.id),
                label: message.name,
              }))}
              value={smsMessageId}
              onChange={(value) => {
                setSmsMessageId(value);
                setError(null);
              }}
            />
          )}

          {error && (
            <p
              role="alert"
              className="text-danger mt-3 text-[13px] font-medium"
            >
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => setSelectedCode(null)}
            >
              {t("dashboard.review.actions.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={submit}
            >
              {isPending && (
                <LoaderCircle
                  className="size-4 shrink-0 animate-spin"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              )}
              {t("dashboard.review.actions.confirm")}
            </Button>
          </div>
        </div>
      )}

      {isSaved && !selectedAction && (
        <p
          role="status"
          className="text-primary mt-4 text-[13.5px] font-semibold"
        >
          {t("dashboard.review.actions.success")}
        </p>
      )}
    </section>
  );
}
