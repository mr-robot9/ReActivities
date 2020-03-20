import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label, Select } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {
  //all properties needed are inside the inherited classes
}

export const SelectInput: React.FC<IProps> = ({
  input,
  width,
  placeholder,
  meta,
  options
}) => {
  return (
    <Form.Field error={meta.touched && !!meta.error} width={width}>
      <Select
        value={input.value}
        onChange={(e, data) => input.onChange(data.value)}
        options={options}
        placeholder={placeholder}
      />
      {meta.touched && meta.error && (
        <Label basic color="red">
          {meta.error}
        </Label>
      )}
    </Form.Field>
  );
};
