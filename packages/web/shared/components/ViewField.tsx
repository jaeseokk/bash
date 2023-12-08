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
        `inline-flex items-center text-base [&_a]:underline`,
        size === "lg" && "text-[1.75rem]",
      )}
    >
      {icon && (
        <span
          className={cn(
            "mr-2 [&>*]:w-[1.125rem]",
            size === "lg" && "[&>*]:w-[1.375rem]",
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
