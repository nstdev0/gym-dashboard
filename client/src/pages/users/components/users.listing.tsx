import { useSearchParams, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Shield,
  Eye,
} from "lucide-react";

import { useDeleteUser } from "@/features/users/mutations";
import { getUsers } from "@/features/users/requests";
import type { User } from "../../../../../server/src/domain/entities/user";
import { type ApiResponse } from "../../../../../server/src/types/api";
import { type IPageableResult } from "../../../../../server/src/application/common/pagination";

export default function UsersListingPage() {
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
  } = useQuery<ApiResponse<IPageableResult<User>>>({
    queryKey: ["users", request],
    queryFn: () => getUsers(request),
    placeholderData: keepPreviousData,
  });

  const result = response?.data;
  const records = result?.records ?? [];
  const totalRecords = result?.totalRecords ?? 0;
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

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      deleteUser({ id });
    }
  };

  const getInitials = (first: string, last?: string | null) => {
    return `${first.charAt(0)}${last ? last.charAt(0) : ""}`.toUpperCase();
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <p>Ocurrió un error al cargar los usuarios.</p>
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
                placeholder="Buscar por nombre o email..."
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
            <UsersTableSkeleton />
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">
                No se encontraron usuarios
              </h3>
              <p className="text-sm max-w-xs mx-auto mt-1">
                No hay resultados para tu búsqueda o aún no has creado usuarios.
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
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((user, index) => (
                  <TableRow key={user.id} className="hover:bg-muted/5 group">
                    <TableCell className="text-center text-muted-foreground text-xs">
                      {(CURRENT_PAGE - 1) * PAGE_SIZE + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="text-xs bg-primary/5 text-primary font-medium">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            @{user.username || "-"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-normal text-xs uppercase bg-secondary/50"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className={`text-[10px] px-2 py-0.5 ${
                          user.isActive
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        }`}
                      >
                        {user.isActive ? "ACTIVO" : "INACTIVO"}
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
                            onClick={() => navigate(`${user.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`${user.id}/editar`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(user.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
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
                disabled={!result?.hasNext}
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

function UsersTableSkeleton() {
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
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
