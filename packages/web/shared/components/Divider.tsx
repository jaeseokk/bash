import { cn } from "@/lib/utils";
import * as React from "react";

export interface DividerProps {
  className?: string;
}

const Divider = ({ className }: DividerProps) => {
  return (
    <div className={cn("py-[2.5rem]", className)}>
      <hr className="border-t border-gray-600" />
    </div>
  );
};

export default Divider;
