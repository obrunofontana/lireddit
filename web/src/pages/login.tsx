import { Box, Button, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';

import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

const Login: React.FC = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
   
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '', }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            usernameOrEmail: values.usernameOrEmail,
            password: values.password,
          }); 
          
          if (response.data?.login.errors?.length) {
            setErrors(toErrorMap(response.data?.login.errors));
          } else if (response.data?.login.user) {
            router.push('/', { pathname: '/' });
          }

          return response; 
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField 
              name='usernameOrEmail'
              placeholder='Usuário ou e-mail'
              label='Usuário ou e-mail'
            />
            <Box mt={4}>
              <InputField 
                name='password'
                placeholder='Senha'
                label='Senha'
                type='password'
              />
            </Box>

            <Box mt={2} color="primary">
              <Link href='/forgot-password'>Esqueci minha senha</Link>
            </Box>

            <Button mt={4} color='teal' type='submit' isLoading={isSubmitting}>
              Acessar
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Login);
