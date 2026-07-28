import { LoadingOverlay } from "@mantine/core";
import { Loader as MantineLoader } from "@mantine/core";

type GlobalLoaderProps = {
  visible: boolean;
};

export const GlobalLoader = ({ visible }: GlobalLoaderProps) => {
  return (
    <LoadingOverlay
      visible={visible}
      zIndex={1000}
      style={{ position: "fixed" }}
      loaderProps={{ children: <MantineLoader /> }}
    />
  );
};
