import { useEffect } from "react";
import { useVeltClient } from "@veltdev/react";

export function useCommentStatusNotifications() {
  const { client } = useVeltClient();

  useEffect(() => {
    if (!client) return;

    // Velt will automatically handle notifications for comment status changes
    // We don't need to manually handle notifications as they are built into
    // the VeltComments component
  }, [client]);
}
