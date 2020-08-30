import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Heading, Text } from "@chakra-ui/core";

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return <Layout>loading...</Layout>;
  }

  if (error) {
    return <Layout>{error.message}</Layout>;
  }

  if (!data?.post) {
    return <Layout>cannot find post</Layout>;
  }

  return (
    <Layout>
      <Heading mb={5}>{data?.post?.title}</Heading>
      <Text>{data?.post?.text}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
