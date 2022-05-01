// Dependencies
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Header,
  IconButton,
  ZigsBalance,
  BrandImage, Select,
} from "zignaly-ui";

// Types
import { AppLayoutProps } from "./types";

// Styled Components
import {
  Layout,
  Container,
  Navigation,
  NavLink,
  DropDownContainer,
  NavList,
  Networks,
  Bold,
} from "./styles";

// Hooks
import useUser from "lib/useUser";

// Config
import navRoutes, { NavRoutesProps } from "../../config/navRoutes";
import { socialNetworksLinks } from "./utils";

function AppLayout({children, title}: AppLayoutProps) {
  // Hooks
  const { user } = useUser();
  const router = useRouter();

  return (
    <Layout>
      {/* SSR */}
      <Head>
        <title>{title}</title>
      </Head>

      {/* Header */}
      <Header
        leftElements={[
          <Link href={"/"} key={"logo"}>
            <NavLink>
              <BrandImage height={"32px"} type={"isotype"} width={"32px"} />
            </NavLink>
          </Link>,
          <Navigation key={"navigation"}>
            {navRoutes.map((route: NavRoutesProps, index: number) => (
              <Link href={route.path} key={`--nav-route-${index.toString()}`}>
                <NavLink active={router.pathname === route.path}>{route.label}</NavLink>
              </Link>
            ))}
          </Navigation>,
          <IconButton
            dropDownOptions={{
              alignment: "right",
              position: "static",
            }}
            icon={"/images/horizontal-three-dots-icon.svg"}
            key={"user"}
            renderDropDown={(
              <DropDownContainer>
                <NavList>
                  <NavLink>For Trading Services</NavLink>
                </NavList>
                <NavList className={"last"}>
                  <NavLink href={"https://help.zignaly.com/hc/en-us"} target={"_blank"}>Help Docs</NavLink>
                  <NavLink>
                    <Bold>ZIG</Bold> $0.0514
                  </NavLink>
                </NavList>
                <Networks>
                  {socialNetworksLinks.map((socialNetwork, index) => {
                    const IconComponent = socialNetwork.icon;
                    return (
                      <NavLink href={"https://twitter.com/zignaly"} key={`--social-network-nav-link-${index.toString()}`} target={"_blank"}>
                        <IconComponent
                          height={"22px"}
                          width={"22px"}
                        />
                      </NavLink>
                    );
                  })}
                </Networks>
              </DropDownContainer>
            )}
            variant={"flat"}
          />,
        ]}
        rightElements={[
          <ZigsBalance balance={0} key={"balance"} />,
          <IconButton
            dropDownOptions={{
              alignment: "right",
              position: "static",
              width: "200px"
            }}
            icon={"/images/user-icon.svg"}
            key={"user"}
            renderDropDown={(
              <DropDownContainer>
                <NavList className={"last"}>
                  <NavLink>My Balances</NavLink>
                  <NavLink>Settings</NavLink>
                </NavList>
              </DropDownContainer>
            )}
            variant={"flat"}
          />,
        ]}
      />

      {/* Container of Page */}
      {user && (
        <Container>
          {children}
        </Container>
      )}
    </Layout>
  );
}

export default AppLayout;
