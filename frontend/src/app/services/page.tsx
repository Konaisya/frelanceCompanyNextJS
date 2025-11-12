import ServicesList from "@/components/ui/services/ServicesList"


export const metadata = {
  title: 'Услуги фрилансеров | FreelanceHub',
  description: 'Просматривайте услуги, предлагаемые фрилансерами на FreelanceHub',
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-32 bg-[var(--background)] text-[var(--foreground)]">
      <ServicesList />
    </main>
  )
}
