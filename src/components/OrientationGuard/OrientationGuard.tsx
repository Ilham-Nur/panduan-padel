import type { ReactNode } from "react";
import { useOrientation } from "../../hooks/useOrientation";
import { RotateDevicePage } from "../../pages/RotateDevicePage/RotateDevicePage";

type OrientationGuardProps = {
  children: ReactNode;
};

export function OrientationGuard({ children }: OrientationGuardProps) {
  const orientation = useOrientation();

  if (orientation === "portrait") {
    return <RotateDevicePage />;
  }

  return <>{children}</>;
}
