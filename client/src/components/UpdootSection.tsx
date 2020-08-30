import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/core";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

enum LoadingState {
  UPDOOTLOADING = "updootLoading",
  DOWNDOOTLOADING = "downdootLoading",
  NOTLOADING = "notLoading",
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post: p }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.NOTLOADING
  );
  const [, vote] = useVoteMutation();
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
            postId: p.id,
            value: 1,
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
            postId: p.id,
            value: -1,
          });
          setLoadingState(LoadingState.NOTLOADING);
        }}
      />
    </Flex>
  );
};
