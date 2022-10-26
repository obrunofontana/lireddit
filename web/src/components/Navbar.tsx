import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { useMeQuery } from '../generated/graphql';

const Navbar: React.FC = () => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
    body = null;  // data is loading
  } else if (!data?.me) {
    body = (
      <>
        <Link color="white" href="/login" mr={2}>
          Login
        </Link>

        <Link color="white" href="/register" >
          Register
        </Link>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link">
          Logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tan" >
      <Box p={4} ml={"auto"}>     
        {body}
      </Box>
    </Flex>
  )
}

export default Navbar;