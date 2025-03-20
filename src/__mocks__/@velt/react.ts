import type { ReactNode } from "react";

export const useVeltClient = jest.fn();

export const VeltProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return children;
};

export const useCommentNotifications = jest.fn();
export const useCommentStatusNotifications = jest.fn();
export const usePresence = jest.fn();
export const useComments = jest.fn();
