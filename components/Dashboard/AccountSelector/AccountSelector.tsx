import Image from "next/image";
import * as styled from "./styles";

const AccountSelector = () => {
  return (
    <styled.Layout>
      <Image src="/avatar.svg" width={68} height={68} />
    </styled.Layout>
  );
};

export default AccountSelector;
