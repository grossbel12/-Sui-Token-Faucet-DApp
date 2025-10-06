import { useState, useCallback } from "react";

export function useDisclosure(initialIsOpen = false) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpenChange = useCallback((open: boolean) => setIsOpen(open), []);

  return { isOpen, onOpen, onClose, onOpenChange };
}
