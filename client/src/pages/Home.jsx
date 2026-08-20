import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API = "http://localhost:5000/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/posts`);
      const data = response.data?.posts || [];
      const publishedPosts = data
        .filter((post) => post.status === "published" && post.isDeleted !== true)
        .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0));
      setPosts(publishedPosts);
    } catch (error) {
      console.error("Home posts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPosts = (type) => posts.filter((post) => post.type === type).slice(0, 12);

  const featuredPosts = useMemo(() => {
    const featured = posts.filter((post) => post.featured === true);
    return featured.length > 0 ? featured.slice(0, 8) : posts.slice(0, 7);
  }, [posts]);

  const searchResults = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return [];
    return posts.filter((post) => post.title?.toLowerCase().includes(value)).slice(0, 10);
  }, [search, posts]);

  const siteUrl = window.location.origin;
  const seoTitle = "BharatJobs - Latest Government Jobs, Results, Admit Card & Sarkari Updates";
  const seoDescription = "BharatJobs provides the latest government jobs, Sarkari jobs, exam results, admit cards, answer keys, syllabus, admissions and recruitment notifications.";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="BharatJobs, Government Jobs, Sarkari Jobs, Latest Government Jobs, Sarkari Result, Admit Card, Government Result, Answer Key, Syllabus, Admission, Recruitment" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content="BharatJobs" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "BharatJobs", url: siteUrl, description: seoDescription, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?search={search_term_string}` }, "query-input": "required name=search_term_string" } })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "BharatJobs", url: siteUrl })}</script>
      </Helmet>

      <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">
        <div className="w-full max-w-[1000px] mx-auto bg-white min-h-screen">
          {/* HEADER — kept unchanged */}
          <header className="bg-[#d40000]">
            <div className="h-[105px] flex flex-col items-center justify-center text-center px-3">
              <Link to="/" className="no-underline">
                <h1 className="text-[30px] sm:text-[40px] font-extrabold text-white uppercase leading-none">BHARAT JOBS</h1>
                <p className="text-white text-[12px] sm:text-[14px] mt-2 font-bold">BharatJobs.com</p>
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

          {/* HOME CONTENT */}
          <div className="px-3 sm:px-5 pt-3">
            <div className="bg-white border border-slate-200 rounded-md px-4 py-3 text-center shadow-sm">
              <p className="text-[11px] sm:text-[12px] leading-5 text-slate-700 m-0">
                BharatJobs Official Website - Get Online Form, Results, Admit Card, Answer Key, Syllabus,
                Career News, Sarkari Yojana, Scholarship, Sarkari Notice and Latest Government Jobs.
              </p>
            </div>

            <div className="flex justify-center mt-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> LIVE UPDATES
              </span>
            </div>

            <div className="text-center mt-2">
              <a href="#" className="inline-block bg-[#20c76a] text-white text-[11px] font-bold px-5 py-[6px] rounded-full no-underline shadow-sm">Join WhatsApp Channel</a>
            </div>

            <div className="text-center mt-2">
              <a href="#" className="text-blue-700 underline text-[13px] font-bold">BharatJobs Tools</a>
            </div>

            <div className="mt-4 bg-[#f8fafc] border border-slate-200 rounded-md p-2">
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-[700px] mx-auto bg-white border border-slate-300 rounded-sm overflow-hidden focus-within:border-[#000080]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Government Jobs, Results, Admit Cards..."
                  className="flex-1 h-[40px] border-0 px-3 text-[12px] outline-none"
                />
                <button type="submit" className="w-[85px] h-[40px] bg-[#000080] text-white text-[12px] font-bold">Search</button>
              </form>
            </div>

            {search.trim() && (
              <section className="mt-4 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                <SectionTitle>Search Results</SectionTitle>
                <div>
                  {searchResults.length === 0 ? <div className="text-center py-7 text-xs text-slate-500">No matching posts found.</div> : searchResults.map((post) => <PostItem key={post._id} post={post} />)}
                </div>
              </section>
            )}

            {!search.trim() && (
              <>
                {featuredPosts.length > 0 && (
                  <section className="mt-4">
                    <SectionTitle>Important Updates</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {featuredPosts.map((post, index) => {
                        const colors = ["bg-[#e53935]", "bg-[#fb8c00]", "bg-[#00897b]", "bg-[#1e88e5]", "bg-[#8e24aa]", "bg-[#d81b60]", "bg-[#43a047]", "bg-[#3949ab]"];
                        return <Link key={post._id} to={`/post/${post.slug}`} className={`${colors[index % colors.length]} min-h-[52px] rounded-sm flex items-center justify-center text-center text-white px-2 py-2 text-[10px] sm:text-[11px] font-bold leading-4 no-underline hover:opacity-90 shadow-sm`}>{post.title}</Link>;
                      })}
                    </div>
                  </section>
                )}

                <main className="mt-5">
                  {loading ? (
                    <div className="text-center py-10 text-sm text-slate-500">Loading...</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <HomeSection title="Latest Jobs" subtitle="New recruitment notifications" posts={getPosts("job")} view="/jobs" tone="blue" />
                        <HomeSection title="Results" subtitle="Latest exam results" posts={getPosts("result")} view="/results" tone="green" />
                        <HomeSection title="Admit Cards" subtitle="Download your admit card" posts={getPosts("admit-card")} view="/admit-card" tone="orange" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <HomeSection title="Answer Key" subtitle="Check official answer keys" posts={getPosts("answer-key")} view="/answer-key" tone="purple" />
                        <HomeSection title="Admission" subtitle="Admission & application updates" posts={getPosts("admission")} view="/admission" tone="red" />
                      </div>

                      {posts.length > 0 && (
                        <section className="mt-5 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                          <SectionTitle>Latest Posts</SectionTitle>
                          <div className="px-2 sm:px-3 py-1">
                            {posts.slice(0, 15).map((post) => <PostItem key={post._id} post={post} />)}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </main>

                <section className="mt-5 bg-[#f8fafc] border border-slate-200 rounded-md p-4">
                  <h2 className="text-[17px] font-bold text-slate-800 mb-2">BharatJobs 2026</h2>
                  <p className="text-[12px] leading-6 text-slate-700 m-0">
                    Find latest government job vacancies, Sarkari exam results, online forms, admit cards,
                    answer keys, syllabus, admission notifications and government recruitment updates.
                  </p>
                  <p className="text-[12px] leading-6 text-slate-700 mt-2 mb-0">
                    BharatJobs is an informational platform. Candidates should always verify the details from
                    the official notification and official website of the concerned department.
                  </p>
                </section>

                <section className="mt-4 bg-white border border-slate-200 rounded-md p-4">
                  <div className="text-center"><h2 className="text-[17px] font-bold text-slate-800">Top BharatJobs Pages</h2></div>
                  <div className="flex flex-wrap justify-center gap-x-2 text-[12px] leading-7 mt-2">
                    <Link to="/jobs" className="text-blue-700 hover:underline">Latest Jobs</Link><span>|</span>
                    <Link to="/results" className="text-blue-700 hover:underline">Government Results</Link><span>|</span>
                    <Link to="/admit-card" className="text-blue-700 hover:underline">Admit Card</Link><span>|</span>
                    <Link to="/answer-key" className="text-blue-700 hover:underline">Answer Key</Link><span>|</span>
                    <Link to="/admission" className="text-blue-700 hover:underline">Admission</Link>
                  </div>
                </section>

                <section className="mt-4 bg-white border border-slate-200 rounded-md p-4">
                  <h2 className="text-[18px] font-bold text-slate-800">Latest Government Jobs</h2>
                  <p className="text-[12px] leading-6 text-slate-700 mt-2 mb-0">
                    BharatJobs provides information about latest government recruitment, Sarkari jobs, online forms,
                    examination results, admit cards, answer keys, admissions and other important government notifications.
                  </p>
                  <h2 className="text-[18px] font-bold text-slate-800 mt-5">Sarkari Result and Government Jobs</h2>
                  <p className="text-[12px] leading-6 text-slate-700 mt-2 mb-0">
                    Candidates can use BharatJobs to find recruitment notifications and examination updates from various
                    government departments, recruitment boards and organizations.
                  </p>
                </section>
              </>
            )}
          </div>

          {/* FOOTER — kept unchanged */}
          <footer className="bg-[#050d52] text-white mt-7">
            <div className="px-4 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <h3 className="font-bold text-base">BharatJobs</h3>
                  <p className="text-[11px] text-slate-300 mt-2 leading-5">
                    Latest Government Jobs, Results, Admit Cards and Examination Notifications.
                  </p>
                </div>
                <FooterColumn title="Important Links" links={[["Latest Jobs", "/jobs"], ["Results", "/results"], ["Admit Card", "/admit-card"]]} />
                <FooterColumn title="Other Links" links={[["Answer Key", "/answer-key"], ["Admission", "/admission"], ["Syllabus", "/syllabus"]]} />
              </div>
              <div className="border-t border-blue-900 mt-5 pt-4 text-center">
                <p className="text-[10px] text-slate-400">Copyright ©{" "}{new Date().getFullYear()} | BharatJobs.com</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, text, active = false }) => (
  <Link to={to} className={`px-3 sm:px-4 py-[11px] text-[12px] sm:text-[13px] text-white no-underline ${active ? "bg-[#17246b]" : "hover:bg-[#17246b]"}`}>{text}</Link>
);

const SectionTitle = ({ children }) => (
  <div className="bg-[#a90000] text-white text-center py-2">
    <h2 className="text-[17px] sm:text-[19px] font-bold">{children}</h2>
  </div>
);

const HomeSection = ({ title, subtitle, posts, view, tone = "blue" }) => {
  const tones = {
    blue: "border-t-[#1e88e5]",
    green: "border-t-[#00897b]",
    orange: "border-t-[#fb8c00]",
    purple: "border-t-[#8e24aa]",
    red: "border-t-[#e53935]",
  };
  return (
    <section className={`bg-white border border-slate-200 border-t-4 ${tones[tone] || tones.blue} rounded-md overflow-hidden shadow-sm`}>
      <div className="px-3 py-2 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[16px] font-bold text-slate-800">{title}</h2>
          {posts.length > 0 && <span className="text-[9px] font-bold text-slate-500 uppercase">{posts.length} Updates</span>}
        </div>
        <p className="text-[10px] text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="px-2 py-1">
        {posts.length === 0 ? (
          <div className="text-center text-[11px] text-slate-500 py-6">No updates available</div>
        ) : posts.map((post) => <PostItem key={post._id} post={post} />)}
      </div>
      {posts.length > 0 && (
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
          <Link to={view} className="flex justify-between items-center text-[11px] font-bold text-blue-700 hover:text-red-700 no-underline">
            <span>View all updates</span><span>→</span>
          </Link>
        </div>
      )}
    </section>
  );
};

const PostItem = ({ post }) => {
  const isNew = checkNew(post);
  return (
    <Link to={`/post/${post.slug}`} className="flex items-start gap-2 py-[6px] px-1 border-b border-slate-100 text-[11px] leading-[17px] text-blue-700 hover:text-red-700 hover:bg-slate-50 hover:underline no-underline">
      <span className="text-[#b30000] font-bold flex-shrink-0">»</span>
      <span className="flex-1">{post.title}{isNew && <span className="text-red-600 text-[9px] font-extrabold ml-1">NEW</span>}</span>
    </Link>
  );
};

const checkNew = (post) => {
  const date = new Date(post.publishedAt || post.createdAt || 0);
  if (!date.getTime()) return false;
  return Date.now() - date.getTime() <= 3 * 24 * 60 * 60 * 1000;
};

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="font-bold text-sm">{title}</h3>
    <div className="mt-2 space-y-1 text-[11px]">
      {links.map(([label, path]) => <Link key={path} to={path} className="block text-slate-300 hover:text-white no-underline">{label}</Link>)}
    </div>
  </div>
);

export default Home;
