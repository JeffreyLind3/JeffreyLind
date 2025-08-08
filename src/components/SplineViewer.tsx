"use client";

import React from "react";

export type SplineViewerProps = React.HTMLAttributes<HTMLElement> & {
  url: string;
};

export default function SplineViewer({ style, ...rest }: SplineViewerProps) {
  return React.createElement("spline-viewer", {
    ...rest,
    style: { display: "block", width: "100%", height: "100%", ...style },
  });
}
