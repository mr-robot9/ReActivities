import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {
  //all properties needed are inside the inherited classes
}

export const TextInput: React.FC<IProps> = ({
  input,
  width,
  type,
  placeholder,
  meta
}) => {
  return (
    <Form.Field error={meta.touched && !!meta.error} type={type} width={width}>
      <input {...input} placeholder={placeholder} />
      {meta.touched && meta.error && (
        <Label basic color="red">
          {meta.error}
        </Label>
      )}
    </Form.Field>
  );
};
