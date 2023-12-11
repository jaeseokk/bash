import * as React from "react";

export interface FieldProps {
  label?: React.ReactNode;
  labelIcon?: React.ReactNode;
  children: React.ReactNode;
  message?: React.ReactNode;
  topMessage?: React.ReactNode;
}

const Field = ({
  label,
  labelIcon,
  children,
  message,
  topMessage,
}: FieldProps) => {
  return (
    <label className="block">
      {label && (
        <div className="mb-[0.25rem] flex items-center justify-between text-[0.8125rem] font-bold">
          <div className="flex items-center">
            {labelIcon && (
              <span className="mr-[0.25rem] [&>*]:w-4">{labelIcon}</span>
            )}
            {label}
          </div>
          {topMessage && (
            <div className="text-[0.75rem] text-[#ffffffb3]">{topMessage}</div>
          )}
        </div>
      )}
      {children}
      {message && (
        <div className="mt-1 text-[0.825rem] text-[#ffffffb3]">{message}</div>
      )}
    </label>
  );
};

export default Field;
