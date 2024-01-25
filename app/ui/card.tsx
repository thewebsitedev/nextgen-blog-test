import { fetchPostCategories, getUserById } from "../lib/data";
import Image from "next/image";
import { Post } from "@/app/lib/types";
import slugify from "react-slugify";
import moment from "moment";
import Markdown from 'react-markdown'
import { getRandomThumbnail } from "../lib/utils";

export default async function Card({ post }: { post: Post}) {
    const categories = await fetchPostCategories(post.postid);
    const user = await getUserById(post.userid);
    return (
        <article
            key={post.postid}
            className="relative isolate flex flex-col gap-4 sm:gap-8 lg:flex-row"
        >
            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
				<Image
					src={getRandomThumbnail()}
					alt={post.title}
					className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover scale-100 top-0 start-0 transition-transform duration-500 ease-in-out hover:scale-105"
					width={256}
					height={256}
				/>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div>
                <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.createdat.toISOString()} className="text-gray-500">
                        {moment(post.createdat).format('MMM D')}
                    </time>
                    {
                        categories.map((category) => (
                            <a
                                key={category.categoryid}
                                href={slugify(category.name)}
                                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                            >
                                {category.name}
                            </a>
                        ))
                    }
                </div>
                <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <a href={slugify(post.title)}>
                            <span className="absolute inset-0" />
                            {post.title}
                        </a>
                    </h3>
                    <div className="min-h-[48px] mt-5 text-sm leading-6 text-gray-600">
                        <Markdown>{post.summary}</Markdown>
                    </div>
                </div>
                <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                    <div className="relative flex items-center gap-x-4">
                        <Image
                            src="/author.png"
                            alt={post.title}
                            className="h-10 w-10 rounded-full bg-gray-50"
                            width={40}
                            height={40}
                        />
                        <div className="text-sm leading-6">
                            <p className="font-semibold text-gray-900">
                                <a href={slugify(user?.name)}>
                                    <span className="absolute inset-0" />
                                    {user?.name}
                                </a>
                            </p>
                            <p className="text-gray-600">Co-Founder / CTO</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
