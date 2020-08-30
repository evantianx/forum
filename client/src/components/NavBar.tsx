import React from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({});
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2} color="white">
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2} color="black">
          {data.me.username}
        </Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFetching}
          color="white"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      bg="tomato"
      p={4}
      ml="auto"
      top={0}
      zIndex={1}
      position="sticky"
      align="center"
    >
      <NextLink href="/">
        <Link>
          <Heading color="white">Forum</Heading>
        </Link>
      </NextLink>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
