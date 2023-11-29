import * as React from "react";

export interface InputContainerProps {
  label?: React.ReactNode;
  children: React.ReactNode;
  message?: React.ReactNode;
}

const InputContainer = ({ label, children, message }: InputContainerProps) => {
  return (
    <label className="block">
      {label && (
        <div className="mb- mb-[0.25rem] text-[0.75rem] font-bold">{label}</div>
      )}
      {children}
      {message && <div>{message}</div>}
    </label>
  );
};

export default InputContainer;
