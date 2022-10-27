import { Box, Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout>
      <br />
      
      <Box mb={4}> 
        <Link href="/create-post">Nova publicação</Link>
      </Box>

      {
        !data ? <Box>Carregando...</Box> : data.posts.map(post => <div key={post.id}>{post.title}</div>)
      }
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
