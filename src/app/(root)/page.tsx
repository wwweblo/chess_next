import Search from "@/components/ui/search";
import PostCard, { PostCardType } from "@/components/ui/postCard";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export default async function Home({searchParams}: {
  searchParams: Promise<{query?: string}>
}) {
  const query = (await searchParams).query;
  const params = {search: query || null};
  const {data: posts} = await sanityFetch({query: POSTS_QUERY, params});

  // console.log(JSON.stringify(posts, null, 2))
  return (
    <>
      <section className="flex flex-col items-center mt-10 mb-5">
        <h1 className="font-bold text-4xl negative px-5 py-1">Chess</h1>
        <h3 className="m-3">Тренеруйся, учиcь, побеждай🏆</h3>
        <Search query={query}/>
      </section>

      <section className="flex flex-col items-center">
        <p className="my-5">{query && `Результаты поиска "${query}"`}</p>

        {posts?.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {posts.map((post: PostCardType) => (
              <PostCard key={post._id} post={post} />
            ))}
          </ul>
        ) : (
          <p>Без результатов😓</p>
        )}
      </section>

      <SanityLive />
    </>
  );
}
