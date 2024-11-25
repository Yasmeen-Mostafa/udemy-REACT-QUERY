import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post, mutationObj, updatePostMutation }) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
    refetchOnWindowFocus: false,
  });
  return isError ? (
    <h1>{error}</h1>
  ) : isLoading ? (
    <h1>Loading ... </h1>
  ) : (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => mutationObj.mutate(post.id)}>Delete</button>
      {mutationObj.isPending ? (
        <h1>Pending...</h1>
      ) : (
        mutationObj.isSuccess && <h1>Succes oh yeaah</h1>
      )}
      <button onClick={() => updatePostMutation.mutate(post.id)}>
        Update title
      </button>
      {updatePostMutation.isPending ? (
        <h1>Pending update...</h1>
      ) : (
        updatePostMutation.isSuccess && <h1>Succes update oh yeaah</h1>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
