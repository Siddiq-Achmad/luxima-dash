import { getPosts } from "@/lib/actions";
import { DUMMY_POSTS } from "@/lib/dummy-data";
import { PostsList } from "@/components/dashboard/posts/post-list";

export default async function PostsPage() {
    // Fetch real data
    const posts = await getPosts();

    // Fallback to dummy data if no real data
    const displayPosts = posts && posts.length > 0 ? posts : DUMMY_POSTS;

    return <PostsList initialPosts={displayPosts} />;
}
