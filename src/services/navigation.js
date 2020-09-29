import { navigate } from "gatsby";

export const navigateLogin = () => {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  if (!path.includes("/login")) {
    navigate("/login?ret=" + path, { state: { forced: true } });
  }
};
