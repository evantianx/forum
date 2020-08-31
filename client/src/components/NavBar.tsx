import React from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  let body = null;

  if (loading) {
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
          onClick={async () => {
            await logout();
            apolloClient.resetStore();
          }}
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
