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
      setPosts(data.filter((post) => post.status === "published" && post.isDeleted !== true).sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0)));
    } catch (error) { console.error("Home posts error:", error); }
    finally { setLoading(false); }
  };

  const getPosts = (type, limit = 12) => posts.filter((post) => post.type === type).slice(0, limit);
  const featuredPosts = useMemo(() => {
    const featured = posts.filter((post) => post.featured === true);
    return featured.length ? featured.slice(0, 8) : posts.slice(0, 8);
  }, [posts]);
  const searchResults = useMemo(() => {
    const value = search.trim().toLowerCase();
    return value ? posts.filter((post) => post.title?.toLowerCase().includes(value)).slice(0, 10) : [];
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
        <meta property="og:type" content="website" /><meta property="og:title" content={seoTitle} /><meta property="og:description" content={seoDescription} /><meta property="og:url" content={siteUrl} /><meta property="og:site_name" content="BharatJobs" />
        <meta name="twitter:card" content="summary" /><meta name="twitter:title" content={seoTitle} /><meta name="twitter:description" content={seoDescription} />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "BharatJobs", url: siteUrl, description: seoDescription, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?search={search_term_string}` }, "query-input": "required name=search_term_string" } })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "BharatJobs", url: siteUrl })}</script>
      </Helmet>

      <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">
        <div className="w-full max-w-[1000px] mx-auto bg-white min-h-screen">
          {/* HEADER — unchanged */}
          <header className="bg-[#d40000]"><div className="h-[105px] flex flex-col items-center justify-center text-center px-3"><Link to="/" className="no-underline"><h1 className="text-[30px] sm:text-[40px] font-extrabold text-white uppercase leading-none">BHARAT JOBS</h1><p className="text-white text-[12px] sm:text-[14px] mt-2 font-bold">BharatJobs.com</p></Link></div></header>
          <nav className="bg-[#050d52]"><div className="flex flex-wrap justify-center"><NavItem to="/" text="Home" active /><NavItem to="/jobs" text="Latest Job" /><NavItem to="/admit-card" text="Admit Card" /><NavItem to="/results" text="Result" /><NavItem to="/admission" text="Admission" /><NavItem to="/syllabus" text="Syllabus" /><NavItem to="/answer-key" text="Answer Key" /><NavItem to="/contact" text="Contact Us" /></div></nav>

          {/* HOME CONTENT */}
          <div className="px-3 sm:px-5 pt-3">
            <div className="bg-white border border-slate-200 rounded-md px-4 py-3 text-center"><p className="text-[11px] sm:text-[12px] leading-5 text-slate-700 m-0">BharatJobs Official Website - Get Online Form, Results, Admit Card, Answer Key, Syllabus, Career News, Sarkari Yojana, Scholarship, Sarkari Notice and Latest Government Jobs.</p></div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] font-bold"><span className="inline-flex items-center gap-1 text-slate-700"><span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> LIVE UPDATES</span><span className="text-slate-300">|</span><a href="#" className="text-green-700 no-underline">Join WhatsApp Channel</a><span className="text-slate-300">|</span><a href="#" className="text-blue-700 underline">BharatJobs Tools</a></div>

            {/* Search */}
            <div className="mt-4 border border-[#050d52] rounded-md overflow-hidden shadow-sm">
              <div className="bg-[#050d52] text-white px-3 py-2 text-[13px] font-bold">Search Government Jobs & Exam Updates</div>
              <form onSubmit={(e) => e.preventDefault()} className="flex bg-white p-2">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type job name, exam, department or result..." className="flex-1 h-[40px] border border-slate-300 border-r-0 px-3 text-[12px] outline-none focus:border-[#000080]" />
                <button type="submit" className="w-[82px] h-[40px] bg-[#d40000] text-white text-[12px] font-bold">Search</button>
              </form>
            </div>

            {search.trim() ? (
              <section className="mt-4 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm"><SectionTitle>Search Results</SectionTitle>{searchResults.length ? searchResults.map((post) => <PostItem key={post._id} post={post} />) : <div className="text-center py-7 text-xs text-slate-500">No matching posts found.</div>}</section>
            ) : (
              <>
                {/* Quick navigation */}
                <section className="mt-4">
                  <SectionTitle>Quick Access</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                    <QuickCard to="/jobs" title="Latest Jobs" desc="New vacancies" number={getPosts("job").length} />
                    <QuickCard to="/results" title="Results" desc="Exam results" number={getPosts("result").length} />
                    <QuickCard to="/admit-card" title="Admit Card" desc="Download card" number={getPosts("admit-card").length} />
                    <QuickCard to="/answer-key" title="Answer Key" desc="Official keys" number={getPosts("answer-key").length} />
                    <QuickCard to="/admission" title="Admission" desc="Applications" number={getPosts("admission").length} />
                  </div>
                </section>

                {/* Important updates */}
                {featuredPosts.length > 0 && <section className="mt-4"><SectionTitle>Important Updates</SectionTitle><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">{featuredPosts.map((post, index) => { const colors = ["bg-[#e53935]", "bg-[#fb8c00]", "bg-[#00897b]", "bg-[#1e88e5]", "bg-[#8e24aa]", "bg-[#d81b60]", "bg-[#43a047]", "bg-[#3949ab]"]; return <Link key={post._id} to={`/post/${post.slug}`} className={`${colors[index % colors.length]} min-h-[50px] rounded-sm flex items-center justify-center text-center text-white px-2 py-2 text-[10px] sm:text-[11px] font-bold leading-4 no-underline hover:opacity-90`}>{post.title}</Link>; })}</div></section>}

                {loading ? <div className="text-center py-10 text-sm text-slate-500">Loading...</div> : <main className="mt-5">
                  {/* Main information area */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
                    <div className="lg:col-span-2"><HomeSection title="Latest Jobs" subtitle="Newest government recruitment notifications" posts={getPosts("job")} view="/jobs" tone="blue" /></div>
                    <div className="space-y-3"><HomeSection title="Results" subtitle="Latest exam results" posts={getPosts("result")} view="/results" tone="green" limit={7} /><HomeSection title="Admit Cards" subtitle="Download admit cards" posts={getPosts("admit-card")} view="/admit-card" tone="orange" limit={7} /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><HomeSection title="Answer Key" subtitle="Official answer keys and solutions" posts={getPosts("answer-key")} view="/answer-key" tone="purple" /><HomeSection title="Admission" subtitle="Admission and application updates" posts={getPosts("admission")} view="/admission" tone="red" /></div>

                  {posts.length > 0 && <section className="mt-4 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm"><SectionTitle>Latest Posts</SectionTitle><div className="grid grid-cols-1 sm:grid-cols-2 px-2 py-1">{posts.slice(0, 16).map((post) => <PostItem key={post._id} post={post} />)}</div></section>}
                </main>}

                <section className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoCard title="Why use BharatJobs?" items={["Latest government recruitment updates", "Results and admit card notifications", "Answer keys, syllabus and admission updates", "Easy access to official notification links"]} />
                  <InfoCard title="Important Notice" items={["Always check the official notification before applying.", "Verify eligibility, dates, fees and documents from the concerned department.", "BharatJobs is an informational platform and does not represent any government department."]} />
                </section>

                <section className="mt-4 bg-white border border-slate-200 rounded-md p-4"><div className="text-center"><h2 className="text-[17px] font-bold text-slate-800">Top BharatJobs Pages</h2></div><div className="flex flex-wrap justify-center gap-x-2 text-[12px] leading-7 mt-2"><Link to="/jobs" className="text-blue-700 hover:underline">Latest Jobs</Link><span>|</span><Link to="/results" className="text-blue-700 hover:underline">Government Results</Link><span>|</span><Link to="/admit-card" className="text-blue-700 hover:underline">Admit Card</Link><span>|</span><Link to="/answer-key" className="text-blue-700 hover:underline">Answer Key</Link><span>|</span><Link to="/admission" className="text-blue-700 hover:underline">Admission</Link></div></section>
                <section className="mt-4 bg-white border border-slate-200 rounded-md p-4"><h2 className="text-[18px] font-bold text-slate-800">Latest Government Jobs</h2><p className="text-[12px] leading-6 text-slate-700 mt-2 mb-0">BharatJobs provides information about latest government recruitment, Sarkari jobs, online forms, examination results, admit cards, answer keys, admissions and other important government notifications.</p><h2 className="text-[18px] font-bold text-slate-800 mt-5">Sarkari Result and Government Jobs</h2><p className="text-[12px] leading-6 text-slate-700 mt-2 mb-0">Candidates can use BharatJobs to find recruitment notifications and examination updates from various government departments, recruitment boards and organizations.</p></section>
              </>
            )}
          </div>

          {/* FOOTER — unchanged */}
          <footer className="bg-[#050d52] text-white mt-7"><div className="px-4 py-6"><div className="grid grid-cols-1 sm:grid-cols-3 gap-5"><div><h3 className="font-bold text-base">BharatJobs</h3><p className="text-[11px] text-slate-300 mt-2 leading-5">Latest Government Jobs, Results, Admit Cards and Examination Notifications.</p></div><FooterColumn title="Important Links" links={[["Latest Jobs", "/jobs"], ["Results", "/results"], ["Admit Card", "/admit-card"]]} /><FooterColumn title="Other Links" links={[["Answer Key", "/answer-key"], ["Admission", "/admission"], ["Syllabus", "/syllabus"]]} /></div><div className="border-t border-blue-900 mt-5 pt-4 text-center"><p className="text-[10px] text-slate-400">Copyright © {new Date().getFullYear()} | BharatJobs.com</p></div></div></footer>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, text, active = false }) => <Link to={to} className={`px-3 sm:px-4 py-[11px] text-[12px] sm:text-[13px] text-white no-underline ${active ? "bg-[#17246b]" : "hover:bg-[#17246b]"}`}>{text}</Link>;

const SectionTitle = ({ children }) => <div className="bg-[#a90000] text-white text-center py-2"><h2 className="text-[17px] sm:text-[19px] font-bold">{children}</h2></div>;

const QuickCard = ({ to, title, desc, number }) => <Link to={to} className="bg-white border border-slate-200 rounded-md px-2 py-3 text-center no-underline hover:border-[#a90000] hover:shadow-sm transition-shadow"><div className="flex items-center justify-center gap-1"><strong className="text-[13px] text-slate-800">{title}</strong>{number > 0 && <span className="text-[9px] bg-[#d40000] text-white rounded-full px-1.5 py-0.5">{number}</span>}</div><span className="block text-[10px] text-slate-500 mt-1">{desc}</span><span className="block text-[10px] font-bold text-blue-700 mt-2">Open →</span></Link>;

const HomeSection = ({ title, subtitle, posts, view, tone = "blue", limit }) => {
  const visiblePosts = limit ? posts.slice(0, limit) : posts;
  const tones = { blue: "border-t-[#1e88e5]", green: "border-t-[#00897b]", orange: "border-t-[#fb8c00]", purple: "border-t-[#8e24aa]", red: "border-t-[#e53935]" };
  return <section className={`bg-white border border-slate-200 border-t-4 ${tones[tone] || tones.blue} rounded-md overflow-hidden shadow-sm`}>
    <div className="px-3 py-2 border-b border-slate-100"><div className="flex items-center justify-between gap-2"><h2 className="text-[16px] font-bold text-slate-800">{title}</h2>{posts.length > 0 && <span className="text-[9px] font-bold text-slate-500 uppercase">{posts.length} Updates</span>}</div><p className="text-[10px] text-slate-500 mt-1">{subtitle}</p></div>
    <div className="px-2 py-1">{visiblePosts.length === 0 ? <div className="text-center text-[11px] text-slate-500 py-6">No updates available</div> : visiblePosts.map((post) => <PostItem key={post._id} post={post} />)}</div>
    {posts.length > 0 && <div className="px-3 py-2 bg-slate-50 border-t border-slate-100"><Link to={view} className="flex justify-between items-center text-[11px] font-bold text-blue-700 hover:text-red-700 no-underline"><span>View all {title}</span><span>→</span></Link></div>}
  </section>;
};

const PostItem = ({ post }) => { const isNew = checkNew(post); return <Link to={`/post/${post.slug}`} className="flex items-start gap-2 py-[6px] px-1 border-b border-slate-100 text-[11px] leading-[17px] text-blue-700 hover:text-red-700 hover:bg-slate-50 hover:underline no-underline"><span className="text-[#b30000] font-bold flex-shrink-0">»</span><span className="flex-1">{post.title}{isNew && <span className="text-red-600 text-[9px] font-extrabold ml-1">NEW</span>}</span></Link>; };
const checkNew = (post) => { const date = new Date(post.publishedAt || post.createdAt || 0); return date.getTime() ? Date.now() - date.getTime() <= 3 * 24 * 60 * 60 * 1000 : false; };
const InfoCard = ({ title, items }) => <section className="bg-white border border-slate-200 rounded-md p-4"><h2 className="text-[16px] font-bold text-slate-800 border-b border-slate-200 pb-2">{title}</h2><ul className="mt-2 pl-4 space-y-1.5">{items.map((item) => <li key={item} className="text-[11px] leading-5 text-slate-600">{item}</li>)}</ul></section>;
const FooterColumn = ({ title, links }) => <div><h3 className="font-bold text-sm">{title}</h3><div className="mt-2 space-y-1 text-[11px]">{links.map(([label, path]) => <Link key={path} to={path} className="block text-slate-300 hover:text-white no-underline">{label}</Link>)}</div></div>;

export default Home;
