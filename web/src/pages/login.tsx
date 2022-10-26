import { Box, Button } from '@chakra-ui/react';
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
            router.push('/', {});
          }

          return response; 
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField 
              name='usernameOrEmail'
              placeholder='Username or email'
              label='Username or email'
            />
            <Box mt={4}>
              <InputField 
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>

            <Button mt={4} color='teal' type='submit' isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Login);
