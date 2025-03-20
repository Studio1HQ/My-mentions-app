import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: string;
  initialValue?: string;
}

export function CommentInput({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  defaultValue = "",
  initialValue = "",
}: CommentInputProps) {
  const [content, setContent] = useState(defaultValue || initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!content.trim()}>
          Post Comment
        </Button>
      </div>
    </form>
  );
}
