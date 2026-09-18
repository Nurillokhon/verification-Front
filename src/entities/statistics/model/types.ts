/** GET /main/admin-statistics/ — oxirgi 12 oyning bitta oyi */
export type MonthlyStat = {
  /** "YYYY-MM" — oy nomi interfeys tilida shundan hosil qilinadi */
  month: string
  /** Ingliz tilida keladi, UI'da ishlatilmaydi */
  month_name: string
  count: number
}

/** GET /main/admin-statistics/ (faqat admin) */
export type AdminStatistics = {
  all_candidates: number
  all_certificates: number
  paid_certificates: number
  /** Formatlangan matn ("13,300,000") — son emas, hisob-kitobda ishlatilmaydi */
  paid_summ: string
  monthly_stats: MonthlyStat[]
}
