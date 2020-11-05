import React from "react";
import ProvidersBrowse from "./ProvidersBrowse";
import CopyTradersBrowse from "pages/copyTraders/browse/index.js";
import { render, screen } from "test-utils";
import { makeServer } from "utils/server";
import providers from "../../../data/providers";
import { providersResponseTransform } from "services/tradeApiClient.types";

// it("renders correctly", () => {
//   const tree = render(
//     <ProvidersBrowse
//       connectedOnly={false}
//       setModifiedFiltersCount={setModifiedFiltersCount}
//       showFilters={true}
//       showSort={true}
//       toggleFilters={toggleFilters}
//       toggleSort={toggleSort}
//       type="copyt"
//     />,
//   );
//   expect(tree).toMatchSnapshot();
// });

let server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

it.only("renders correctly", () => {
  const tree = render(<CopyTradersBrowse path="/copyTraders" />);
  expect(tree).toMatchSnapshot();
});
