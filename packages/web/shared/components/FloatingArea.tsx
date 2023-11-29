import * as React from "react";

interface FloatingAreaProps {
  children: React.ReactNode;
}

const FloatingArea = ({ children }: FloatingAreaProps) => {
  return <div className="sticky bottom-0 left-0 right-0">{children}</div>;
};

export default FloatingArea;
