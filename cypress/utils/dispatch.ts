import { AnyAction } from "redux";

const dispatch = (action: AnyAction) => cy.window().its("store").invoke("dispatch", action);
export default dispatch;
