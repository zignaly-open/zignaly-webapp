import React from "react";
import { renderLoggedIn, screen, waitForElementToBeRemoved, fireEvent, act } from "test-utils";
import { makeServer } from "utils/test/mirage";
import type { Server } from "miragejs/server";
import TradingView from "./TradingView";

let server: Server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

class TradingViewMock {
  constructor() {}

  postMessage() {}
}

it("renders trading terminal correctly", async () => {
  // Mocked TradingView library attached to window object
  // @ts-ignore
  window.TradingView = { widget: TradingViewMock };

  await act(async () => {
    const tree = renderLoggedIn(<TradingView />);

    // Wait for TradingView Widget to be detected
    await new Promise((r) => setTimeout(r, 150));

    // Send TradingView ready event
    const event = new CustomEvent("message");
    // @ts-ignore
    event.data = JSON.stringify({ name: "widgetReady" });
    fireEvent(window, event);

    // Send TradingView quote event
    const event2 = new CustomEvent("message");
    // @ts-ignore
    event2.data = JSON.stringify({
      name: "quoteUpdate",
      client_id: "",
      data: {
        change: 562.6,
        change_percent: 3.8,
        description: "Bitcoin / Tether",
        exchange: "KUCOIN",
        last_price: 15377.2,
        original_name: "KUCOIN:BTCUSDT",
        short_name: "BTCUSDT",
        volume: 32002150.91852322,
      },
      id: 1,
      provider: "TradingView",
      type: "post",
    });
    fireEvent(window, event2);

    await screen.findByText("terminal.open");

    // expect(tree).toMatchSnapshot();
  });
});
