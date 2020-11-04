import React from "react";
import TraderCard from "./TraderCard";
import { render, screen } from "test-utils.js";
import providers from "../../../data/providers";

it.only("renders correctly", () => {
  const tree = render(<TraderCard provider={providers[0]} showSummary={true} timeFrame={30} />);
  expect(tree).toMatchSnapshot();
});
