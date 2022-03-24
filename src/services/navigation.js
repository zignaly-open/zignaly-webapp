// import { navigate } from "gatsby";

export const navigateLogin = () => {
  const path =
    typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
  if (!path.includes("/login")) {
    console.log("redir todo");
    // navigate("/login?ret=" + encodeURIComponent(path), { state: { forced: true } });
  }
};
