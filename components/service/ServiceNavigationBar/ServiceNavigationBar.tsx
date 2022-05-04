import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as styled from "./styles";
import { Select } from "zignaly-ui";
import { useUserServices } from "lib/hooks/useAPI";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { setSelectedService } from "store/actions/settings";

const ServiceNavigationBar = () => {
  const intl = useIntl();
  const router = useRouter();
  const selectedService = useSelector((state: any) => state.settings.selectedServiceId);
  const { data: services } = useUserServices();
  const options = services?.map((s) => ({ caption: s.name, value: s.id }));
  const dispatch = useDispatch();

  const handleChange = (option) => {
    dispatch(setSelectedService(option.value));
  };

  return (
    <styled.Layout>
      <Select
        options={options}
        onChange={handleChange}
        placeholder={intl.formatMessage({ id: "service.selectService" })}
        value={options?.find((o) => o.value === selectedService)}
      />
      <Link href="/service">
        <a className={router.pathname === "/service" ? "active" : ""}>
          <FormattedMessage id="service.dashboard" />
        </a>
      </Link>
      <Link href="/investors">
        <a className={router.pathname === "/investors" ? "active" : ""}>
          <FormattedMessage id="service.investors" />
        </a>
      </Link>
      <Link href="/balances">
        <a className={router.pathname === "/balances" ? "active" : ""}>
          <FormattedMessage id="service.balances" />
        </a>
      </Link>
      <Link href="/signals">
        <a className={router.pathname === "/signals" ? "active" : ""}>
          <FormattedMessage id="signals.menu" />
        </a>
      </Link>
    </styled.Layout>
  );
};

export default ServiceNavigationBar;
