import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostQuery();
  return (
    <>
      <NavBar />
      <div>Hello world</div>
      <br />
      {!data ? (
        <div>loading</div>
      ) : (
        data.posts.map((p) => <h3 key={p.id}>{p.title}</h3>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
