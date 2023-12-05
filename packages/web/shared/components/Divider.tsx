import * as React from "react";

export interface DividerProps {}

const Divider = ({}: DividerProps) => {
  return (
    <div className="py-[2.5rem]">
      <hr className="border-t border-gray-600" />
    </div>
  );
};

export default Divider;
