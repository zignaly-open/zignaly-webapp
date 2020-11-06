import React from "react";
import ProvidersBrowse from "./ProvidersBrowse";
import CopyTradersBrowse from "pages/copyTraders/browse/index.js";
import { render, screen, waitForElement, waitFor } from "test-utils";
import { makeServer } from "utils/server";
import providers from "__tests__/fixtures/providers";
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

it("renders correctly", async () => {
  const tree = render(<CopyTradersBrowse path="/copyTraders" />);
  await waitFor(() => screen.findByText("srv.openpos"));
  expect(tree).toMatchSnapshot();
});
