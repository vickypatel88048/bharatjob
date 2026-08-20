import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Home.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`);
      const data = res.data?.posts || [];
      setPosts(data.filter((p) => p.status === "published" && p.isDeleted !== true).sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0)));
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally { setLoading(false); }
  };

  const byType = (type, limit = 10) => posts.filter((post) => post.type === type).slice(0, limit);
  const featured = useMemo(() => posts.filter((post) => post.featured === true).slice(0, 6), [posts]);
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return posts.filter((post) => post.title?.toLowerCase().includes(query)).slice(0, 15);
  }, [search, posts]);
  const count = (type) => posts.filter((post) => post.type === type).length;
  const isSearching = search.trim().length > 0;

  return (
    <>
      <Helmet>
        <title>BharatJobs - Latest Government Jobs, Results & Admit Card</title>
        <meta name="description" content="Latest government jobs, results, admit cards, answer keys, admissions and recruitment notifications on BharatJobs." />
      </Helmet>

      <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">
        <div className="w-full max-w-[1000px] mx-auto bg-white min-h-screen">
          {/* HEADER — unchanged */}
          <header className="bg-[#d40000]">
            <div className="h-[105px] flex flex-col items-center justify-center text-center px-3">
              <Link to="/" className="no-underline"><h1 className="text-[30px] sm:text-[40px] font-extrabold text-white uppercase leading-none">BHARAT JOBS</h1><p className="text-white text-[12px] sm:text-[14px] mt-2 font-bold">BharatJobs.com</p></Link>
            </div>
          </header>
          <nav className="bg-[#050d52]"><div className="flex flex-wrap justify-center">
            <NavItem to="/" text="Home" active /><NavItem to="/jobs" text="Latest Job" /><NavItem to="/admit-card" text="Admit Card" /><NavItem to="/results" text="Result" /><NavItem to="/admission" text="Admission" /><NavItem to="/syllabus" text="Syllabus" /><NavItem to="/answer-key" text="Answer Key" /><NavItem to="/contact" text="Contact Us" />
          </div></nav>

          <main className="bj-home">
            <div className="bj-search">
              <div><b>Search Government Updates</b><span>Find jobs, results, admit cards and exams</span></div>
              <form onSubmit={(event) => event.preventDefault()}>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search job, exam, department or result..." />
                {search && <button type="button" onClick={() => setSearch("")}>×</button>}
                <button type="submit">Search</button>
              </form>
            </div>

            {!isSearching ? <>
              <div className="bj-quick-links">
                <QuickLink to="/jobs" title="Latest Jobs" value={count("job")} tone="red" />
                <QuickLink to="/results" title="Results" value={count("result")} tone="blue" />
                <QuickLink to="/admit-card" title="Admit Card" value={count("admit-card")} tone="green" />
                <QuickLink to="/answer-key" title="Answer Key" value={count("answer-key")} tone="orange" />
                <QuickLink to="/admission" title="Admission" value={count("admission")} tone="purple" />
              </div>

              <div className="bj-notice-bar"><strong>Important:</strong><span>Check official notification, eligibility, dates and fees before applying.</span></div>

              <section className="bj-important">
                <div className="bj-section-title"><div><small>BHARATJOBS UPDATES</small><h2>Important Updates</h2></div><Link to="/jobs">View All</Link></div>
                <div className="bj-update-grid">
                  {featured.length ? featured.map((post, index) => <Link className="bj-update-item" key={post._id} to={`/post/${post.slug}`}><span>{String(index + 1).padStart(2, "0")}</span><b>{post.title}</b>{isNew(post) && <em>NEW</em>}</Link>) : <Empty text="No featured updates available" />}
                </div>
              </section>

              {loading ? <div className="bj-loading">Loading latest updates...</div> : <>
                <div className="bj-main-heading"><span>GOVERNMENT RECRUITMENT</span><h2>Latest Government Jobs</h2><Link to="/jobs">View All Jobs →</Link></div>
                <section className="bj-portal-grid">
                  <PortalSection title="Latest Jobs" link="/jobs" posts={byType("job", 10)} />
                  <PortalSection title="Latest Results" link="/results" posts={byType("result", 8)} />
                  <PortalSection title="Admit Card" link="/admit-card" posts={byType("admit-card", 8)} />
                </section>
                <section className="bj-portal-grid bj-lower-grid">
                  <PortalSection title="Answer Key" link="/answer-key" posts={byType("answer-key", 8)} />
                  <PortalSection title="Admission" link="/admission" posts={byType("admission", 8)} />
                  <PortalSection title="Syllabus" link="/syllabus" posts={byType("syllabus", 8)} />
                </section>
                <div className="bj-info-strip"><div><b>Government Job Alerts</b><span>Recruitment, results and exam updates in one place.</span></div><div><b>Apply Carefully</b><span>Always verify details from the official notification.</span></div></div>
              </>}
            </> : <section className="bj-search-results"><div className="bj-section-title"><div><small>SEARCH</small><h2>Search Results</h2></div><b>{searchResults.length} found</b></div>{searchResults.length ? searchResults.map((post) => <PostRow key={post._id} post={post} />) : <Empty text="No matching posts found." />}</section>}
          </main>

          {/* FOOTER — unchanged */}
          <footer className="bg-[#050d52] text-white mt-7">
            <div className="px-4 py-6"><div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div><h3 className="font-bold text-base">BharatJobs</h3><p className="text-[11px] text-slate-300 mt-2 leading-5">Latest Government Jobs, Results, Admit Cards and Examination Notifications.</p></div>
              <FooterColumn title="Important Links" links={[["Latest Jobs", "/jobs"],["Results", "/results"],["Admit Card", "/admit-card"]]} />
              <FooterColumn title="Other Links" links={[["Answer Key", "/answer-key"],["Admission", "/admission"],["Syllabus", "/syllabus"]]} />
            </div><div className="border-t border-blue-900 mt-5 pt-4 text-center"><p className="text-[10px] text-slate-400">Copyright © {new Date().getFullYear()} | BharatJobs.com</p></div></div>
          </footer>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, text, active = false }) => <Link to={to} className={`px-3 sm:px-4 py-[11px] text-[12px] sm:text-[13px] text-white no-underline ${active ? "bg-[#17246b]" : "hover:bg-[#17246b]"}`}>{text}</Link>;
const QuickLink = ({ to, title, value, tone }) => <Link to={to} className={`bj-quick ${tone}`}><strong>{title}</strong><span>{value || 0} Updates</span></Link>;
const PortalSection = ({ title, link, posts }) => <section className="bj-portal-section"><div className="bj-portal-head"><h3>{title}</h3><Link to={link}>View All</Link></div>{posts.length ? posts.map((post) => <PostRow key={post._id} post={post} />) : <Empty />}</section>;
const PostRow = ({ post }) => <Link to={`/post/${post.slug}`} className="bj-post-row"><span className="bj-post-arrow">›</span><div><b>{post.title}</b>{isNew(post) && <em>NEW</em>}</div></Link>;
const Empty = ({ text = "No updates available" }) => <div className="bj-empty">{text}</div>;
const isNew = (post) => { const date = new Date(post.publishedAt || post.createdAt || 0); return date.getTime() > 0 && Date.now() - date.getTime() <= 3 * 86400000; };
const FooterColumn = ({ title, links }) => <div><h3 className="font-bold text-sm">{title}</h3><div className="mt-2 space-y-1 text-[11px]">{links.map(([label, path]) => <Link key={path} to={path} className="block text-slate-300 hover:text-white no-underline">{label}</Link>)}</div></div>;

export default Home;
