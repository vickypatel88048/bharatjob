import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API = "http://localhost:5000/api";
const SITE_URL = "https://bharatjobs.com";

function Syllabus() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSyllabus();
  }, []);

  const loadSyllabus = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/posts`);

      const data = response.data?.posts || [];

      const syllabusPosts = data
        .filter(
          (post) =>
            post.type === "syllabus" &&
            post.status === "published" &&
            post.isDeleted !== true
        )
        .sort((a, b) => {
          const dateA = new Date(
            a.publishedAt || a.createdAt || 0
          );

          const dateB = new Date(
            b.publishedAt || b.createdAt || 0
          );

          return dateB - dateA;
        });

      setPosts(syllabusPosts);
    } catch (error) {
      console.error("Failed to load syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return posts;

    return posts.filter((post) =>
      post.title?.toLowerCase().includes(value)
    );
  }, [posts, search]);

  return (
    <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">

      {/* =================================================
          SEO
      ================================================= */}

      <Helmet>
        <title>
          Latest Government Exam Syllabus 2026 | Exam Pattern | BharatJobs
        </title>

        <meta
          name="description"
          content="Check latest government exam syllabus 2026, exam pattern, subject wise syllabus and recruitment exam updates. Get Sarkari exam syllabus and preparation details on BharatJobs."
        />

        <meta
          name="keywords"
          content="government exam syllabus 2026, latest exam syllabus, sarkari exam syllabus, government job syllabus, exam pattern 2026, subject wise syllabus, recruitment exam syllabus, competitive exam syllabus, BharatJobs syllabus"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <meta
          name="author"
          content="BharatJobs"
        />

        <link
          rel="canonical"
          href={`${SITE_URL}/syllabus`}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content="Latest Government Exam Syllabus 2026 | BharatJobs"
        />

        <meta
          property="og:description"
          content="Find latest government exam syllabus, exam pattern and subject wise syllabus updates on BharatJobs."
        />

        <meta
          property="og:url"
          content={`${SITE_URL}/syllabus`}
        />

        <meta
          property="og:site_name"
          content="BharatJobs"
        />

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary"
        />

        <meta
          name="twitter:title"
          content="Latest Government Exam Syllabus 2026 | BharatJobs"
        />

        <meta
          name="twitter:description"
          content="Latest government exam syllabus, exam pattern and subject wise syllabus updates."
        />

        {/* Structured Data */}

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Latest Government Exam Syllabus 2026",
            description:
              "Latest government examination syllabus, exam pattern and subject wise syllabus updates.",
            url: `${SITE_URL}/syllabus`,
            isPartOf: {
              "@type": "WebSite",
              name: "BharatJobs",
              url: SITE_URL,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Syllabus",
                  item: `${SITE_URL}/syllabus`,
                },
              ],
            },
          })}
        </script>
      </Helmet>

      {/* =================================================
          WEBSITE CONTAINER
      ================================================= */}

      <div className="w-full max-w-[1000px] mx-auto min-h-screen bg-white">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="bg-[#d40000]">

          <div className="h-[105px] flex flex-col items-center justify-center text-center px-3">

            <Link
              to="/"
              className="no-underline"
            >

              <h1 className="text-[30px] sm:text-[40px] font-extrabold text-white uppercase leading-none">
                BHARAT JOBS
              </h1>

              <p className="text-white text-[12px] sm:text-[14px] mt-2 font-bold">
                BharatJobs.com
              </p>

            </Link>

          </div>

        </header>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="bg-[#050d52]">

          <div className="flex flex-wrap justify-center">

            <NavItem
              to="/"
              text="Home"
            />

            <NavItem
              to="/jobs"
              text="Latest Job"
            />

            <NavItem
              to="/admit-card"
              text="Admit Card"
            />

            <NavItem
              to="/results"
              text="Result"
            />

            <NavItem
              to="/admission"
              text="Admission"
            />

            <NavItem
              to="/syllabus"
              text="Syllabus"
              active
            />

            <NavItem
              to="/answer-key"
              text="Answer Key"
            />

            <NavItem
              to="/contact"
              text="Contact Us"
            />

          </div>

        </nav>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="px-3 sm:px-5 py-5">

          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <nav
            aria-label="Breadcrumb"
            className="text-[11px] sm:text-[12px] mb-4"
          >

            <Link
              to="/"
              className="text-blue-700 hover:underline"
            >
              Home
            </Link>

            <span className="mx-2 text-slate-500">
              ›
            </span>

            <span className="text-slate-600">
              Syllabus
            </span>

          </nav>

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <section className="border border-slate-300">

            <div className="bg-[#a90000] text-white text-center py-2">

              <h1 className="text-[18px] sm:text-[20px] font-bold">
                Latest Government Exam Syllabus 2026
              </h1>

            </div>

            <div className="text-center px-4 py-3">

              <p className="text-[11px] sm:text-[12px] text-slate-600 leading-5">
                Check latest government exam syllabus,
                exam pattern, subject wise syllabus and
                recruitment examination updates.
              </p>

            </div>

          </section>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="flex max-w-[650px] mx-auto mt-5">

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search Government Exam Syllabus..."
              aria-label="Search Government Exam Syllabus"
              className="flex-1 h-[40px] border border-slate-300 px-3 text-[12px] outline-none focus:border-[#000080]"
            />

            <button
              type="button"
              className="w-[85px] h-[40px] bg-[#000080] text-white text-[12px] font-bold"
            >
              Search
            </button>

          </div>

          {/* =================================================
              SYLLABUS LIST
          ================================================= */}

          <section className="mt-5 border border-[#bdbdbd]">

            <div className="bg-[#a90000] text-white text-center py-2">

              <h2 className="text-[17px] font-bold">
                Latest Government Exam Syllabus
              </h2>

            </div>

            {loading ? (

              <div className="text-center py-10 text-sm text-slate-500">
                Loading syllabus...
              </div>

            ) : filteredPosts.length === 0 ? (

              <div className="text-center py-10 text-[12px] text-slate-500">
                No syllabus found.
              </div>

            ) : (

              <div>

                {filteredPosts.map((post) => (

                  <Link
                    key={post._id}
                    to={`/post/${post.slug}`}
                    className="flex items-start gap-2 px-3 py-2 border-b border-dotted border-slate-300 text-[12px] sm:text-[13px] leading-5 text-blue-700 hover:bg-[#f5f5ff] hover:text-red-700 hover:underline no-underline"
                  >

                    <span className="text-red-600 font-bold">
                      »
                    </span>

                    <span className="flex-1">

                      {post.title}

                      {isNew(post) && (
                        <span className="ml-2 text-[9px] font-extrabold text-red-600">
                          NEW
                        </span>
                      )}

                    </span>

                  </Link>

                ))}

              </div>

            )}

          </section>

          {/* =================================================
              SEO CONTENT
          ================================================= */}

          <section className="mt-6 border border-slate-300">

            <div className="bg-[#000080] text-white text-center py-2">

              <h2 className="text-[17px] font-bold">
                Government Exam Syllabus 2026
              </h2>

            </div>

            <div className="px-4 py-4 text-[12px] leading-6 text-slate-700">

              <p>
                BharatJobs provides the latest
                government exam syllabus, examination
                pattern and subject wise syllabus for
                various competitive and recruitment
                examinations.
              </p>

              <p className="mt-2">
                Candidates can check the latest syllabus
                updates for government jobs and competitive
                examinations. The syllabus may include
                subjects, topics, examination pattern,
                marking scheme and other important details.
              </p>

              <p className="mt-2">
                Before starting exam preparation, candidates
                should carefully check the latest official
                notification and syllabus released by the
                concerned examination authority.
              </p>

            </div>

          </section>

          {/* =================================================
              IMPORTANT PAGES
          ================================================= */}

          <section className="mt-6 border border-slate-300">

            <div className="bg-[#050d52] text-white text-center py-2">

              <h2 className="text-[16px] font-bold">
                Important BharatJobs Pages
              </h2>

            </div>

            <div className="px-4 py-4 text-center text-[12px] leading-7">

              <Link
                to="/jobs"
                className="text-blue-700 hover:underline"
              >
                Latest Government Jobs
              </Link>

              {" | "}

              <Link
                to="/results"
                className="text-blue-700 hover:underline"
              >
                Government Results
              </Link>

              {" | "}

              <Link
                to="/admit-card"
                className="text-blue-700 hover:underline"
              >
                Admit Card
              </Link>

              {" | "}

              <Link
                to="/answer-key"
                className="text-blue-700 hover:underline"
              >
                Answer Key
              </Link>

              {" | "}

              <Link
                to="/admission"
                className="text-blue-700 hover:underline"
              >
                Admission
              </Link>

            </div>

          </section>

        </main>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="bg-[#050d52] text-white mt-7">

          <div className="px-4 py-6 text-center">

            <h2 className="text-lg font-bold">
              BharatJobs
            </h2>

            <p className="text-[11px] text-slate-300 mt-2">
              Latest Government Jobs, Results,
              Admit Cards and Recruitment Notifications.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4 text-[11px]">

              <Link
                to="/"
                className="text-slate-300 hover:text-white no-underline"
              >
                Home
              </Link>

              <Link
                to="/jobs"
                className="text-slate-300 hover:text-white no-underline"
              >
                Latest Jobs
              </Link>

              <Link
                to="/results"
                className="text-slate-300 hover:text-white no-underline"
              >
                Results
              </Link>

              <Link
                to="/admit-card"
                className="text-slate-300 hover:text-white no-underline"
              >
                Admit Card
              </Link>

              <Link
                to="/admission"
                className="text-slate-300 hover:text-white no-underline"
              >
                Admission
              </Link>

              <Link
                to="/syllabus"
                className="text-slate-300 hover:text-white no-underline"
              >
                Syllabus
              </Link>

              <Link
                to="/answer-key"
                className="text-slate-300 hover:text-white no-underline"
              >
                Answer Key
              </Link>

            </div>

            <div className="border-t border-blue-900 mt-5 pt-4">

              <p className="text-[10px] text-slate-400">
                Copyright © {new Date().getFullYear()} |
                BharatJobs.com
              </p>

            </div>

          </div>

        </footer>

      </div>
    </div>
  );
}

/* =========================================================
   NAV ITEM
========================================================= */

function NavItem({
  to,
  text,
  active = false,
}) {
  return (
    <Link
      to={to}
      className={`px-3 sm:px-4 py-[11px] text-[12px] sm:text-[13px] text-white no-underline ${
        active
          ? "bg-[#17246b]"
          : "hover:bg-[#17246b]"
      }`}
    >
      {text}
    </Link>
  );
}

/* =========================================================
   NEW POST
========================================================= */

function isNew(post) {
  const date = new Date(
    post.publishedAt ||
      post.createdAt ||
      0
  );

  if (!date.getTime()) {
    return false;
  }

  const difference =
    Date.now() - date.getTime();

  return (
    difference >= 0 &&
    difference <=
      3 * 24 * 60 * 60 * 1000
  );
}

export default Syllabus;