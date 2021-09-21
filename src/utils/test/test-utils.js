import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import initialState from "store/initialState";
import rootReducer from "store/reducers/rootReducer";
import userExchanges from "utils/mirage/fixtures/userExchanges";
import userData from "utils/mirage/fixtures/userData";
import { FormProvider, useForm } from "react-hook-form";

/**
 * Testing Library utility function to wrap tested component in React Hook Form
 * @param {React.ReactElement} ui A React component
 * @param objectParameters
 * @param {Object} objectParameters.defaultValues Initial form values to pass into
 * React Hook Form, which you can then assert against
 */
export function renderWithReactHookForm(ui, { defaultValues = {} } = {}) {
  let reactHookFormMethods = {};

  const Wrapper = ({ children }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return {
    ...render(ui, { wrapper: Wrapper }),
  };
}

/**
 * Render ui with logged in user store
 * @param {React.ReactElement} ui Element to render
 * @param {*} Options Render params
 * @returns {React.ReactNode} New element
 */
export const renderLoggedIn = (ui, { state: customState = {} } = {}) => {
  const s = {
    session: {
      tradeApi: {
        accessToken: "xxxx",
      },
    },
    settings: {
      selectedExchange: userExchanges[0],
      tradingTerminal: { pair: {}, provider: "" },
    },
    user: {
      loaded: true,
      exchangeConnections: userExchanges,
      userData,
    },
  };
  const state = { ...customState, ...s };

  return render(ui, { state });
};

/**
 * Wrap ui with react-intl and react-redux providers
 * @param {React.ReactElement} ui Element to render
 * @param {*} Options Render params
 * @returns {React.ReactNode} New element
 */
export const render = (ui, { locale = "en", state: customState = {}, ...renderOptions } = {}) => {
  const state = { ...initialState, ...customState };
  const store = createStore(rootReducer, state, applyMiddleware(thunk));

  /**
   * Wrap ui with react-intl and react-redux providers
   * @param {{children: React.ReactNode}} props Props
   * @returns {React.ReactNode} New element
   */
  function Wrapper({ children }) {
    return (
      <IntlProvider locale={locale} onError={() => {}}>
        <Provider store={store}>{children}</Provider>
      </IntlProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// const thunk = ({ dispatch, getState }) => (next) => (action) => {
//   if (typeof action === "function") {
//     return action(dispatch, getState);
//   }

//   return next(action);
// };

// const create = () => {
//   const store = {
//     getState: jest.fn(() => ({})),
//     dispatch: jest.fn(),
//   };
//   const next = jest.fn();

//   const invoke = (action) => thunk(store)(next)(action);

//   return { store, next, invoke };
// };

// re-export everything
export * from "@testing-library/react";
