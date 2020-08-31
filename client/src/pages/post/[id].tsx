import React from "react";
import { Layout } from "../../components/Layout";
import { Heading, Text } from "@chakra-ui/core";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();

  if (loading) {
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

export default withApollo({ ssr: true })(Post);
