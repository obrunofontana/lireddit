import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';


const Login: React.FC = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
   
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: {
            username: values.username,
            password: values.password
          }}); 
          
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
              name='username'
              placeholder='Username'
              label='Username'
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

export default Login;