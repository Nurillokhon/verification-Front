/** @format */

import { useQueryClient } from "@tanstack/react-query";
import {
  getCertificateEndpoint,
  invalidateCertificateQueries,
} from "@/entities/certificate";
import { useMutateRequest } from "@/shared/api";

const ENDPOINTS = {
  create: "/main/certificate-create/",
} as const;

/** swagger: CertificateBrief — yaratilgan arizaning qisqacha ma'lumoti */
export type CreatedCertificate = {
  id: number;
  number: string;
  language: number;
  type: number;
  degree: number;
  issue_date: string;
  exam_date: string | null;
  exam_place: string | null;
  file: string;
};

/**
 * POST /main/certificate-create/ javobi (swagger: CertificateResponse).
 * Bu endpoint to'lov YARATMAYDI — ariza `is_paid=false` holatda saqlanadi,
 * havola esa alohida `POST /main/payment-create/<id>/` dan olinadi.
 */
export type CertificateCreateResponse = {
  /** 1 — muvaffaqiyat */
  status: number;
  message: string;
  certificate: CreatedCertificate;
};

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutateRequest<
    CertificateCreateResponse,
    FormData
  >({
    onSuccess: () => invalidateCertificateQueries(queryClient),
  });

  const createCertificate = (data: FormData) =>
    mutateAsync({ url: ENDPOINTS.create, method: "POST", data });

  return { createCertificate, isPending };
}

/** Backend tahrirlashga faqat NEW yoki PROBLEM holatda ruxsat beradi. */
export function useUpdateCertificate(id: number) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutateRequest<unknown, FormData>({
    onSuccess: () => invalidateCertificateQueries(queryClient),
  });

  const updateCertificate = (data: FormData) =>
    mutateAsync({ url: getCertificateEndpoint(id), method: "PATCH", data });

  return { updateCertificate, isPending };
}
