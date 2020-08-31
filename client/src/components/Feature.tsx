import {
  PostSnippetFragment,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";
import NextLink from "next/link";
import { Heading, Text, Flex, Link, IconButton } from "@chakra-ui/core";
import { UpdootSection } from "./UpdootSection";

interface FeatureProps {
  post: PostSnippetFragment;
}

export const Feature: React.FC<FeatureProps> = ({ post: p }) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();
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
        {meData?.me?.id === p.creator.id ? (
          <Flex justifyContent="flex-end">
            <NextLink href="/post/edit/[id]" as={`/post/edit/${p.id}`}>
              <IconButton
                w={10}
                icon="edit"
                aria-label="edit post"
                variant="ghost"
              />
            </NextLink>

            <IconButton
              w={10}
              icon="delete"
              aria-label="delete post"
              variant="ghost"
              onClick={() => {
                deletePost({ id: p.id });
              }}
            />
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
};
