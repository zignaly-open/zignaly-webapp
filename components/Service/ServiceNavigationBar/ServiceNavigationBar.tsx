import Link from "next/link";
import { useRouter } from "next/router";
import * as styled from "./styles";

const ServiceNavigationBar = () => {
  const router = useRouter();

  return (
    <styled.Layout>
      <Link href="/service">
        <a className={router.pathname == "/service" ? "active" : ""}>Service Dashboard</a>
      </Link>
      <Link href="/investors">
        <a className={router.pathname == "/investors" ? "active" : ""}>Investors</a>
      </Link>
    </styled.Layout>
  );
};

export default ServiceNavigationBar;
