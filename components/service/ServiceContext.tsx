import { useUserServices } from "lib/hooks/useAPI";
import useSelectedService from "lib/hooks/useSelectedService";
import React, { createContext } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ProviderEntity } from "src/services/tradeApiClient.types";

export interface ServiceContextType {
  selectedService: ProviderEntity;
  // setSelectedService: (p: ProviderEntity) => void;
}

export const ServiceContext = createContext<ServiceContextType | null>(null);

const ServiceProvider = (props) => {
  const selectedServiceId = useSelector((state: any) => state.settings.selectedService);
  // const selectedServiceId = useSelectedService();
  const { data } = useUserServices();
  const selectedService = data?.find((s) => s.id === selectedServiceId);
  return <ServiceContext.Provider value={{ selectedService }} {...props} />;
};

export default ServiceProvider;
