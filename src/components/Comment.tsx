import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { CommentInput } from "./CommentInput";

export interface CommentProps {
  id: string;
  content: string;
  authorId: string;
  createdAt: string | Date;
  mentions?: Array<{ userId: string }>;
  onEdit?: (id: string, content: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function Comment({
  id,
  content,
  authorId,
  createdAt,
  mentions = [],
  onEdit,
  onDelete,
}: CommentProps) {
  const { userId } = useAuth();
  const isAuthor = userId === authorId;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (newContent: string) => {
    if (onEdit) {
      await onEdit(id, newContent);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderContent = () => {
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // This is a mention
        const isMentioned = mentions.some((m) => m.userId === part);
        return (
          <span
            key={`${id}-mention-${part}`}
            className={isMentioned ? "text-primary font-medium" : ""}
          >
            @{part}
          </span>
        );
      }
      return <span key={`${id}-text-${part}`}>{part}</span>;
    });
  };

  if (isEditing) {
    return (
      <CommentInput
        initialValue={content}
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{authorId}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(createdAt), "M/d/yyyy")}
          </span>
        </div>
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="h-8 w-8"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setIsEditing(true)}
                disabled={isDeleting}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                data-disabled={isDeleting ? "" : undefined}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-sm">{renderContent()}</p>
    </div>
  );
}
