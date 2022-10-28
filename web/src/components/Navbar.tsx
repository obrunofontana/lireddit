import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
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
  }


  if (fetching) {
    body = null;  // data is loading
  } else if (!data?.me) {
    body = !isServer() ? (
      <>
        <NextLink href="/login">
          <Link color="white"  mr={2}>
            Entrar
          </Link>
        </NextLink>       

        <NextLink href="/register">
          <Link color="white">
            Cadastrar
          </Link>
        </NextLink>
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
          Sair
        </Button>
      </Flex>
    )
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg="black" color="white" >
      <Box p={4} ml={"auto"}>     
        {body}
      </Box>
    </Flex>
  )
}

export default Navbar;