import React from "react";
import TraderCard from "./TraderCard";
import { render, screen } from "test-utils";
import providers from "../../../data/providers";

it("renders correctly", () => {
  const tree = render(<TraderCard provider={providers[0]} showSummary={true} timeFrame={30} />);
  expect(tree).toMatchSnapshot();
});
