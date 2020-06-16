import React, { useState, useContext, useEffect } from "react";
import ExchangeAccountList from "../ExchangeAccountList";
import ExchangeAccountSettings from "../ExchangeAccountSettings";
import ExchangeAccountDeposit from "../ExchangeAccountDeposit";
import ExchangeAccountWithdraw from "../ExchangeAccountWithdraw";
import ExchangeAccountCreate from "../ExchangeAccountCreate";
import ModalHeaderContext from "../ModalHeaderContext";

/**
 * @typedef {Object} DefaultProps
 * @property {string} path Current step path.
 * @property {function} setPath Set current step path function.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ConnectExchangeViewContent = ({ path, setPath }) => {
  const [selectedExchangeInternalId, setExchangeInternalId] = useState("");
  const { setPreviousPath, setPathParams, pathParams } = useContext(ModalHeaderContext);

  /**
   * Navigate to action page.
   * @param {string} [internalId] Selected internal exchange id.
   * @param {string} selectedPath Action path.
   * @returns {void}
   */
  const navigateToAction = (selectedPath, internalId) => {
    // if (internalId) {
    //   setExchangeInternalId(internalId);
    // }
    // setPath(selectedPath);

    setPathParams({
      selectedExchangeInternalId: internalId,
      path: selectedPath,
    });
  };

  console.log("render", path);
  useEffect(() => {
    // setParam and return element here
    console.log(path);
    if (path === "realAccounts") {
      setPathParams({});
    }
  }, [path]);

  switch (path) {
    case "realAccounts":
    case "demoAccounts":
    default:
      //   setPathParams({});
      return <ExchangeAccountList navigateToAction={navigateToAction} type={path} />;
    case "createAccount":
    case "createDemoAccount":
      const demo = path === "createDemoAccount";
      //   setPathParams({
      //     previousPath: demo ? "demoAccounts" : "realAccounts",
      //   });

      return (
        <ExchangeAccountCreate navigateToAction={navigateToAction} create={true} demo={demo} />
      );
    case "connectAccount":
    case "connectDemoAccount":
      return (
        <ExchangeAccountCreate
          navigateToAction={navigateToAction}
          create={false}
          demo={path === "connectDemoAccount"}
        />
      );
    case "settings":
      return <ExchangeAccountSettings internalId={selectedExchangeInternalId} />;
    case "deposit":
      return <ExchangeAccountDeposit />;
    case "withdraw":
      return <ExchangeAccountWithdraw />;
  }
};

export default ConnectExchangeViewContent;
