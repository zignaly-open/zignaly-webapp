import Link from "next/link";
import React from "react";
import * as styled from "./styles";
import { useSession } from "lib/session";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { endSession } = useSession();

  const logout = () => {
    endSession(false);
  };

  return (
    <styled.Layout>
      <Link href="/dashboard">
        <a className={router.pathname == "/dashboard" ? "active" : ""}>Account Dashboard</a>
      </Link>
      <Link href="/service">
        <a className={router.pathname == "/service" ? "active" : ""}>Services Dashboard</a>
      </Link>
      <a href="#" style={{ marginLeft: "auto" }} onClick={logout}>
        Logout
      </a>
    </styled.Layout>
  );
};
export default Header;
