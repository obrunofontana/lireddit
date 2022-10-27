import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';

import { InputField } from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuthenticated } from '../utils/useIsAuthenticated';

const CreatePost: React.FC = () => {
  const router = useRouter();
  useIsAuthenticated();
  const [, createPost] = useCreatePostMutation();

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '', }}
        onSubmit={async (values) => {
          const { error } =await createPost({ input: values });  

          if (!error) {
            router.push('/', { pathname: '/' }); 
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField 
              name='title'
              placeholder='Título'
              label='Título'
            />
            <Box mt={4}>
              <InputField 
                name='text'
                placeholder='O que você está pensando?'
                label='Texto'
                textarea={true}
              />
            </Box>

            <Button mt={4} color='teal' type='submit' isLoading={isSubmitting}>
              Publicar
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(CreatePost);