import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const getApiBase = () => {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return `${window.location.origin}/api`;
  }
  return "http://localhost:5000/api";
};

const API = getApiBase();

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API}/posts`);
        const data = Array.isArray(response.data) ? response.data : response.data?.posts || [];
        setPosts(
          data
            .filter((post) => post.status === "published" && post.isDeleted !== true)
            .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0))
        );
      } catch (error) {
        console.error("Home posts error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getPosts = (type) => posts.filter((post) => post.type === type).slice(0, 12);
  const featuredPosts = useMemo(() => {
    const featured = posts.filter((post) => post.featured === true);
    return featured.length ? featured.slice(0, 8) : posts.slice(0, 7);
  }, [posts]);
  const searchResults = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return [];
    return posts.filter((post) => post.title?.toLowerCase().includes(value)).slice(0, 10);
  }, [search, posts]);

  return (
    <>
      <Helmet>
        <title>BharatJobs - Latest Government Jobs, Results, Admit Card & Sarkari Updates</title>
        <meta name="description" content="BharatJobs provides latest government jobs, Sarkari jobs, results, admit cards, answer keys, syllabus, admissions and recruitment notifications." />
      </Helmet>

      <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">
        <div className="w-full max-w-[1000px] mx-auto bg-white min-h-screen">
          {/* Header - unchanged */}
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

          <div className="text-center px-5 py-3">
            <p className="text-[11px] sm:text-[12px] leading-5 text-slate-700">
              BharatJobs Official Website - Get Online Form, Results, Admit Card, Answer Key, Syllabus,
              Career News, Sarkari Yojana, Scholarship, Sarkari Notice and Latest Government Jobs.
            </p>
          </div>

          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold"><span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />LIVE</span>
          </div>
          <div className="text-center mt-2">
            <a href="#" className="inline-block bg-[#20c76a] text-white text-[11px] font-bold px-5 py-[6px] rounded-full no-underline">Join WhatsApp Channel</a>
          </div>
          <div className="text-center mt-2">
            <a href="#" className="text-blue-700 underline text-[13px] font-bold">BharatJobs Tools</a>
          </div>

          <div className="px-3 sm:px-5 mt-4">
            <form onSubmit={(e) => e.preventDefault()} className="flex max-w-[650px] mx-auto">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Government Jobs, Results, Admit Cards..." className="flex-1 h-[40px] border border-slate-300 px-3 text-[12px] outline-none focus:border-[#000080]" />
              <button type="submit" className="w-[85px] h-[40px] bg-[#000080] text-white text-[12px] font-bold">Search</button>
            </form>
          </div>

          {search.trim() ? (
            <section className="px-3 sm:px-5 mt-4">
              <SectionTitle>Search Results</SectionTitle>
              <div className="border border-slate-300 border-t-0">
                {searchResults.length ? searchResults.map((post) => <PostItem key={post._id} post={post} />) : <div className="text-center py-7 text-xs text-slate-500">No matching posts found.</div>}
              </div>
            </section>
          ) : (
            <>
              <section className="px-3 sm:px-5 mt-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[2px]">
                  {featuredPosts.map((post, index) => {
                    const colors = ["bg-[#e53935]", "bg-[#fb8c00]", "bg-[#00897b]", "bg-[#1e88e5]", "bg-[#8e24aa]", "bg-[#d81b60]", "bg-[#43a047]", "bg-[#3949ab]"];
                    return <Link key={post._id} to={`/post/${post.slug}`} className={`${colors[index % colors.length]} min-h-[42px] flex items-center justify-center text-center text-white px-2 py-2 text-[10px] sm:text-[11px] font-bold leading-4 no-underline hover:opacity-90`}>{post.title}</Link>;
                  })}
                </div>
              </section>

              <main className="px-3 sm:px-5 mt-5">
                {loading ? <div className="text-center py-10 text-sm text-slate-500">Loading...</div> : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[5px]">
                      <HomeSection title="Latest Jobs" posts={getPosts("job")} view="/jobs" />
                      <HomeSection title="Results" posts={getPosts("result")} view="/results" />
                      <HomeSection title="Admit Cards" posts={getPosts("admit-card")} view="/admit-card" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[5px] mt-[5px]">
                      <HomeSection title="Answer Key" posts={getPosts("answer-key")} view="/answer-key" />
                      <HomeSection title="Admission" posts={getPosts("admission")} view="/admission" />
                    </div>
                    {posts.length > 0 && <section className="mt-7"><SectionTitle>Latest Posts</SectionTitle><div className="border border-slate-300 border-t-0">{posts.slice(0, 15).map((post) => <PostItem key={post._id} post={post} />)}</div></section>}
                  </>
                )}
              </main>

              <section className="px-4 sm:px-6 mt-6">
                <p className="text-[12px] leading-6 text-slate-700"><strong>BharatJobs 2026 :</strong> Find latest government job vacancies, Sarkari exam results, online forms, admit cards, answer keys, syllabus, admission notifications and government recruitment updates.</p>
                <p className="text-[12px] leading-6 text-slate-700 mt-2">BharatJobs is an informational platform. Candidates should always verify the details from the official notification and official website of the concerned department.</p>
              </section>

              <section className="px-4 sm:px-6 mt-5">
                <div className="text-center"><h2 className="text-[17px] font-bold text-slate-800">Top BharatJobs Pages</h2></div>
                <div className="text-center text-[12px] leading-7 mt-2"><Link to="/jobs" className="text-blue-700 hover:underline">Latest Jobs</Link>{" | "}<Link to="/results" className="text-blue-700 hover:underline">Government Results</Link>{" | "}<Link to="/admit-card" className="text-blue-700 hover:underline">Admit Card</Link>{" | "}<Link to="/answer-key" className="text-blue-700 hover:underline">Answer Key</Link>{" | "}<Link to="/admission" className="text-blue-700 hover:underline">Admission</Link></div>
              </section>
            </>
          )}

          {/* Footer - unchanged */}
          <footer className="bg-[#050d52] text-white mt-7">
            <div className="px-4 py-6"><div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div><h3 className="font-bold text-base">BharatJobs</h3><p className="text-[11px] text-slate-300 mt-2 leading-5">Latest Government Jobs, Results, Admit Cards and Examination Notifications.</p></div>
              <FooterColumn title="Important Links" links={[["Latest Jobs", "/jobs"], ["Results", "/results"], ["Admit Card", "/admit-card"]]} />
              <FooterColumn title="Other Links" links={[["Answer Key", "/answer-key"], ["Admission", "/admission"], ["Syllabus", "/syllabus"]]} />
            </div><div className="border-t border-blue-900 mt-5 pt-4 text-center"><p className="text-[10px] text-slate-400">Copyright © {new Date().getFullYear()} | BharatJobs.com</p></div></div>
          </footer>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, text, active = false }) => <Link to={to} className={`px-3 sm:px-4 py-[11px] text-[12px] sm:text-[13px] text-white no-underline ${active ? "bg-[#17246b]" : "hover:bg-[#17246b]"}`}>{text}</Link>;
const SectionTitle = ({ children }) => <div className="bg-[#a90000] text-white text-center py-2"><h2 className="text-[17px] sm:text-[19px] font-bold">{children}</h2></div>;
const HomeSection = ({ title, posts, view }) => <section className="border border-[#bdbdbd] bg-white"><div className="bg-[#a90000] text-white text-center py-[5px]"><h2 className="text-[16px] font-bold">{title}</h2></div><div className="px-2 py-1">{posts.length ? posts.map((post) => <PostItem key={post._id} post={post} />) : <div className="text-center text-[11px] text-slate-500 py-6">No updates available</div>}</div>{posts.length > 0 && <div className="text-center py-2"><Link to={view} className="text-[11px] font-bold text-blue-700 hover:text-red-700 hover:underline no-underline">View More</Link></div>}</section>;
const PostItem = ({ post }) => <Link to={`/post/${post.slug}`} className="flex items-start gap-1 py-[4px] border-b border-[#dddddd] text-[11px] text-blue-700 hover:text-red-700 hover:bg-slate-50 no-underline"><span className="text-red-600 font-bold">›</span><span className="flex-1 leading-4">{post.title}</span>{checkNew(post) && <em className="not-italic bg-red-600 text-white text-[8px] px-1 font-bold">NEW</em>}</Link>;
const checkNew = (post) => { const date = new Date(post.publishedAt || post.createdAt || 0); return date.getTime() > 0 && Date.now() - date.getTime() <= 3 * 86400000; };
const FooterColumn = ({ title, links }) => <div><h3 className="font-bold text-sm">{title}</h3><div className="mt-2 space-y-1 text-[11px]">{links.map(([label, path]) => <Link key={path} to={path} className="block text-slate-300 hover:text-white no-underline">{label}</Link>)}</div></div>;

export default Home;
