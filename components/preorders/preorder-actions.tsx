import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type props = {
  id: string;
  status: boolean;
};
const PreorderActions = ({ id, status }: props) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/dashboard/preorderForm?id=${id}`)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        // onClick={handleDelete}
        // disabled={loadingDelete}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PreorderActions;
