import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  placeholder: string,
  textarea?: boolean,
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea = false,
  size: _,
  ...props
}) => {
  let InputOrTextArea = Input as any;

  if (textarea) {
    InputOrTextArea = Textarea
  }

  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <InputOrTextArea {...props} {...field} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}