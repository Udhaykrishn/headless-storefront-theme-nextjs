"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { deleteCustomerAddress } from "@/app/actions/customer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddressDeleteButton({ addressId }: { addressId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    startTransition(async () => {
      const result = await deleteCustomerAddress(addressId);
      if (result.success) {
        toast.success("Address deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete address");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      title="Delete address"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
