import React, { useState } from "react";
import CustomButton from "../../CustomButton";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { setUserExchanges } from "../../../store/actions/userExchanges";

const ConnectExchangeButton = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const authenticateUser = async () => {
    const loginPayload = {
      email: "mailxuftg1pxzk@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(true);

  const fetchUserExchanges = async () => {
    showLoading();
    const userEntity = await authenticateUser();
    dispatch(setUserExchanges(userEntity, hideLoading));
  };

  return (
    <CustomButton loading={loading} className="headerButton" onClick={fetchUserExchanges}>
      Connect Account
    </CustomButton>
  );
};

export default ConnectExchangeButton;
