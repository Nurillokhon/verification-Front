import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Jadval katakchalari — barcha ro'yxatlarda bir xil ichki bo'shliq va ritm.
 * Rang `text-body`: body'ning o'zida ham shu rang, shuning uchun ichida badge
 * yoki havola bo'lgan katakchalarda hech narsa o'zgarmaydi.
 */
export function Th({ className, ...props }: ComponentPropsWithoutRef<'th'>) {
  return <th scope="col" className={cn('px-5 py-3.5 font-bold', className)} {...props} />
}

export function Td({ className, ...props }: ComponentPropsWithoutRef<'td'>) {
  return <td className={cn('text-body px-5 py-4', className)} {...props} />
}

/** Jadval sarlavhasi qatori: <thead> ichidagi <tr>. */
export function TableHeadRow({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return (
    <tr
      className={cn(
        'border-line text-neutral border-b text-[12px] tracking-wide uppercase',
        className,
      )}
      {...props}
    />
  )
}

/** Jadval qatori: hover'da yoritiladi. */
export function TableRow({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return <tr className={cn('hover:bg-surface-sky transition-colors', className)} {...props} />
}
