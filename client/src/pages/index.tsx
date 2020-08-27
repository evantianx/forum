import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Button } from "@chakra-ui/core";

const Index = () => {
  const [{ data }] = usePostQuery();
  return (
    <Layout>
      <NextLink href="/create-post">
        <Button variantColor="blue" variant="solid" mb={4}>
          + Create your new post
        </Button>
      </NextLink>
      <br />
      {!data ? (
        <div>loading</div>
      ) : (
        data.posts.map((p) => <h3 key={p.id}>{p.title}</h3>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
