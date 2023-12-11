import { cn } from "@/utils";
import * as React from "react";

export interface ViewFieldProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: "sm" | "lg";
}

const ViewField = ({ icon, children, size = "sm" }: ViewFieldProps) => {
  return (
    <div
      className={cn(
        `inline-flex text-base [&_a]:underline`,
        size === "lg" && "text-[1.75rem]",
      )}
    >
      {icon && (
        <span
          className={cn(
            "mr-2 inline-flex h-[1.5rem] items-center [&_svg]:h-auto [&_svg]:w-[1.375rem]",
            size === "lg" && "h-[2.625rem]",
          )}
        >
          {icon}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};

export default ViewField;
