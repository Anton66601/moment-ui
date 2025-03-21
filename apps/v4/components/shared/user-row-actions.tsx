// apps/v4/components/shared/user-row-actions.tsx
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu";
import { Button } from "@/registry/new-york-v4/ui/button";
import { toast } from "sonner";

interface UserRowActionsProps {
  userId: string;
  username: string;
  onDeleted?: () => void;
  onEdit?: () => void;
}

export function UserRowActions({ userId, username, onDeleted, onEdit }: UserRowActionsProps) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success(`"${username}" eliminado`);
        onDeleted?.();
      } else {
        toast.error("No se pudo eliminar el usuario.");
      }
    } catch (err) {
      toast.error("Ocurrió un error al eliminar.");
      console.error(err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
