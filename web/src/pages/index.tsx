import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";


const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10
    }
  });

  if (!fetching && !data) {
    return <div>Sua consulta falhou por algum motivo</div>
  }

  return (
    <Layout>
      <br />
      
      <Flex mb={4} align="center">
        <Heading>LiReddit</Heading>
        <Box ml="auto" > 
          <Link href="/create-post">Nova publicação</Link>
        </Box>

      </Flex>

      <Stack spacing={8} direction='column'>
        {!data && fetching ? 
          <Box>Carregando...</Box> : 
            
          data.posts.map(post => 
            <Box p={5} shadow='md' borderWidth='1px' key={post.id}>
              <Heading fontSize='xl'>{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          )
        }
      </Stack>
      {
        data ? (
          <Flex my={8}>
            <Button m="auto" isLoading={fetching}>
              Ver mais
            </Button>
          </Flex>
        ) : null
      }
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
