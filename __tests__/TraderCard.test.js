import React from "react";
import TraderCard from "../src/components/TraderCard";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const provider = {
    id: "5ec67c9cfc28f4144f661a54",
    name: "Test CT",
    description: "",
    shortDesc: "",
    longDesc: "",
    fee: false,
    website: false,
    exchanges: ["zignaly"],
    key: "f38c06df3b751dac9db2393a625293e7",
    disable: false,
    customerKey: false,
    public: true,
    logoUrl: "",
    hasRecommendedSettings: false,
    hasBeenUsed: true,
    isClone: false,
    isCopyTrading: true,
    clonedFrom: false,
    createdAt: 1590066332,
    isFromUser: true,
    quote: "USDT",
    userId: { $oid: "5ec67c95fc28f4144f661a53" },
    dailyReturns: [],
    followers: 4,
    floating: 0,
    openPositions: 0,
  };
  const tree = renderer.create(<TraderCard provider={provider} />).toJSON();
  expect(tree).toMatchSnapshot();
});
