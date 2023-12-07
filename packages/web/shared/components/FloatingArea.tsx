import { cn } from "@/lib/utils";
import * as React from "react";

interface FloatingAreaProps {
  className?: string;
  children: React.ReactNode;
}

const FloatingArea = ({ className, children }: FloatingAreaProps) => {
  return (
    <div className={cn("sticky bottom-0 left-0 right-0", className)}>
      {children}
    </div>
  );
};

export default FloatingArea;
