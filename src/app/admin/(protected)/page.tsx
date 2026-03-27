import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Home, MessageSquare, CalendarCheck } from "lucide-react";

async function getDashboardData() {
  const admin = createAdminClient();

  const [propertiesResult, pendingResult, checkInsResult, recentResult] = await Promise.all([
    admin
      .from("properties")
      .select("id", { count: "exact" })
      .eq("is_active", true),
    admin
      .from("booking_requests")
      .select("id", { count: "exact" })
      .eq("status", "pending"),
    admin
      .from("booking_requests")
      .select("id", { count: "exact" })
      .eq("status", "confirmed")
      .gte("check_in", new Date().toISOString().split("T")[0]),
    admin
      .from("booking_requests")
      .select("*, properties(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    activeProperties: propertiesResult.count ?? 0,
    pendingRequests: pendingResult.count ?? 0,
    upcomingCheckIns: checkInsResult.count ?? 0,
    recentRequests: recentResult.data ?? [],
  };
}

function statusLabel(status: string | null) {
  switch (status) {
    case "pending":
      return { label: "In attesa", variant: "secondary" as const };
    case "confirmed":
      return { label: "Confermata", variant: "default" as const };
    case "cancelled":
      return { label: "Annullata", variant: "destructive" as const };
    default:
      return { label: status ?? "—", variant: "outline" as const };
  }
}

export default async function AdminDashboard() {
  const { activeProperties, pendingRequests, upcomingCheckIns, recentRequests } =
    await getDashboardData();

  const stats = [
    {
      title: "Proprietà Attive",
      value: activeProperties,
      icon: Home,
      color: "text-[#4A90A4]",
      bg: "bg-[#4A90A4]/10",
    },
    {
      title: "Richieste Pendenti",
      value: pendingRequests,
      icon: MessageSquare,
      color: "text-[#C2714F]",
      bg: "bg-[#C2714F]/10",
    },
    {
      title: "Prossimi Check-in",
      value: upcomingCheckIns,
      icon: CalendarCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-[#2D3436]">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Panoramica delle attività di Versilia Homes
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border border-[#E8DCC8]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-semibold text-[#2D3436]">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Requests */}
      <Card className="border border-[#E8DCC8]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#2D3436]">
            Richieste Recenti
          </CardTitle>
          <Link
            href="/admin/requests"
            className="text-sm text-[#4A90A4] hover:underline"
          >
            Vedi tutte
          </Link>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              Nessuna richiesta di prenotazione ancora.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DCC8]">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Ospite</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Proprietà</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Check-in</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Check-out</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => {
                    const status = statusLabel(req.status);
                    return (
                      <tr key={req.id} className="border-b border-[#E8DCC8] last:border-0">
                        <td className="py-3 px-2 font-medium text-[#2D3436]">
                          {req.guest_name}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {(req.properties as { title: string } | null)?.title ?? "—"}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(req.check_in).toLocaleDateString("it-IT")}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(req.check_out).toLocaleDateString("it-IT")}
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
