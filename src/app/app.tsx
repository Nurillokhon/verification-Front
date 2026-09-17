import { AntdProvider, I18nProvider, QueryProvider, RouterProvider, ThemeProvider } from './providers'
import './styles/index.css'

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AntdProvider>
          <QueryProvider>
            <RouterProvider />
          </QueryProvider>
        </AntdProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
