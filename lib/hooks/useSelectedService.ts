import { useSelector } from "react-redux";
import { useUserServices } from "./useAPI";

const useSelectedService = () => {
  const selectedServiceId = useSelector((state: any) => state.settings.selectedService);
  const { data } = useUserServices();
  return data?.find((s) => s.id === selectedServiceId);
};
export default useSelectedService;
