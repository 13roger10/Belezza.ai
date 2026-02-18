"use client";

import { SalonLayout } from "@/components/layout/SalonLayout";
import { useSalonAuth, Can } from "@/contexts/SalonAuthContext";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Star,
  AlertCircle,
} from "lucide-react";

export default function SalonDashboardPage() {
  const { user } = useSalonAuth();

  // Mock data - em produção viria da API
  const stats = {
    todayAppointments: 12,
    pendingAppointments: 3,
    todayRevenue: 1850.00,
    newClients: 5,
    availableSlots: 8,
    averageRating: 4.8,
  };

  const upcomingAppointments = [
    { id: 1, client: "João Silva", service: "Corte Masculino", time: "09:00", professional: "Carlos Barbeiro", status: "confirmed" },
    { id: 2, client: "Maria Santos", service: "Coloração", time: "10:30", professional: "Ana Cabeleireira", status: "pending" },
    { id: 3, client: "Pedro Oliveira", service: "Barba", time: "11:00", professional: "Carlos Barbeiro", status: "confirmed" },
    { id: 4, client: "Lucia Costa", service: "Corte + Escova", time: "14:00", professional: "Juliana Cabeleireira", status: "confirmed" },
  ];

  const alerts = [
    { type: "warning", message: "3 clientes com aniversário esta semana" },
    { type: "info", message: "Estoque de pomada modeladora baixo" },
    { type: "success", message: "Meta mensal atingida: R$ 15.000" },
  ];

  return (
    <SalonLayout pageTitle="Dashboard" requiredPermissions="dashboard.view">
      <div className="space-y-6">
        {/* Welcome message */}
        <div className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold">
            Olá, {user?.name?.split(" ")[0] || "Usuário"}!
          </h2>
          <p className="mt-1 text-violet-100">
            Confira o resumo do seu dia e acompanhe o desempenho do salão.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Agendamentos Hoje */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Agendamentos Hoje
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.todayAppointments}
                </p>
                <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                  {stats.pendingAppointments} pendentes
                </p>
              </div>
              <div className="rounded-full bg-violet-100 p-3 dark:bg-violet-900/30">
                <Calendar className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </div>

          {/* Faturamento Hoje */}
          <Can permission="finance.view">
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Faturamento Hoje
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                    R$ {stats.todayRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    +12% vs ontem
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </Can>

          {/* Clientes Novos */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Clientes Novos (Mês)
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.newClients}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Este mês
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Horários Vagos */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Horários Vagos Hoje
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.availableSlots}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Disponíveis
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Próximos Agendamentos */}
          <div className="lg:col-span-2 rounded-lg border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="border-b p-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Próximos Agendamentos
              </h3>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                      {appointment.client.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {appointment.client}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {appointment.service} - {appointment.professional}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.time}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4 dark:border-gray-700">
              <a
                href="/salon/appointments"
                className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
              >
                Ver todos os agendamentos
              </a>
            </div>
          </div>

          {/* Alertas e Lembretes */}
          <div className="rounded-lg border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="border-b p-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Alertas e Lembretes
              </h3>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-4">
                  <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                    alert.type === "warning"
                      ? "text-yellow-500"
                      : alert.type === "success"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Avaliação média - visível apenas para admin */}
        <Can permission="dashboard.view_full">
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Avaliação Média do Salão
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Baseado nas avaliações dos clientes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.averageRating}
                </span>
              </div>
            </div>
          </div>
        </Can>
      </div>
    </SalonLayout>
  );
}
