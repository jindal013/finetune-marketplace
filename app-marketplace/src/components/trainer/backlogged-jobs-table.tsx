"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type BackloggedJob = {
  _id: string
  name: string
  status: "Queued" | "Training" | "Done"
  date: string
  firebasePath: string
}

interface BackloggedJobsTableProps {
  data: BackloggedJob[]
  variant?: 'client' | 'trainer'
}
function floatToDateTime(timestamp: number): string {
  const date = new Date(Math.floor(timestamp)); // Convert to milliseconds and create Date object
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

export function BackloggedJobsTable({ data, variant = 'trainer' }: BackloggedJobsTableProps) {
  const updateStatus = useMutation(api.tasks.updateJob);
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  async function sendPostRequest(id: string, firebasePath: string): Promise<void> {
    try {
      await updateStatus({
        id: id as Id<"tasks">,
        status: "training"
      });

      const response = await fetch('http://127.0.0.1:4200/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ "firebase_path": firebasePath, "id": id}),
      });

      if (!response.ok) {

        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const data = await response.json();
      console.log('Training started:', data);
      await updateStatus({
        id: id as Id<"tasks">,
        status: "done"
      });

    } catch (error) {
      console.error('Error starting training:', error);
      throw error;
    }
  }

  const baseColumns: ColumnDef<BackloggedJob>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push(`/${variant}/jobs/${row.original._id}`)}
          >
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusUpper = status.charAt(0).toUpperCase() + status.slice(1);
        const variant = status === "Queued" ? "outline" :
                       status === "Training" ? "secondary" : "default";
        return <Badge variant={variant}>{statusUpper}</Badge>;
      },
    },
    {
      accessorKey: "_creationTime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("_creationTime") as number;
        return <span>{floatToDateTime(date)}</span>;
      },
    },
  ]

  const actionColumn: ColumnDef<BackloggedJob> = {
    accessorKey: "firebasePath",
    header: "Actions",
    cell: ({ row }) => {
      const firebasePath = row.getValue("firebasePath") as string;
      const id = row.original._id;
      const status = row.getValue("status") as string;
      if (status.toLowerCase() === "queued") {
        return (
          <Button
            size="sm"
            style={{ cursor: 'pointer' }}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                console.log("Starting training for job:", id);
                console.log("Firebase path:", firebasePath);
                await sendPostRequest(id, firebasePath);
              } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                alert("Failed to start training: " + errorMessage);
              }
            }}
          >
            Start Training
          </Button>
        );
      }
      return null;
    },
  }

  const columns = variant === 'trainer' ? [...baseColumns, actionColumn] : baseColumns;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-foreground/80">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="transition-colors hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}