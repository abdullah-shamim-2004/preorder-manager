"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

// Interface of preorderform data
export interface PreorderFormData {
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string;
  status: boolean;
}

interface PreorderFormProps {
  mode: "create" | "update";
  initialData?: PreorderFormData & { id: string };
}

// default value for create mode
const defaultValues: PreorderFormData = {
  name: "",
  products: 1,
  preorderWhen: "REGARDLESS_OF_STOCK",
  startsAt: "",
  endsAt: "",
  status: true,
};

export default function PreorderForm({ mode, initialData }: PreorderFormProps) {
  const router = useRouter();
  const isUpdate = mode === "update";

  const [form, setForm] = useState<PreorderFormData>({
    name: initialData?.name ?? defaultValues.name,
    products: initialData?.products ?? defaultValues.products,
    preorderWhen: initialData?.preorderWhen ?? defaultValues.preorderWhen,
    startsAt: initialData?.startsAt ?? defaultValues.startsAt,
    endsAt: initialData?.endsAt ?? defaultValues.endsAt,
    status: initialData?.status ?? defaultValues.status,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PreorderFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!form.startsAt) {
      newErrors.startsAt = "Start date is required.";
    }
    if (form.endsAt && form.startsAt && form.endsAt <= form.startsAt) {
      newErrors.endsAt = "End date must be after start date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit create form or update the form

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      };

      const url = isUpdate
        ? `/api/preorders/${initialData!.id}`
        : `/api/preorders`;

      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Something went wrong");
      }

      toast.success(isUpdate ? "Preorder updated!" : "Preorder created!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const update = <K extends keyof PreorderFormData>(
    key: K,
    value: PreorderFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-white"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdate ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Card header */}
          <div className="px-8 py-5 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              {isUpdate ? "Update Preorder" : "Create Preorder"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              These values appear in the preorders{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => router.push("/preorders")}
              >
                list
              </span>
              .
            </p>
          </div>

          {/* Fields */}
          <div className="divide-y divide-gray-200">
            {/* Name */}
            <div className="px-8 py-6 grid grid-cols-2 gap-8 items-start">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  A label to recognize this preorder by.
                </p>
              </div>
              <div>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Multi variant 3"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="px-8 py-6 grid grid-cols-2 gap-8 items-start">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Products
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Number of products covered by this preorder.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  value={form.products}
                  onChange={(e) => update("products", Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">product(s)</span>
              </div>
            </div>

            {/* Preorder when */}
            <div className="px-8 py-6 grid grid-cols-2 gap-8 items-start">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Preorder when
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  When customers are allowed to preorder.
                </p>
              </div>
              <div>
                <Select
                  value={form.preorderWhen}
                  onValueChange={(val) => update("preorderWhen", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REGARDLESS_OF_STOCK">
                      regardless-of-stock
                    </SelectItem>
                    <SelectItem value="WHEN_OUT_OF_STOCK">
                      when-out-of-stock
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Starts at */}
            <div className="px-8 py-6 grid grid-cols-2 gap-8 items-start">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Starts at <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  When the preorder window opens.
                </p>
              </div>
              <div>
                <Input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => update("startsAt", e.target.value)}
                  className={errors.startsAt ? "border-red-500" : ""}
                />
                {errors.startsAt && (
                  <p className="text-xs text-red-500 mt-1">{errors.startsAt}</p>
                )}
              </div>
            </div>

            {/* Ends at */}
            <div className="px-8 py-6 grid grid-cols-2 gap-8 items-start">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Ends at
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty for no end date.
                </p>
              </div>
              <div>
                <Input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => update("endsAt", e.target.value)}
                  className={errors.endsAt ? "border-red-500" : ""}
                />
                {errors.endsAt && (
                  <p className="text-xs text-red-500 mt-1">{errors.endsAt}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="px-8 py-6 grid grid-cols-2 gap-8 items-start">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Status
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Active preorders are visible to customers.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Switch
                  checked={form.status}
                  onCheckedChange={(val) => update("status", val)}
                />
                <span className="text-sm text-gray-700">
                  {form.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdate ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
