import React, { useState } from "react";
import { NextPage } from "next";
import {
  useChangePasswordMutation,
  MeQuery,
  MeDocument,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { Wrapper } from "../../components/Wrapper";
import { Formik, Form } from "formik";
import { toErrorMap } from "../../utils/toErrorMap";
import { InputField } from "../../components/InputField";
import {
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Link,
} from "@chakra-ui/core";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage = () => {
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
              cache.evict({ fieldName: "post" });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            } else {
              setErrors(errorMap);
            }
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{tokenError}!</AlertTitle>
                <AlertDescription>
                  <NextLink href="/forgot-password">
                    <Link>click here to get a new one!</Link>
                  </NextLink>
                </AlertDescription>
                <CloseButton position="absolute" right="8px" top="8px" />
              </Alert>
            ) : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
