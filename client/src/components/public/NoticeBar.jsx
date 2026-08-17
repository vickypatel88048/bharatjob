import { Bell } from "lucide-react";

const NoticeBar = ({ posts = [] }) => {
  const latest = posts.slice(0, 5);

  return (
    <div className="bg-blue-700 text-white">

      <div className="max-w-7xl mx-auto px-4">

        <div className="min-h-11 flex items-center gap-3">

          <div className="flex items-center gap-2 font-semibold text-sm shrink-0">
            <Bell size={17} />
            <span>Latest Updates</span>
          </div>

          <div className="h-5 w-px bg-blue-400 hidden sm:block" />

          <div className="overflow-hidden whitespace-nowrap text-sm">

            {latest.length > 0
              ? latest.map((post, index) => (
                  <span key={post._id}>
                    {index > 0 && (
                      <span className="mx-4 text-blue-300">
                        •
                      </span>
                    )}

                    {post.title}
                  </span>
                ))
              : "Latest government job notifications and updates"}

          </div>

        </div>

      </div>

    </div>
  );
};

export default NoticeBar;