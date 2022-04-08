import Link from "next/link";
import React from "react";
import * as styled from "./styles";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { endTradeApiSession } from "../../src/store/actions/session";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(endTradeApiSession());
    router.push({ pathname: "/login" });
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
