import { usePostQuery } from "../generated/graphql";
import { useGetPostId } from "./useGetPostId";

export const useGetPostFromUrl = () => {
  const intId = useGetPostId();
  return usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
};
