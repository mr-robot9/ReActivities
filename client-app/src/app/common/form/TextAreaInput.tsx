import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {
  //all properties needed are inside the inherited classes
}

export const TextAreaInput: React.FC<IProps> = ({
  input,
  width,
  placeholder,
  meta,
  rows
}) => {
  return (
    <Form.Field error={meta.touched && !!meta.error} width={width}>
      <textarea rows={rows} {...input} placeholder={placeholder} />
      {meta.touched && meta.error && (
        <Label basic color="red">
          {meta.error}
        </Label>
      )}
    </Form.Field>
  );
};
