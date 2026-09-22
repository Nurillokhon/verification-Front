/** @format */

import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ROUTES } from "@/shared/config";
import {
  BrandMark,
  BrandWordmark,
  buttonVariants,
  Container,
  LanguageSwitcher,
  ThemeSwitcher,
} from "@/shared/ui";

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    // bg-white/80 emas — bg-surface/80: dark rejimda --color-surface to'q bo'lgani
    // uchun shisha effekti (glass blur) ikkala mavzuda ham to'g'ri ishlaydi.
    <header className="border-line/60 bg-surface/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        {/* shrink-0 + whitespace-nowrap: brend nomi hech qachon ikki qatorga
            bo'linmasin — 375px'da nav siqilsa ham, siqilish yukini shu emas,
            nav o'zi ko'taradi (pastdagi responsive tor'lashtirishlar shu uchun). */}
        <Link
          to={ROUTES.home}
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
        >
          <BrandMark className="w-7 sm:w-8" />
          {/* Brend logotipi — tarjima qilinmaydi */}
          <BrandWordmark size="sm" className="sm:hidden" />
          <BrandWordmark size="md" className="max-sm:hidden" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          {/* Oddiy px-3 emas — max-sm:px-3: Button'ning size="sm" preset'i
              o'zi unprefixed px-4 beradi, va Tailwind unprefixed utilitalarni
              QIYMATI bo'yicha saralaydi (cn() esa dublikatlarni olib
              tashlamaydi) — shu sabab tekis px-3 stylesheet'da px-4'dan
              OLDIN kelib, hech qachon g'olib chiqmas edi (aynan shu muammo
              Container'ning px-6'sini yengishga urinishda ham chiqqan edi).
              max-sm: variant qatlami esa asosiy (unprefixed) utilitalardan
              KEYIN chiqariladi, shuning uchun max-sm:px-3 640px'dan pastda
              px-4'ni ishonchli yengadi; sm:px-5 esa 640px'dan yuqorida
              ikkalasini ham yengadi. */}
          <Link
            to={ROUTES.login}
            className={buttonVariants({
              size: "sm",
              className: "max-sm:px-3 sm:px-5",
            })}
          >
            {t("header.login")}
          </Link>
        </nav>
      </Container>
    </header>
  );
}
