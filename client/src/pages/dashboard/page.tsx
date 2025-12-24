import PageHeader from "@/components/ui/PageHeader";
import DashboardStats from "./components/dashboard-stats";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Dashboard"
        description="Resumen de la actividad del gimnasio"
        buttonProps={[]}
      />
      <DashboardStats />
    </div>
  );
}
