import * as React from "react";

export interface FieldProps {
  label?: React.ReactNode;
  labelIcon?: React.ReactNode;
  children: React.ReactNode;
  message?: React.ReactNode;
}

const Field = ({ label, labelIcon, children, message }: FieldProps) => {
  return (
    <label className="block">
      {label && (
        <div className="mb-[0.25rem] flex items-center text-[0.8125rem] font-bold">
          {labelIcon && (
            <span className="mr-[0.25rem] [&>*]:w-4">{labelIcon}</span>
          )}
          {label}
        </div>
      )}
      {children}
      {message && (
        <div className="mt-1 text-[0.825rem] text-muted-foreground">
          {message}
        </div>
      )}
    </label>
  );
};

export default Field;
