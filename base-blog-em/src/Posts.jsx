import { useEffect, useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (currentPage < maxPostPage) {
      let nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient]);

  const mutatationObj = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: (newData) => {
      console.log(newData);
      queryClient.refetchQueries({ queryKey: ["comments", 7] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  if (!data) return <div></div>;
  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {" "}
          <ul>
            {data.map((post) => (
              <li
                key={post.id}
                className="post-title"
                onClick={() => {
                  mutatationObj.reset();
                  updatePostMutation.reset();
                  setSelectedPost(post);
                }}
              >
                {post.title}
              </li>
            ))}
          </ul>
          <div className="pages">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous page
            </button>
            <span>Page {currentPage}</span>
            <button
              disabled={currentPage >= maxPostPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next page
            </button>
          </div>
          <hr />
          {selectedPost && (
            <PostDetail
              post={selectedPost}
              mutationObj={mutatationObj}
              updatePostMutation={updatePostMutation}
            />
          )}
        </>
      )}
    </>
  );
}
