import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  const onClickLogoutHandler = () => {
    logout({});
    router.push('/login')
  }


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
        <Button onClick={onClickLogoutHandler} 
        variant="link"
        isLoading={logoutFetching}
      >
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