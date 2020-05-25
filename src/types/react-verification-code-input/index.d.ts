import * as React from "react";

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
