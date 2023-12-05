import {
  createContext as _createContext,
  useContext as _useContext,
} from "react";

export function createContext<T>(defaultValue?: T) {
  const Context = _createContext<T | undefined>(defaultValue);
  const useContext = () => {
    const value = _useContext(Context);

    if (value === undefined) {
      throw new Error("useContext must be inside a Provider with a value");
    }
    return value;
  };

  return [Context.Provider, useContext, Context] as const;
}
