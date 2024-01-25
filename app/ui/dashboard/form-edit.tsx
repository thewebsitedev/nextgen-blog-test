"use client";

import { useFormState } from "react-dom";
import { updatePost } from "@/app/lib/actions";
import { Category, Post } from "@/app/lib/types";
import { Suspense } from "react";
import { InputCategorySkeleton } from "../skeletons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { classNames } from "@/app/lib/utils";
import Markdown from "react-markdown";
import LinkButton from "../link";
import InputCategory from "./input-category";

// dashboard form for editing post with error handling
export default function DashboardFormEditPost(
    { post, categories, selected } : { post: Post, categories: Category[], selected: string[]}
    ) {

    const updatePostWithId = updatePost.bind(null, post.postid);
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useFormState(updatePostWithId, initialState);
    const [content, setContent] = useState(post.content);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if ('success' === state.message) {
            // notify
            toast.success("Post edited successfully");
            // redirect to posts page after 1 second
            const timer = setTimeout(() => {
                router.push('/dashboard/posts');
            }, 1000); // Delay
          
            // Cleanup function to clear the timeout
            return () => clearTimeout(timer);
        }
        // check errors
        const length = state.errors?.title?.length || 0;
        if ( length > 0 ) {
            // notify
            toast.error("Please fix the errors");
            // enable button
            setLoading(false);
        }
    }, [state, router]);

    // form submit handler instead of form action
    // to be able to manage the state
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // disable button
        setLoading(true);
        // get form data
        const data = new FormData(e.currentTarget);
        // submit form
        dispatch(data);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        {/* title */}
                        <div className="col-span-full">
                            <div className="col-span-full">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        autoComplete="title"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={post.title}
                                    />
                                </div>
                            </div>
                            <div id="error-title" aria-live="polite" aria-atomic="true">
                                {state.errors?.title &&
                                    state.errors.title.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* slug */}
                        <div className="col-span-full">
                            <div className="col-span-full">
                                <label
                                    htmlFor="slug"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Slug
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="slug"
                                        id="slug"
                                        autoComplete="slug"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={post.slug}
                                    />
                                </div>
                            </div>
                            <div id="error-slug" aria-live="polite" aria-atomic="true">
                                {state.errors?.slug &&
                                    state.errors.slug.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* status */}
                        <div className="col-span-full">
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Status
                            </label>
                            <div className="mt-2">
                                <select
                                    id="status"
                                    name="status"
                                    autoComplete="status-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={post.status}
                                >
                                   <option value='draft'>Draft</option>
                                   <option value='published'>Published</option>
                                   <option value='archived'>Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* dynamic categories */}
                        <Suspense fallback={<InputCategorySkeleton />}>
                            <InputCategory categories={categories} selected={selected} />
                        </Suspense>

                        {/* content with preview */}
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Content
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={post.content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                            <div id="error-content" aria-live="polite" aria-atomic="true">
                                {state.errors?.content &&
                                    state.errors.content.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <label
                                htmlFor="preview"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Preview
                            </label>
                            <div className="post mt-2">
                                <Markdown>
                                    {content}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <LinkButton
                    href="/dashboard/posts"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    content="Cancel"
                />
                <button
                    disabled={loading}
                    type="submit"
                    className={classNames(loading ? `bg-gray-400 hover:bg-gray-300 focus-visible:outline-gray-400` : `bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600`, `min-w-24 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`)}
                    aria-disabled={loading}
                >
                    {
                        loading ? <span role="status">
                            <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </span> : <span>Edit Post</span>
                    }
                </button>
            </div>
        </form>
    );
}