import { useSearchParams, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
} from "lucide-react";

import { useDeleteMembership } from "@/features/memberships/mutations";
import { getMemberships } from "@/features/memberships/requests";
import { Button } from "@/components/ui/button";

export default function MembershipsListingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const CURRENT_PAGE = parseInt(searchParams.get("page") || "1");
  const PAGE_SIZE = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";

  const request = {
    filters: { search },
    page: CURRENT_PAGE,
    pageSize: PAGE_SIZE,
  };

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["memberships", request],
    queryFn: () => getMemberships(request),
    placeholderData: keepPreviousData,
  });

  const records = response?.records ?? [];
  const totalRecords = response?.totalRecords ?? 0;
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const handleSearch = (term: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (term) newParams.set("search", term);
      else newParams.delete("search");
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  const { mutate: deleteMembership, isPending: isDeleting } =
    useDeleteMembership();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta membresía?")) {
      deleteMembership({ id });
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <p>Ocurrió un error al cargar las membresías.</p>
        <Button variant="link" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Card className="border-border/60 shadow-sm flex flex-col flex-1 min-h-0">
        <CardHeader>
          {/* BARRA DE FILTROS */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, documento o plan..."
                className="pl-9 bg-muted/20"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="text-xs text-muted-foreground hidden sm:block">
              <strong>{totalRecords}</strong> registros encontrados
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-auto relative">
          {isLoading ? (
            <MembershipsTableSkeleton />
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">
                No se encontraron membresías
              </h3>
              <p className="text-sm max-w-xs mx-auto mt-1">
                No hay resultados para tu búsqueda o aún no has registrado
                membresías.
              </p>
              {search && (
                <Button
                  variant="link"
                  onClick={() => handleSearch("")}
                  className="mt-2"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="w-12.5 text-center">#</TableHead>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((membership, index) => {
                  const memberName = membership.member
                    ? `${membership.member.firstName} ${membership.member.lastName}`
                    : "Desconocido";

                  const planName = membership.plan?.name || "Sin Plan";

                  return (
                    <TableRow
                      key={membership.id}
                      className="hover:bg-muted/5 group"
                    >
                      <TableCell className="text-center text-muted-foreground text-xs">
                        {(CURRENT_PAGE - 1) * PAGE_SIZE + index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {memberName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {membership.member?.docNumber}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal text-xs"
                        >
                          {planName}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span className="text-muted-foreground">
                            Inicio:{" "}
                            <span className="text-foreground">
                              {format(
                                new Date(membership.startDate),
                                "dd/MM/yyyy"
                              )}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            Fin:{" "}
                            <span className="text-foreground">
                              {format(
                                new Date(membership.endDate),
                                "dd/MM/yyyy"
                              )}
                            </span>
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            membership.status === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                          className={`text-[10px] px-2 py-0.5 ${
                            membership.status === "ACTIVE"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                          }`}
                        >
                          {membership.status === "ACTIVE"
                            ? "ACTIVO"
                            : "INACTIVO"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => navigate(`${membership.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> Ver detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`${membership.id}/editar`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(membership.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {/* FOOTER: PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 px-4 py-2 border-t mt-auto">
            <div className="flex-1 text-sm text-muted-foreground">
              Página {CURRENT_PAGE} de {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, CURRENT_PAGE - 1))}
                disabled={CURRENT_PAGE <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(CURRENT_PAGE + 1)}
                disabled={!response?.hasNext}
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function MembershipsTableSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Header row simulation */}
        <div className="flex items-center justify-between pb-4 border-b">
          <Skeleton className="h-6 w-50" />
          <Skeleton className="h-6 w-25" />
        </div>
        {/* Rows simulation */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-12 hidden sm:block" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
