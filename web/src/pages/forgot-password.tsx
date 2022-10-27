import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';

import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: React.FC = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState<boolean>(false);

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }} 
        onSubmit={async (values) => {
          const response = await forgotPassword({
            email: values.email
          });

          setComplete(true);

          return response;
        }}
      >
        {({ isSubmitting }) => 
         complete ? 
          <Box>
            Se existir uma conta com esse e-mail, enviamos-lhe um e-mail.

            {/* <Box>
              
            </Box> */}
          </Box> : (
          <Form>
            <InputField 
              name='email'
              placeholder='Email'
              label='Email'
            />
            
            <Button mt={4} color='teal' type='submit' isLoading={isSubmitting}>
              Enviar
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}


export default withUrqlClient(createUrqlClient)(ForgotPassword);