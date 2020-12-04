import React from "react";
import CopyTradersBrowse from "pages/copyTraders/browse/index.js";
import { render, screen, waitForElementToBeRemoved } from "test-utils";
import { makeServer } from "utils/mirage/server";
import type { Server } from "miragejs/server";

let server: Server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

it("renders copy traders correctly", async () => {
  const tree = render(<CopyTradersBrowse path="/copyTraders" />);

  //   await screen.findAllByText("srv.trades");
  await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

  // expect(tree).toMatchSnapshot();
});
