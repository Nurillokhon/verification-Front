import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { SEARCH_DEBOUNCE_MS } from '@/shared/config'
import { useDebouncedValue } from '@/shared/lib/debounce'

/**
 * Ro'yxat sahifalarining holati (sahifa raqami, qidiruv, filtrlar) URL'da
 * saqlanadi — detal sahifasidan "ortga" qaytilganda joy yo'qolmaydi va havolani
 * ulashish mumkin. Input esa darhol yangilanadi, so'rov faqat yozish
 * tugagandan keyin ketadi.
 */
export function useUrlSearchState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const query = searchParams.get('q') ?? ''
  const [searchInput, setSearchInput] = useState(query)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    if (debouncedSearch === query) return

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debouncedSearch) next.set('q', debouncedSearch)
        else next.delete('q')
        // Yangi qidiruv natijalari birinchi sahifadan boshlanadi
        next.delete('page')
        return next
      },
      { replace: true },
    )
  }, [debouncedSearch, query, setSearchParams])

  /**
   * Filtr parametrini yozadi; `null` — parametrni o'chiradi (standart holat).
   * Sahifa raqami har doim tashlab yuboriladi: yangi filtr natijalari
   * birinchi sahifadan boshlanadi.
   */
  const setParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === null) next.delete(key)
        else next.set(key, value)
        next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  // Sahifa almashganda history'ga yozamiz (replace emas) — "ortga" tugmasi
  // oldingi sahifaga qaytaradi.
  const goToPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(nextPage))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { page, query, searchInput, setSearchInput, setParam, goToPage, searchParams }
}
