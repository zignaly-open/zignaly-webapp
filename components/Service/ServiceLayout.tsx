import React from "react";
import ServiceNavigationBar from "./ServiceNavigationBar/ServiceNavigationBar";

export default function ServiceLayout({ children }) {
  return (
    <>
      <ServiceNavigationBar />
      {children}
    </>
  );
}
