import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  usePostsQuery,
  PostSnippetFragment,
  useDeletePostMutation,
  DeletePostMutationVariables,
} from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import {
  Button,
  Stack,
  Heading,
  Text,
  Flex,
  Link,
  IconButton,
} from "@chakra-ui/core";
import { useState } from "react";
import { UpdootSection } from "../components/UpdootSection";

interface FeatureProps {
  post: PostSnippetFragment;
  deletePost: ({ id: number }: DeletePostMutationVariables) => void;
}

const Feature: React.FC<FeatureProps> = ({ post: p, deletePost }) => {
  return (
    <Flex p={5} shadow="md" borderWidth="1px" mb={4}>
      <UpdootSection post={p} />
      <Flex direction="column" w="100%">
        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
          <Link>
            <Heading fontSize="xl">{p.title}</Heading>
          </Link>
        </NextLink>
        <Text as="i">posted by {p.creator.username}</Text>
        <Text mt={4}>{p.text}</Text>
        <IconButton
          ml="auto"
          w={10}
          icon="delete"
          aria-label="delete post"
          onClick={() => {
            deletePost({ id: p.id });
          }}
        />
      </Flex>
    </Flex>
  );
};

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <h3>you got query failed for some reason</h3>;
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
              <Feature post={p} deletePost={deletePost} />
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
