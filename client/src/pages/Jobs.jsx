import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API = "http://localhost:5000/api";

function Jobs() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/posts`);

      const data = response.data?.posts || [];

      const jobs = data
        .filter(
          (post) =>
            post.type === "job" &&
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

      setPosts(jobs);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return posts;

    return posts.filter((post) =>
      post.title?.toLowerCase().includes(value)
    );
  }, [posts, search]);

  // =========================================================
  // SEO
  // =========================================================

  const siteUrl = window.location.origin;

  const pageTitle =
    "Latest Government Jobs 2026 - Sarkari Jobs & Recruitment | BharatJobs";

  const pageDescription =
    "Find the latest government jobs 2026, Sarkari jobs, recruitment notifications, online forms, vacancies, eligibility, important dates and government recruitment updates on BharatJobs.";

  const canonicalUrl = `${siteUrl}/jobs`;

  return (
    <>
      {/* =====================================================
          SEO
      ===================================================== */}

      <Helmet>
        <title>{pageTitle}</title>

        <meta
          name="description"
          content={pageDescription}
        />

        <meta
          name="keywords"
          content="Latest Government Jobs 2026, Government Jobs, Sarkari Jobs, Sarkari Naukri, Government Recruitment, Latest Jobs, Government Vacancy, Online Form, Recruitment Notification, BharatJobs"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large"
        />

        <link
          rel="canonical"
          href={canonicalUrl}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content={pageTitle}
        />

        <meta
          property="og:description"
          content={pageDescription}
        />

        <meta
          property="og:url"
          content={canonicalUrl}
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
          content={pageTitle}
        />

        <meta
          name="twitter:description"
          content={pageDescription}
        />

        {/* =====================================================
            COLLECTION PAGE STRUCTURED DATA
        ===================================================== */}

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",

            name: pageTitle,

            description: pageDescription,

            url: canonicalUrl,

            isPartOf: {
              "@type": "WebSite",
              name: "BharatJobs",
              url: siteUrl,
            },

            about: {
              "@type": "Thing",
              name: "Government Jobs",
            },
          })}
        </script>

        {/* =====================================================
            BREADCRUMB STRUCTURED DATA
        ===================================================== */}

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",

            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Latest Government Jobs",
                item: canonicalUrl,
              },
            ],
          })}
        </script>
      </Helmet>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">

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
              NAVBAR
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
                active
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
              CONTENT
          ================================================= */}

          <main className="px-3 sm:px-5 py-5">

            {/* =================================================
                TITLE
            ================================================= */}

            <section className="border border-slate-300">

              <div className="bg-[#a90000] text-white text-center py-2">

                <h1 className="text-[18px] sm:text-[20px] font-bold">
                  Latest Government Jobs
                </h1>

              </div>

              <div className="text-center px-4 py-3">

                <p className="text-[11px] sm:text-[12px] text-slate-600 leading-5">
                  Latest Government Jobs, Sarkari Jobs,
                  Recruitment Notifications and Online Forms.
                </p>

              </div>

            </section>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="flex max-w-[650px] mx-auto mt-5">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search Latest Government Jobs..."
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
                JOB LIST
            ================================================= */}

            <section className="mt-5 border border-[#bdbdbd]">

              <div className="bg-[#a90000] text-white text-center py-2">

                <h2 className="text-[17px] font-bold">
                  Latest Jobs
                </h2>

              </div>

              {loading ? (

                <div className="text-center py-10 text-sm text-slate-500">
                  Loading jobs...
                </div>

              ) : filteredJobs.length === 0 ? (

                <div className="text-center py-10 text-[12px] text-slate-500">
                  No government jobs found.
                </div>

              ) : (

                <div>

                  {filteredJobs.map((post) => (

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
                INFORMATION
            ================================================= */}

            <section className="mt-6 border border-slate-300">

              <div className="bg-[#000080] text-white text-center py-2">

                <h2 className="text-[17px] font-bold">
                  Latest Government Jobs
                </h2>

              </div>

              <div className="px-4 py-4 text-[12px] leading-6 text-slate-700">

                <p>
                  BharatJobs provides the latest government
                  job recruitment notifications, online forms,
                  vacancy details, eligibility, important dates
                  and application information.
                </p>

                <p className="mt-2">
                  Candidates should always check the official
                  notification and official website before
                  applying for any government recruitment.
                </p>

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

              </div>

              <div className="border-t border-blue-900 mt-5 pt-4">

                <p className="text-[10px] text-slate-400">
                  Copyright ©{" "}
                  {new Date().getFullYear()} |
                  BharatJobs.com
                </p>

              </div>

            </div>

          </footer>

        </div>

      </div>
    </>
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

  return (
    Date.now() - date.getTime() <=
    3 * 24 * 60 * 60 * 1000
  );
}


export default Jobs;