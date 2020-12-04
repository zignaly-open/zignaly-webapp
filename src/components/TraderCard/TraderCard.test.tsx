import React from "react";
import TraderCard from "./TraderCard";
import { render } from "test-utils";
import providers from "utils/mirage/fixtures/providers";
import { providersResponseTransform } from "services/tradeApiClient.types";

it("renders correctly", () => {
  const providersTransformed = providersResponseTransform(providers);
  const tree = render(
    <TraderCard provider={providersTransformed[0]} showSummary={true} timeFrame={30} />,
  );
  expect(tree).toBeDefined();
  // expect(tree).toMatchSnapshot();
});
