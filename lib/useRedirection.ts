import { useRouter } from "next/router";

const useRedirection = () => {
  const router = useRouter();

  const redirectDashboard = () => {
    let returnUrl = "/service";
    if (router.query.returnUrl && router.query.returnUrl.indexOf(".") === -1) {
      returnUrl = router.query.returnUrl;
    }
    console.log("redir", returnUrl);
    router.push(returnUrl);
  };
  return { redirectDashboard };
};

export default useRedirection;
