import * as React from "react";
import Instagram from "next-auth/providers/instagram";

export interface InputWrapperProps {
  children: React.ReactNode;
  leftAddon?: React.ReactNode;
}

const InputWrapper = ({ children, leftAddon }: InputWrapperProps) => {
  return (
    <div className="relative">
      {leftAddon && (
        <span className="absolute left-4 top-[50%] translate-y-[-50%]">
          {leftAddon}
        </span>
      )}
      {children}
    </div>
  );
};

export default InputWrapper;
