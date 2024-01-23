import { fetchUserPaginatedPosts, fetchPostsPages } from "@/app/lib/data";
import { DeletePost } from "@/app/ui/dashboard/posts/buttons";
import { PencilIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import DashboardPagination from "./pagination";

export default async function PostsTable({
    searchParams,
  }: {
    searchParams?: {
      query?: string,
      page?: string,
    },
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.query || '';
    const posts = await fetchUserPaginatedPosts('410544b2-4001-4271-9855-fec4b6a6442a', query, currentPage);
    const { totalPages, totalPosts } = await fetchPostsPages('410544b2-4001-4271-9855-fec4b6a6442a');
    
    return (
        <>
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                            Title
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                            Created
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                            <span className="sr-only">
                                Edit
                            </span>
                            <span className="sr-only">
                                Delete
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {posts.map((post) => (
                        <tr key={post.postid}>
                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                {post.title}
                                <dl className="font-normal lg:hidden">
                                    <dt className="sr-only">
                                        Title
                                    </dt>
                                    <dd className="mt-1 truncate text-gray-700">
                                        {post.title}
                                    </dd>
                                    <dt className="sr-only sm:hidden">
                                        Status
                                    </dt>
                                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                        {post.status}
                                    </dd>
                                </dl>
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                {moment(post.createdat).fromNow()}
                                {/* {moment(post.createdat).format('MMMM Do YYYY, h:mm:ss a')} */}
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                {post.status === 'published' ? <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 capitalize">
                                    {post.status}
                                </span> : ''}
                                {post.status === 'archived' ? <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 capitalize">
                                    {post.status}
                                </span> : ''}
                                {post.status === 'draft' ? <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 capitalize">
                                    {post.status}
                                </span> : ''}
                            </td>
                            <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <span className="isolate inline-flex">
                                    <a
                                        href={`/dashboard/posts/${post.postid}/edit`}
                                        className="relative inline-flex items-center gap-x-1.5 px-1 py-2 text-sm text-gray-700  hover:text-indigo-500 focus:z-10"
                                        title="edit"
                                    >
                                        <PencilIcon
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                        />
                                    </a>
                                    <DeletePost id={post.postid} />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DashboardPagination totalPages={totalPages} totalPosts={totalPosts} page={currentPage} />
        </>
    )
}