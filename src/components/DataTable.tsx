import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type PaginationState,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ExternalLink, FileText } from 'lucide-react';
import type { CertificationRecord } from '@/types';

interface DataTableProps {
  data: CertificationRecord[];
  onEdit: (record: CertificationRecord) => void;
  onDelete: (id: string) => void;
  getBudget?: (record: CertificationRecord) => number;
  canEdit?: boolean;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  ACTIVE: { label: 'Aktif', bg: 'bg-[#4A7C59]/10', text: 'text-[#4A7C59]', dot: 'bg-[#4A7C59]' },
  EXPIRING_SOON: { label: 'Akan Expired', bg: 'bg-[#E09F3E]/10', text: 'text-[#E09F3E]', dot: 'bg-[#E09F3E]' },
  EXPIRED: { label: 'Expired', bg: 'bg-[#B84A3E]/10', text: 'text-[#B84A3E]', dot: 'bg-[#B84A3E]' },
  BELUM_SERTIFIKASI: { label: 'Belum Sertifikasi', bg: 'bg-[#8A938B]/10', text: 'text-[#8A938B]', dot: 'bg-[#8A938B]' },
};

function formatRupiah(amount: number): string {
  if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)} M`;
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ name, className = '' }: { name: string; className?: string }) {
  return (
    <div
      className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export function DataTable({ data, onEdit, onDelete, getBudget, canEdit = true }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<CertificationRecord>[]>(
    () => [
      {
        accessorKey: 'nama',
        header: 'NAMA / NIK',
        size: 200,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.nama} />
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-[#2C3531] truncate">{row.original.nama}</div>
              <div className="text-[11px] text-[#8A938B]">{row.original.nik}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'jabatan',
        header: 'JABATAN',
        size: 160,
        cell: ({ row }) => (
          <span className="text-[12px] text-[#566A7F] truncate block">{row.original.jabatan}</span>
        ),
      },
      {
        accessorKey: 'lokasi',
        header: 'LOKASI',
        size: 70,
        cell: ({ row }) => (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0F4F1] text-[#566A7F]">
            {row.original.lokasi}
          </span>
        ),
      },
      {
        accessorKey: 'pt',
        header: 'PT',
        size: 90,
        cell: ({ row }) => (
          <span className="text-[12px] text-[#566A7F] truncate block">{row.original.pt}</span>
        ),
      },
      {
        accessorKey: 'region',
        header: 'REGION',
        size: 90,
        cell: ({ row }) => (
          <span className="text-[12px] text-[#566A7F]">{row.original.region}</span>
        ),
      },
      {
        accessorKey: 'sertifikasi',
        header: 'SERTIFIKASI',
        size: 220,
        cell: ({ row }) => (
          <span className="text-[11px] text-[#566A7F] truncate block" title={row.original.sertifikasi}>
            {row.original.sertifikasi.replace('SERTIFIKASI - ', '')}
          </span>
        ),
      },
      {
        accessorKey: 'computed_status',
        header: 'STATUS',
        size: 120,
        cell: ({ row }) => {
          const config = statusConfig[row.original.computed_status] || statusConfig.BELUM_SERTIFIKASI;
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${config.bg} ${config.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          );
        },
      },
      ...(getBudget
        ? [
            {
              accessorKey: 'budget',
              header: 'BUDGET',
              size: 90,
              cell: ({ row }: { row: { original: CertificationRecord } }) => {
                const budget = getBudget(row.original);
                return (
                  <span className="text-[12px] font-medium text-[#2C3531]">
                    {formatRupiah(budget)}
                  </span>
                );
              },
            },
          ]
        : []),
      {
        accessorKey: 'link_sertifikat',
        header: 'LINK',
        size: 80,
        cell: ({ row }) => {
          const link = row.original.link_sertifikat;
          if (link && link.startsWith('http')) {
            return (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-[#3D6B56]/10 text-[#3D6B56] hover:bg-[#3D6B56]/20 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Buka
              </a>
            );
          }
          if (row.original.no_sertifikat) {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-[#F0F4F1] text-[#8A938B]">
                <FileText className="w-3 h-3" />
                {row.original.no_sertifikat.slice(0, 12)}...
              </span>
            );
          }
          return (
            <span className="text-[11px] text-[#8A938B]">—</span>
          );
        },
      },
      ...(canEdit ? [{
        id: 'actions',
        header: '',
        size: 70,
        cell: ({ row }: { row: { original: CertificationRecord } }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(row.original)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A938B] hover:text-[#3D6B56] hover:bg-[#3D6B56]/10 transition-all"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(row.original.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A938B] hover:text-[#B84A3E] hover:bg-[#B84A3E]/10 transition-all"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      }] : []),
    ],
    [onEdit, onDelete, getBudget, canEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="bg-white rounded-xl shadow-[0px_4px_24px_rgba(60,107,86,0.06)] overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-[#E0E8E3] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A938B]" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Cari nama atau NIK peserta..."
            className="w-full h-9 pl-10 pr-4 rounded-lg border border-[#E0E8E3] bg-[#F0F4F1] text-[13px] text-[#2C3531] placeholder:text-[#8A938B] focus:outline-none focus:border-[#3D6B56] focus:ring-2 focus:ring-[#3D6B56]/20 transition-all"
          />
        </div>
        <div className="flex-1" />
        <span className="text-[12px] text-[#8A938B]">
          Menampilkan {totalRows ? pageIndex * pagination.pageSize + 1 : 0}–{Math.min((pageIndex + 1) * pagination.pageSize, totalRows)} dari {totalRows} data
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[#F0F4F1]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase tracking-wider cursor-pointer select-none hover:text-[#2C3531] transition-colors"
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <span className="text-[10px]">↑</span>}
                      {header.column.getIsSorted() === 'desc' && <span className="text-[10px]">↓</span>}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#E0E8E3]/50 hover:bg-[#F0F4F1]/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[13px] text-[#8A938B]">
                  Tidak ada data yang sesuai dengan filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-[#E0E8E3] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#8A938B]">Tampilkan</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 px-2 rounded-lg border border-[#E0E8E3] bg-white text-[12px] text-[#2C3531] focus:outline-none focus:border-[#3D6B56]"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
            let pageNum: number;
            if (pageCount <= 5) {
              pageNum = i;
            } else if (pageIndex < 2) {
              pageNum = i;
            } else if (pageIndex > pageCount - 3) {
              pageNum = pageCount - 5 + i;
            } else {
              pageNum = pageIndex - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => table.setPageIndex(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-medium transition-colors ${
                  pageIndex === pageNum
                    ? 'bg-[#3D6B56] text-white'
                    : 'text-[#566A7F] hover:bg-[#F0F4F1]'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
