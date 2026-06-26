"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// import PreorderActions from "./preorder-actions";
import type { Preorder, FilterTab, SortField, SortOrder } from "./types";
import { Switch } from "../ui/switch";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPreorderWhen(val: string) {
  return val === "REGARDLESS_OF_STOCK" ? "regardless-of-stock" : "out-of-stock";
}

const PAGE_SIZE = 8;

export default function PreorderList({
  initialData,
}: {
  initialData: Preorder[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<FilterTab>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = initialData.filter((p) => {
    if (tab === "active") return p.status;
    if (tab === "inactive") return !p.status;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av = "",
      bv = "";
    if (sortField === "name") {
      av = a.name;
      bv = b.name;
    } else if (sortField === "createdAt") {
      av = a.id;
      bv = b.id;
    } else if (sortField === "startsAt") {
      av = a.startsAt;
      bv = b.startsAt;
    } else if (sortField === "endsAt") {
      av = a.endsAt ?? "";
      bv = b.endsAt ?? "";
    }
    if (av < bv) return sortOrder === "asc" ? -1 : 1;
    if (av > bv) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected =
    paged.length > 0 && paged.every((p) => selected.has(p.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) paged.forEach((p) => next.delete(p.id));
    else paged.forEach((p) => next.add(p.id));
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Preorders</h1>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => router.push("/dashboard/preorderForm")}
          >
            Create Preorder
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {/* Tabs + Sort */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-200">
            <div className="flex gap-1">
              {(["all", "active", "inactive"] as FilterTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setPage(1);
                    setSelected(new Set());
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                    tab === t
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Sort by
                </p>
                <RadioGroup
                  value={sortField}
                  onValueChange={(v) => setSortField(v as SortField)}
                  className="space-y-1.5 mb-4"
                >
                  {[
                    { value: "name", label: "Name" },
                    { value: "createdAt", label: "Created At" },
                    { value: "startsAt", label: "Starts At" },
                    { value: "endsAt", label: "Ends At" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label
                        htmlFor={opt.value}
                        className="text-sm cursor-pointer"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setSortOrder("asc")}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm ${sortOrder === "asc" ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" /> Ascending
                  </button>
                  <button
                    onClick={() => setSortOrder("desc")}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm ${sortOrder === "desc" ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" /> Descending
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-10 px-4 py-3 text-left">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Products
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Preorder when
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Starts at
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Ends at
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="w-36 px-4 py-3" >Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selected.has(p.id)}
                      onCheckedChange={() => toggleOne(p.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.products}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatPreorderWhen(p.preorderWhen)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(p.startsAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(p.endsAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                  <Switch checked={p.status} className="data-[state=checked]:bg-black!"/>
                  </td>
                  <td className="px-4 py-3">
                    {/* <PreorderActions id={p.id} status={p.status} /> */}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-400 text-sm"
                  >
                    No preorders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 px-4 py-4 border-t border-gray-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 font-medium">
              {total === 0
                ? "No results"
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || total === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
