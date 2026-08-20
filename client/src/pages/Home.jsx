import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Home.css";

const API = "http://localhost:5000/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`);
      const data = res.data?.posts || [];
      setPosts(
        data
          .filter((p) => p.status === "published" && p.isDeleted !== true)
          .sort(
            (a, b) =>
              new Date(b.publishedAt || b.createdAt || 0) -
              new Date(a.publishedAt || a.createdAt || 0)
          )
      );
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally {
      setLoading(false);
    }
  };

  const byType = (type, limit = 10) =>
    posts.filter((post) => post.type === type).slice(0, limit);

  const featured = useMemo(
    () => posts.filter((post) => post.featured === true).slice(0, 5),
    [posts]
  );

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return posts
      .filter((post) => post.title?.toLowerCase().includes(query))
      .slice(0, 15);
  }, [search, posts]);

  const count = (type) => posts.filter((post) => post.type === type).length;
  const isSearching = search.trim().length > 0;

  return (
    <>
      <Helmet>
        <title>BharatJobs - Latest Government Jobs, Results & Admit Card</title>
        <meta
          name="description"
          content="Latest government jobs, Sarkari results, admit cards, answer keys, admissions and recruitment notifications on BharatJobs."
        />
      </Helmet>

      <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">
        <div className="w-full max-w-[1000px] mx-auto bg-white min-h-screen">
          {/* HEADER — unchanged */}
          <header className="bg-[#d40000]">
            <div className="h-[105px] flex flex-col items-center justify-center text-center px-3">
              <Link to="/" className="no-underline">
                <h1 className="text-[30px] sm:text-[40px] font-extrabold text-white uppercase leading-none">
                  BHARAT JOBS
                </h1>
                <p className="text-white text-[12px] sm:text-[14px] mt-2 font-bold">
                  BharatJobs.com
                </p>
              </Link>
            </div>
          </header>
          <nav className="bg-[#050d52]">
            <div className="flex flex-wrap justify-center">
              <NavItem to="/" text="Home" active />
              <NavItem to="/jobs" text="Latest Job" />
              <NavItem to="/admit-card" text="Admit Card" />
              <NavItem to="/results" text="Result" />
              <NavItem to="/admission" text="Admission" />
              <NavItem to="/syllabus" text="Syllabus" />
              <NavItem to="/answer-key" text="Answer Key" />
              <NavItem to="/contact" text="Contact Us" />
            </div>
          </nav>

          <main className="bj-home">
            <div className="bj-search">
              <div>
                <b>Search Government Updates</b>
                <span>Find jobs, results, admit cards and exams</span>
              </div>
              <form onSubmit={(event) => event.preventDefault()}>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search job, exam, department or result..."
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")}>
                    ×
                  </button>
                )}
                <button type="submit">Search</button>
              </form>
            </div>

            {!isSearching ? (
              <>
                <div className="bj-category-strip">
                  <Category to="/jobs" label="Latest Jobs" count={count("job")} icon="01" />
                  <Category to="/results" label="Results" count={count("result")} icon="02" />
                  <Category to="/admit-card" label="Admit Card" count={count("admit-card")} icon="03" />
                  <Category to="/answer-key" label="Answer Key" count={count("answer-key")} icon="04" />
                  <Category to="/admission" label="Admission" count={count("admission")} icon="05" />
                </div>

                <div className="bj-news-head">
                  <div>
                    <span>FEATURED</span>
                    <h2>Important Updates</h2>
                  </div>
                  <Link to="/jobs">View all →</Link>
                </div>

                {featured.length > 0 && (
                  <div className="bj-featured-list">
                    {featured.map((post, index) => (
                      <Link
                        className="bj-featured-row"
                        key={post._id}
                        to={`/post/${post.slug}`}
                      >
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                        <div>
                          <b>{post.title}</b>
                          <small>
                            {isNew(post) ? "New update" : "Featured notification"}
                          </small>
                        </div>
                        <span>›</span>
                      </Link>
                    ))}
                  </div>
                )}

                {loading ? (
                  <div className="bj-loading">Loading latest updates...</div>
                ) : (
                  <>
                    <div className="bj-block-title">
                      <div>
                        <span>LATEST</span>
                        <h2>Latest Government Jobs</h2>
                      </div>
                      <Link to="/jobs">See all jobs →</Link>
                    </div>

                    <section className="bj-job-board">
                      <div className="bj-job-main">
                        <div className="bj-board-head">
                          <b>Recruitment Notification</b>
                          <span>Recently Published</span>
                        </div>
                        {byType("job", 12).map((post) => (
                          <PostRow key={post._id} post={post} />
                        ))}
                        {byType("job").length === 0 && <Empty />}
                      </div>

                      <aside className="bj-side-stack">
                        <MiniSection
                          title="Latest Results"
                          link="/results"
                          posts={byType("result", 6)}
                        />
                        <MiniSection
                          title="Admit Card"
                          link="/admit-card"
                          posts={byType("admit-card", 6)}
                        />
                      </aside>
                    </section>

                    <div className="bj-two-columns">
                      <MiniSection
                        title="Answer Key"
                        link="/answer-key"
                        posts={byType("answer-key", 7)}
                      />
                      <MiniSection
                        title="Admission"
                        link="/admission"
                        posts={byType("admission", 7)}
                      />
                    </div>
                  </>
                )}

                <div className="bj-bottom-info">
                  <div>
                    <span>BHARATJOBS</span>
                    <h3>Everything for your government exam journey</h3>
                    <p>
                      Browse recruitment notifications, results, admit cards,
                      answer keys and admission updates from one place.
                    </p>
                  </div>
                  <div>
                    <b>Important</b>
                    <p>
                      Always read and verify the official notification before
                      applying. Check eligibility, dates, fees and documents
                      carefully.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <section className="bj-search-results">
                <div className="bj-block-title">
                  <div>
                    <span>SEARCH</span>
                    <h2>Search Results</h2>
                  </div>
                  <b>{searchResults.length} found</b>
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((post) => (
                    <PostRow key={post._id} post={post} />
                  ))
                ) : (
                  <Empty text="No matching posts found." />
                )}
              </section>
            )}
          </main>

          {/* FOOTER — unchanged */}
          <footer className="bg-[#050d52] text-white mt-7">
            <div className="px-4 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <h3 className="font-bold text-base">BharatJobs</h3>
                  <p className="text-[11px] text-slate-300 mt-2 leading-5">
                    Latest Government Jobs, Results, Admit Cards and Examination Notifications.
                  </p>
                </div>
                <FooterColumn
                  title="Important Links"
                  links={[
                    ["Latest Jobs", "/jobs"],
                    ["Results", "/results"],
                    ["Admit Card", "/admit-card"],
                  ]}
                />
                <FooterColumn
                  title="Other Links"
                  links={[
                    ["Answer Key", "/answer-key"],
                    ["Admission", "/admission"],
                    ["Syllabus", "/syllabus"],
                  ]}
                />
              </div>
              <div className="border-t border-blue-900 mt-5 pt-4 text-center">
                <p className="text-[10px] text-slate-400">
                  Copyright © {new Date().getFullYear()} | BharatJobs.com
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, text, active = false }) => (
  <Link
    to={to}
    className={`px-3 sm:px-4 py-[11px] text-[12px] sm:text-[13px] text-white no-underline ${
      active ? "bg-[#17246b]" : "hover:bg-[#17246b]"
    }`}
  >
    {text}
  </Link>
);

const Category = ({ to, label, count, icon }) => (
  <Link to={to} className="bj-category">
    <span>{icon}</span>
    <div>
      <b>{label}</b>
      <small>{count ? `${count} updates` : "Browse now"}</small>
    </div>
    <i>→</i>
  </Link>
);

const PostRow = ({ post }) => (
  <Link to={`/post/${post.slug}`} className="bj-post-row">
    <span className="bj-post-arrow">›</span>
    <div>
      <b>{post.title}</b>
      {isNew(post) && <em>NEW</em>}
    </div>
  </Link>
);

const MiniSection = ({ title, link, posts }) => (
  <section className="bj-mini">
    <div className="bj-mini-head">
      <b>{title}</b>
      <Link to={link}>View all</Link>
    </div>
    {posts.length > 0 ? posts.map((post) => <PostRow key={post._id} post={post} />) : <Empty />}
  </section>
);

const Empty = ({ text = "No updates available" }) => (
  <div className="bj-empty">{text}</div>
);

const isNew = (post) => {
  const date = new Date(post.publishedAt || post.createdAt || 0);
  return date.getTime() > 0 && Date.now() - date.getTime() <= 3 * 86400000;
};

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="font-bold text-sm">{title}</h3>
    <div className="mt-2 space-y-1 text-[11px]">
      {links.map(([label, path]) => (
        <Link
          key={path}
          to={path}
          className="block text-slate-300 hover:text-white no-underline"
        >
          {label}
        </Link>
      ))}
    </div>
  </div>
);

export default Home;
