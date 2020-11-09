import React from "react";
import TraderCard from "./TraderCard";
import { render } from "__tests__/utils/test-utils";
import providers from "__tests__/fixtures/providers";
import { providersResponseTransform } from "services/tradeApiClient.types";

it("renders correctly", () => {
  const providersTransformed = providersResponseTransform(providers);
  const tree = render(
    <TraderCard provider={providersTransformed[0]} showSummary={true} timeFrame={30} />,
  );
  expect(tree).toMatchSnapshot();
});
