import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link'; 

import { useRouter } from 'next/router';
import { useState } from 'react';

import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState<string>('');

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }} 
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            token,
            newPassword: values.newPassword,
          }); 
          
          if (response.data?.changePassword.errors?.length) {
            const errorMap = toErrorMap(response.data?.changePassword.errors);

            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/', {});
          }

          return response;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField 
              name='newPassword'
              placeholder='Nova senha'
              label='Nova senha'
              type='password'
            />

            {tokenError ? (
              <Flex>
                <Box mr={2} color="red"> {tokenError} </Box>

                <NextLink href="/forgot-password">
                  <Link>Recuperar novamente</Link>
                </NextLink>
              </Flex>
            ) : null}
            
            <Button mt={4} color='teal' type='submit' isLoading={isSubmitting}>
              Alterar senha
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string
  }
}

export default withUrqlClient(createUrqlClient)(ChangePassword);