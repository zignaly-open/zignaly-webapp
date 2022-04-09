import { useRouter } from "next/router";

const useRedirection = () => {
  const router = useRouter();

  const redirectDashboard = () => {
    let returnUrl = "/service";
    const val = router.query.returnUrl;
    const customReturnUrl = Array.isArray(val) ? val[0] : val;
    if (customReturnUrl && customReturnUrl.indexOf(".") === -1) {
      returnUrl = customReturnUrl;
    }
    router.push(returnUrl);
  };

  const redirectLogin = (withReturnUrl: boolean) => {
    router.push({
      pathname: "/login",
      query: withReturnUrl ? { returnUrl: router.asPath } : null,
    });
  };

  return {
    redirectDashboard,
    redirectLogin,
  };
};

export default useRedirection;
