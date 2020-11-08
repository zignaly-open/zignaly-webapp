import React from "react";
import { renderLoggedIn, screen, waitForElementToBeRemoved } from "test-utils";
import { makeServer } from "utils/mirage";
import type { Server } from "miragejs/server";
import TradingView from "./TradingView";

let server: Server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

it("renders trading terminal correctly", async () => {
  const tree = renderLoggedIn(<TradingView />);

  //   await screen.findAllByText("srv.trades");
  await waitForElementToBeRemoved(() => screen.getByRole("progressbar"), { timeout: 40000 });

  expect(tree).toMatchSnapshot();
}, 40000);
