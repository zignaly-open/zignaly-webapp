import React, { useState } from "react";
import CustomButton from "../../CustomButton";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { setUserExchanges, setUserBalance } from "../../../store/actions/user";

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
    try {
      showLoading();
      const userEntity = await authenticateUser();
      dispatch(setUserExchanges(userEntity, hideLoading));
      dispatch(setUserBalance(userEntity));
    } catch (error) {}
  };

  return (
    <CustomButton className="headerButton" loading={loading} onClick={fetchUserExchanges}>
      Connect Account
    </CustomButton>
  );
};

export default ConnectExchangeButton;
