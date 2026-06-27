"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type props = {
  id: string;
};
const PreorderActions = ({ id }: props) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();
  
  // handle delate 
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this preorder?")) return;

    setLoadingDelete(true);
    try {
      const res = await fetch(`/api/preorders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Preorder deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete preorder");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/dashboard/preorderForm?id=${id}`)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={handleDelete}
        disabled={loadingDelete}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PreorderActions;
