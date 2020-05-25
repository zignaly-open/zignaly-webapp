import * as React from "react";

// Attempts to override wrong typdef from contrib component following technique:
// https://www.detroitlabs.com/blog/2018/02/28/adding-custom-type-definitions-to-a-third-party-library/
// This is not working and the default typedef is taking precedence.

declare module "react-verification-code-input" {
  interface ReactCodeInputProps {
    type: string;
    onChange: (val: string) => void;
    onComplete: (val: string) => void;
    fields: number;
    loading: boolean;
    title: string;
    fieldWidth: number;
    fieldHeight: number;
    autoFocus: boolean;
    className: string;
  }
  export class ReactCodeInput extends React.Component<ReactCodeInputProps, any> {}
}
