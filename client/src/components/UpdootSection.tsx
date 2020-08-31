import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/core";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { gql, ApolloCache } from "@apollo/client";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

enum LoadingState {
  UPDOOTLOADING = "updootLoading",
  DOWNDOOTLOADING = "downdootLoading",
  NOTLOADING = "notLoading",
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    fragment: gql`
      fragment _r on Post {
        id
        points
        voteStatus
      }
    `,
    id: "Post:" + postId,
  });

  if (data) {
    if (data.voteStatus === value) return;
    const newPoints =
      (data.points as number) + (data.voteStatus ? 2 : 1) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment _w on Post {
          points
          voteStatus
        }
      `,
      data: { id: postId, points: newPoints, voteStatus: value },
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post: p }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.NOTLOADING
  );
  const [vote] = useVoteMutation();
  return (
    <Flex mr={4} flexDirection="column" alignItems="center">
      <IconButton
        variant={p.voteStatus === 1 ? "solid" : "outline"}
        variantColor="green"
        icon="chevron-up"
        size="sm"
        aria-label="updoot"
        isRound={true}
        isLoading={loadingState === LoadingState.UPDOOTLOADING}
        onClick={async () => {
          if (p.voteStatus === 1) return;
          setLoadingState(LoadingState.UPDOOTLOADING);
          await vote({
            variables: {
              postId: p.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, p.id, cache),
          });
          setLoadingState(LoadingState.NOTLOADING);
        }}
      />
      {p.points}
      <IconButton
        variantColor="red"
        variant={p.voteStatus === -1 ? "solid" : "outline"}
        icon="chevron-down"
        size="sm"
        aria-label="downdoot"
        isRound={true}
        isLoading={loadingState === LoadingState.DOWNDOOTLOADING}
        onClick={async () => {
          if (p.voteStatus === -1) return;
          setLoadingState(LoadingState.DOWNDOOTLOADING);
          await vote({
            variables: {
              postId: p.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, p.id, cache),
          });
          setLoadingState(LoadingState.NOTLOADING);
        }}
      />
    </Flex>
  );
};
