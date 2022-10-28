import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";


const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10
    }
  });

  return (
    <Layout>
      <br />
      
      <Box mb={4}> 
        <Link href="/create-post">Nova publicação</Link>
      </Box>

      <Stack spacing={8} direction='column'>
        {
          !data ? 
            <Box>Carregando...</Box> : 
            
            data.posts.map(post => 
              <Box p={5} shadow='md' borderWidth='1px' key={post.id}>
                <Heading fontSize='xl'>{post.title}</Heading>
                <Text mt={4}>{post.text}</Text>
              </Box>
            )
        }
      </Stack>


    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
