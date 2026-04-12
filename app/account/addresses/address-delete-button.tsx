"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCustomerAddress } from "@/app/actions/customer";
import { Button } from "@/components/ui/button";

export default function AddressDeleteButton({ addressId }: { addressId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteCustomerAddress(addressId);
    setIsDeleting(false);

    if (res?.error) {
      toast.error(res.error);
    } else if (res?.success) {
      toast.success("Address deleted successfully");
      router.refresh();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 transition-colors"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Address"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
