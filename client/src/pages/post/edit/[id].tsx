import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Layout } from "../../../components/Layout";
import { Formik, Form } from "formik";
import { InputField } from "../../../components/InputField";
import { Box, Button } from "@chakra-ui/core";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useGetPostId } from "../../../utils/useGetPostId";
import { useRouter } from "next/router";

interface EditProps {}

const EditPost: React.FC<EditProps> = ({}) => {
  const router = useRouter();
  const [, updatePost] = useUpdatePostMutation();
  const postId = useGetPostId();
  const [{ data, error, fetching }] = useGetPostFromUrl();

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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          //   const { error } = await createPost({ input: values });
          //   if (!error) router.push("/");
          await updatePost({ id: postId, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              edit post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
