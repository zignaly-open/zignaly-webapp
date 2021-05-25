import React from "react";
import CustomButton from "./CustomButton";

export default {
  title: "Components/CustomButton",
  component: CustomButton,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

const Template = (args) => (
  <CustomButton className="submitButton" {...args}>
    Button
  </CustomButton>
);

export const Primary = Template.bind({});

Primary.args = {
  loading: false,
};

export const Secondary = Template.bind({});
Secondary.args = {
  loading: true,
};
