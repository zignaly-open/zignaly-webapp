import React from "react";
import CopyTradersBrowse from "pages/copyTraders/browse/index.js";
import { render, screen } from "test-utils";
import { makeServer } from "utils/server";

let server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

it("renders copy traders correctly", async () => {
  const tree = render(<CopyTradersBrowse path="/copyTraders" />);

  await screen.findAllByText("srv.trades");
  expect(tree).toMatchSnapshot();
});
