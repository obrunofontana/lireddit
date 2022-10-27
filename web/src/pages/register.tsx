import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';

import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

const Register: React.FC = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
   
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          
          if (response.data?.register.errors?.length) {
            setErrors(toErrorMap(response.data?.register.errors));
          } else if (response.data?.register.user) {
            router.push('/', {});
          }

          return response; 
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField 
              name='username'
              placeholder='Usuário'
              label='Usuário'
            />

            <Box mt={4}>
              <InputField 
                name='email'
                placeholder='E-mail'
                label='Email'
              />
            </Box>

            <Box mt={4}>
              <InputField 
                name='password'
                placeholder='Senha'
                label='Senha'
                type='password'
              />
            </Box>
            
            <Button mt={4} color='teal' type='submit' isLoading={isSubmitting}>
              Cadastrar
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Register);
