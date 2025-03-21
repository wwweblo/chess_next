import Search from "@/components/ui/search";
import PostCard, { PostCardType } from "@/components/ui/postCard";
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export default async function Home({searchParams}: {
  searchParams: Promise<{query?: string}>
}) {
  const query = (await searchParams).query;

  const posts = await client.fetch(POSTS_QUERY);
  console.log(JSON.stringify(posts, null, 2))
  return (
    <>
      <section className="flex flex-col items-center my-10">
        <h1 className="font-bold text-4xl negative px-5 py-1">Chess</h1>
        <h3 className="m-3">Тренеруйся, учиcь, побеждай🏆</h3>
        <Search query={query}/>
      </section>

      <section className="flex flex-col items-center">
        <p>{query && `Результаты поиска ${query}`}</p>

        <ul className="grid grid-cols-1 md:grid-cols-3 mg:grid-cols-4">
          {posts?.length > 0 ? (
            posts.map((post: PostCardType, index: number) => 
            <PostCard key={post._id} post={post}/>
          )) : (
            <p>No results</p>
          )
        }
        </ul>
      </section>
    </>
  );
}
