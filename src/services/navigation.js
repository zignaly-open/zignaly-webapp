import { navigate } from "gatsby";

export const navigateLogin = () => {
  // Path including hash and query string
  const path =
    typeof window !== "undefined"
      ? window.location.href.substring(window.location.origin.length)
      : "";
  if (!path.includes("/login")) {
    navigate("/login?ret=" + encodeURIComponent(path), { state: { forced: true } });
  }
};
