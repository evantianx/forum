import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Button, Stack, Flex } from "@chakra-ui/core";
import { useState } from "react";
import { Feature } from "../components/Feature";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <h3>
        you got query failed for some reason: <br />
        errors: ${error?.message}
      </h3>
    );
  }

  return (
    <Layout>
      <Flex>
        <NextLink href="/create-post">
          <Button variantColor="blue" variant="solid" ml="auto">
            + Create your new post
          </Button>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading</div>
      ) : (
        data!.posts.posts.map((p) =>
          !p ? null : (
            <Stack spacing={8} key={p.id}>
              <Feature post={p} />
            </Stack>
          )
        )
      )}
      {data ? (
        <Flex>
          {data.posts.hasMore ? (
            <Button
              isLoading={fetching}
              m="auto"
              my={4}
              variantColor="teal"
              variant="outline"
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
            >
              load more
            </Button>
          ) : null}
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
