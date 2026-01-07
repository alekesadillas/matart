"use client";
import { Toaster } from "sonner";

export function ClientToaster() {
  return (
    <Toaster 
      position="top-center" 
      richColors 
      expand={true}
      closeButton
      toastOptions={{
        style: {
          zIndex: 9999,
        },
      }}
    />
  );
}
