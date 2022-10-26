import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer() // como a index esta sendo sendo renderizada do lado server, aguarda ser renderizado para chamar
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  const onClickLogoutHandler = () => {
    logout({});
    router.push('/login')
  }


  if (fetching) {
    body = null;  // data is loading
  } else if (!data?.me) {
    body = !isServer() ? (
      <>       
        <Link color="white" href="/login" mr={2}>
          Login
        </Link>

        <Link color="white" href="/register" >
          Register
        </Link>
      </>
    ) : null
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