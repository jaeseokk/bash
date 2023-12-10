import * as React from "react";

export interface BottomButtonRootProps {
  children: React.ReactNode;
}

const BottomButtonRoot = ({ children }: BottomButtonRootProps) => {
  return <div className="flex items-center bg-[#161616f0]">{children}</div>;
};

interface BottomButtonItemProps
  extends React.ComponentPropsWithoutRef<"button"> {
  icon?: React.ReactNode;
}

const BottomButtonItem = React.forwardRef<
  HTMLButtonElement,
  BottomButtonItemProps
>(({ icon, children, ...props }, ref) => {
  return (
    <button
      type="button"
      className="flex h-[4.25rem] flex-1 flex-col items-center justify-between bg-transparent py-3.5 font-bold"
      {...props}
      ref={ref}
    >
      <span className="mb-[2px] [&>*]:w-[1.625rem]">{icon}</span>
      <span className="text-[0.625rem]">{children}</span>
    </button>
  );
});

BottomButtonItem.displayName = "BottomButtonItem";

interface BottomButtonDividerProps {}

const BottomButtonDivider = ({}: BottomButtonDividerProps) => {
  return <div className="height h-[2.625rem] w-[1px] bg-[#474747]" />;
};

const BottomButton = {
  Root: BottomButtonRoot,
  Item: BottomButtonItem,
  Divider: BottomButtonDivider,
};

export default BottomButton;
