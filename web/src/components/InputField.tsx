import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  placeholder: string
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input {...props} {...field} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}