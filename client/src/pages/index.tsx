import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Button, Stack, Flex } from "@chakra-ui/core";
import { Feature } from "../components/Feature";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
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
      {!data && loading ? (
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
              isLoading={loading}
              m="auto"
              my={4}
              variantColor="teal"
              variant="outline"
              onClick={() =>
                fetchMore &&
                fetchMore({
                  variables: {
                    limit: variables?.limit,
                    cursor:
                      data.posts.posts[data.posts.posts.length - 1].createdAt,
                  },
                  // updateQuery: (
                  //   previousValue,
                  //   { fetchMoreResult }
                  // ): PostsQuery => {
                  //   if (!fetchMoreResult) {
                  //     return previousValue as PostsQuery;
                  //   }

                  //   return {
                  //     __typename: "Query",
                  //     posts: {
                  //       __typename: "PaginatedPosts",
                  //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                  //       posts: [
                  //         ...(previousValue as PostsQuery).posts.posts,
                  //         ...(fetchMoreResult as PostsQuery).posts.posts,
                  //       ],
                  //     },
                  //   };
                  // },
                })
              }
            >
              load more
            </Button>
          ) : null}
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
