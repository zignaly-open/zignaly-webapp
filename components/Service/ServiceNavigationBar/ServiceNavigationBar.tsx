import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as styled from "./styles";
import { Select } from "zignaly-ui";
import { useUserServices } from "lib/useAPI";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { setSelectedService } from "src/store/actions/settings";

const ServiceNavigationBar = () => {
  const intl = useIntl();
  const router = useRouter();
  const selectedService = useSelector((state: any) => state.settings.selectedService);
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
        initialSelectedIndex={options?.findIndex((o) => o.value === selectedService) + 1}
        onSelectItem={handleChange}
        placeholder={intl.formatMessage({ id: "service.selectService" })}
      />
      <Link href="/service">
        <a className={router.pathname === "/service" ? "active" : ""}>Service Dashboard</a>
      </Link>
      <Link href="/investors">
        <a className={router.pathname === "/investors" ? "active" : ""}>Investors</a>
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
