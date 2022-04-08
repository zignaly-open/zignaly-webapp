import Link from "next/link";
import React from "react";
import * as styled from "./styles";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  return (
    <styled.Layout>
      <Link href="/dashboard">
        <a className={router.pathname == "/dashboard" ? "active" : ""}>Account Dashboard</a>
      </Link>
      <Link href="/service">
        <a className={router.pathname == "/service" ? "active" : ""}>Services Dashboard</a>
      </Link>
    </styled.Layout>
  );
};
export default Header;
