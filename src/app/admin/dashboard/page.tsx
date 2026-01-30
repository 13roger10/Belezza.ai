"use client";

import { AdminLayout } from "@/components/layout";
import { ImagePlus, FileText, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Posts Criados",
    value: "0",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    label: "Agendados",
    value: "0",
    icon: Calendar,
    color: "bg-amber-500",
  },
  {
    label: "Publicados",
    value: "0",
    icon: TrendingUp,
    color: "bg-green-500",
  },
];

const quickActions = [
  {
    label: "Criar Novo Post",
    description: "Crie um post com ajuda da IA",
    href: "/admin/posts/create",
    icon: ImagePlus,
    color: "bg-violet-500",
  },
  {
    label: "Ver Meus Posts",
    description: "Visualize e edite seus posts",
    href: "/admin/posts",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    label: "Agendamentos",
    description: "Gerencie publicações agendadas",
    href: "/admin/schedule",
    icon: Calendar,
    color: "bg-amber-500",
  },
];

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Boas-vindas */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Bem-vindo ao Social Studio IA!</h2>
          <p className="mt-2 text-violet-100">
            Crie posts incríveis para suas redes sociais com ajuda da
            Inteligência Artificial.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Ações Rápidas
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-violet-600">
                    {action.label}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dica */}
        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
          <p className="text-sm text-violet-700">
            <strong>Dica:</strong> Conecte suas contas do Instagram e Facebook
            nas configurações para começar a publicar diretamente.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
