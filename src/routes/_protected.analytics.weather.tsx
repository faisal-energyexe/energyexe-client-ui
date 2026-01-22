import { createFileRoute } from '@tanstack/react-router'
import { PortfolioWeatherPage } from '@/components/analytics/portfolio-weather-page'

export const Route = createFileRoute('/_protected/analytics/weather')({
  component: PortfolioWeatherPage,
})
