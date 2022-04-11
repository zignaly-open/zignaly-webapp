import React from "react";
import ServiceNavigationBar from "./ServiceNavigationBar/ServiceNavigationBar";
import ServiceProvider, { ServiceContext } from "./ServiceContext";

export default function ServiceLayout({ children }) {
  return (
    <ServiceProvider>
      <ServiceNavigationBar />
      <ServiceContext.Consumer>
        {({ selectedService }) => selectedService && children}
      </ServiceContext.Consumer>
    </ServiceProvider>
  );
}
