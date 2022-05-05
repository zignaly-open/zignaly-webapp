import { useUserServices } from "lib/hooks/useAPI";
import React, { createContext } from "react";
import { useSelector } from "react-redux";

export interface ServiceContextType {
  selectedService: Provider;
}

export const ServiceContext = createContext<ServiceContextType | null>(null);

const ServiceProvider = (props) => {
  const selectedServiceId = useSelector((state: any) => state.settings.selectedServiceId);
  const { data } = useUserServices();
  const selectedService = data?.find((s) => s.id === selectedServiceId);
  return <ServiceContext.Provider value={{ selectedService }} {...props} />;
};

export default ServiceProvider;
