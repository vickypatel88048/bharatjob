import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API = "http://localhost:5000/api";

function AnswerKey() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnswerKeys();
  }, []);

  const loadAnswerKeys = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/posts`);

      const data = response.data?.posts || [];

      const answerKeys = data
        .filter(
          (post) =>
            post.type === "answer-key" &&
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

      setPosts(answerKeys);
    } catch (error) {
      console.error(
        "Failed to load answer keys:",
        error
      );
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

  // =========================================================
  // SEO
  // =========================================================

  const siteUrl = window.location.origin;

  const pageTitle =
    "Latest Government Answer Key 2026 - Sarkari Answer Key | BharatJobs";

  const pageDescription =
    "Check latest government exam answer keys 2026, response sheets, answer key updates and objection information on BharatJobs.";

  const canonicalUrl = `${siteUrl}/answer-key`;

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
          content="Government Answer Key 2026, Sarkari Answer Key, Answer Key, Exam Answer Key, Government Exam Answer Key, Response Sheet, Answer Key Objection, Latest Answer Key, BharatJobs"
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
            COLLECTION PAGE SCHEMA
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
              name: "Government Exam Answer Keys",
            },
          })}
        </script>

        {/* =====================================================
            BREADCRUMB SCHEMA
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
                name: "Answer Key",
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
              />

              <NavItem
                to="/answer-key"
                text="Answer Key"
                active
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
                PAGE TITLE
            ================================================= */}

            <section className="border border-slate-300">

              <div className="bg-[#a90000] text-white text-center py-2">

                <h1 className="text-[18px] sm:text-[20px] font-bold">
                  Latest Answer Keys
                </h1>

              </div>

              <div className="text-center px-4 py-3">

                <p className="text-[11px] sm:text-[12px] text-slate-600 leading-5">
                  Latest Government Exam Answer Keys,
                  Response Sheets and Answer Key Updates.
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
                placeholder="Search Answer Keys..."
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
                ANSWER KEY LIST
            ================================================= */}

            <section className="mt-5 border border-[#bdbdbd]">

              <div className="bg-[#a90000] text-white text-center py-2">

                <h2 className="text-[17px] font-bold">
                  Latest Answer Keys
                </h2>

              </div>

              {loading ? (

                <div className="text-center py-10 text-sm text-slate-500">
                  Loading answer keys...
                </div>

              ) : filteredPosts.length === 0 ? (

                <div className="text-center py-10 text-[12px] text-slate-500">
                  No answer keys found.
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
                INFORMATION
            ================================================= */}

            <section className="mt-6 border border-slate-300">

              <div className="bg-[#000080] text-white text-center py-2">

                <h2 className="text-[17px] font-bold">
                  Government Answer Key
                </h2>

              </div>

              <div className="px-4 py-4 text-[12px] leading-6 text-slate-700">

                <p>
                  BharatJobs provides the latest government
                  examination answer keys and related
                  notifications for candidates.
                </p>

                <p className="mt-2">
                  Candidates should verify the answer key
                  and objection details from the official
                  website of the concerned organization.
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


export default AnswerKey;