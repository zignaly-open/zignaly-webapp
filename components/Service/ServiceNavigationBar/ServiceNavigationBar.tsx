import { Box } from "@mui/material";
import Link from "next/link";
import * as styled from "./styles";

const ServiceNavigationBar = () => {
  return (
    <styled.Layout>
      <Link href="/service">Service Dashboard</Link>
      <Link href="/investors">Investors</Link>
    </styled.Layout>
  );
};

export default ServiceNavigationBar;
