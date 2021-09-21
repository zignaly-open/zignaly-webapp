import React, { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { renderWithReactHookForm, screen, fireEvent } from "test-utils";
import CustomNumberInput from "./index";
import userEvent from "@testing-library/user-event";

it("renders with default value", () => {
  renderWithReactHookForm(<CustomNumberInput defaultValue={10} name="maxPositions" />, {
    // Add some default values to our form state, using Reach Hook Form's "defaultValues" param
    defaultValues: {},
  });
  expect(screen.getByRole("textbox")).toHaveValue("10");
});

describe("CustomNumberInput", () => {
  beforeEach(() => {
    renderWithReactHookForm(<CustomNumberInput defaultValue="" name="maxPositions" />, {
      // Add some default values to our form state, using Reach Hook Form's "defaultValues" param
      defaultValues: {},
    });
  });

  it("allows numbers", () => {
    const elem = screen.getByRole("textbox");
    // fireEvent.change(elem, { target: { value: "100" } });
    userEvent.type(elem, "100");

    expect(elem).toHaveValue("100");
  });

  it("disallow everything but numbers", () => {
    const elem = screen.getByRole("textbox");
    // fireEvent.change(elem, { target: { value: "qa%!/100" } });
    userEvent.type(elem, "qa%!/100");

    expect(elem).toHaveValue("100");
  });

  it("disallow negative value", () => {
    const elem = screen.getByRole("textbox");
    userEvent.type(elem, "-100");

    expect(elem).toHaveValue("100");
  });

  it("can be empty", () => {
    const elem = screen.getByRole("textbox");
    userEvent.type(elem, "10");
    userEvent.clear(elem);
    expect(elem).toHaveValue("");
  });
});

describe("CustomNumberInput negative", () => {
  beforeEach(() => {
    renderWithReactHookForm(
      <CustomNumberInput allowNegative={true} defaultValue="" name="maxPositions" />,
      {
        defaultValues: {},
      },
    );
  });

  it("allow negative sign", () => {
    const elem = screen.getByRole("textbox");
    userEvent.type(elem, "-");
    expect(elem).toHaveValue("-");
  });

  it("allow negative values", () => {
    const elem = screen.getByRole("textbox");
    userEvent.type(elem, "-100");
    expect(elem).toHaveValue("-100");
  });
});

it("renders with negative default value", () => {
  renderWithReactHookForm(
    <CustomNumberInput allowNegative={true} defaultValue={-10} name="maxPositions" />,
    {
      defaultValues: {},
    },
  );
  expect(screen.getByRole("textbox")).toHaveValue("-10");
});

describe("CustomNumberInput type=number", () => {
  // let value: number;
  let component: any;

  beforeEach(() => {
    component = renderWithReactHookForm(
      <CustomNumberInput
        type="number"
        defaultValue={null}
        name="maxPositions"
        // onChange={(e) => {
        //   value = e.target.value;
        // }}
      />,
      {
        defaultValues: {},
      },
    );
  });

  it("allows numbers", () => {
    const elem = component.container.querySelector("input");
    userEvent.type(elem, "100");
    expect(elem).toHaveValue(100);
    // expect(value).toHaveValue(100);
  });
});
