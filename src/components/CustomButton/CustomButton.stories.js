import React from "react";
import CustomButton from "./CustomButton";

export default {
  title: "Components/CustomButton",
  component: CustomButton,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

/**
 * @typedef {import('./CustomButton').DefaultProps} DefaultProps
 */

const Template = (/** @type {DefaultProps} */ args) => (
  <CustomButton className="submitButton" {...args}>
    Button
  </CustomButton>
);

export const Primary = Template.bind({});

Primary.args = {
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};
