import { formatDate } from "@/utils/dateUtils"
import { EyeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {User,Post } from '@/sanity/types'

export type PostCardType = Omit<Post, "author"> & {author?: User}

const PostCard = ({post}: {post: PostCardType}) => {
    const {
        _createdAt,
        views, 
        author,
        title, 
        category,
        slug, 
        image, 
        //description
        } = post;
  return (
    <li>
        <div className=" rounded-2xl shadow overflow-hidden border-2 w-[16rem] h-full
                        hover:border-violet-300
                        transition-[0.15s]">

            <img src={image} className="w-full h-[9rem]"/>

            <div className="p-3 flex flex-col gap-3 h-full">
                <Link className="font-bold text-2xl" href={`/post/${author?._id}`}>{title}</Link>
                <Link href={`/user/${author?._id}`} className="flex flex-row items-center gap-3">
                    <Image  src='https://placehold.co/34x34'
                            alt='placeholder'
                            width={34} height={34}
                            className="rounded-full"/>
                    <p>{author?.username}</p>
                </Link>

                {/* Date, Views */}
                <div className="flex flex-row justify-between text-neutral-500">
                    <p>
                        {formatDate(_createdAt)}
                    </p>
                    <div className="flex flex-row items-center gap-1.5">
                        <EyeIcon className="size-5"/>
                        <span>{views}</span>
                    </div>
                </div>

                <Link   href={`/?query=${category}`}
                        className="negative w-fit px-3 py-1 rounded-full align-bottom">
                    <p>{category}</p>
                </Link>
            </div>
           
        </div>
    </li>
  )
}

export default PostCard