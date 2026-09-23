import { I18nProvider, QueryProvider, RouterProvider, ThemeProvider } from './providers'
import './styles/index.css'

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryProvider>
          <RouterProvider />
        </QueryProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
