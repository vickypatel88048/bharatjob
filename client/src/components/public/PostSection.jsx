import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PostSection = ({
  title,
  posts = [],
  type,
  emptyText = "No posts available",
}) => {
  const filteredPosts = type
    ? posts.filter((post) => post.type === type)
    : posts;

  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">

        <h2 className="font-bold text-lg text-slate-800">
          {title}
        </h2>

        <Link
          to={
            type === "job"
              ? "/jobs"
              : type === "result"
              ? "/results"
              : type === "admit-card"
              ? "/admit-card"
              : type === "answer-key"
              ? "/answer-key"
              : "/admission"
          }
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All
          <ArrowRight size={15} />
        </Link>

      </div>

      {/* Posts */}
      <div className="divide-y divide-slate-100">

        {filteredPosts.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            {emptyText}
          </div>
        ) : (
          filteredPosts.slice(0, 8).map((post) => (
            <Link
              key={post._id}
              to={`/post/${post.slug}`}
              className="block px-5 py-4 hover:bg-blue-50 transition"
            >

              <div className="flex items-start gap-3">

                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />

                <div className="min-w-0">

                  <h3 className="text-sm font-medium text-slate-700 hover:text-blue-600">
                    {post.title}
                  </h3>

                  {post.shortDescription && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {post.shortDescription}
                    </p>
                  )}

                  {post.publishedAt && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(
                        post.publishedAt
                      ).toLocaleDateString("en-IN")}
                    </p>
                  )}

                </div>

              </div>

            </Link>
          ))
        )}

      </div>

    </section>
  );
};

export default PostSection;