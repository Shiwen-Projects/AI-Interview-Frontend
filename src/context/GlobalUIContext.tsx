import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { GlobalLoader } from "../components";

type GlobalUIContextValue = {
  globalLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const GlobalUIContext = createContext<GlobalUIContextValue | null>(null);

type GlobalUIProviderProps = {
  children: ReactNode;
};

export function GlobalUIProvider({ children }: GlobalUIProviderProps) {
  const [globalLoading, setGlobalLoading] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    setGlobalLoading(loading);
  }, []);

  const value = useMemo(
    () => ({ globalLoading, setLoading }),
    [globalLoading, setLoading],
  );

  return (
    <GlobalUIContext value={value}>
      {children}
      <GlobalLoader visible={globalLoading} />
    </GlobalUIContext>
  );
}

// oxlint-disable-next-line react/only-export-components -- Provider and hook intentionally share this module.
export function useGlobalUIContext() {
  const context = useContext(GlobalUIContext);

  if (!context) {
    throw new Error("useGlobalUIContext must be used within GlobalUIProvider");
  }

  return context;
}
