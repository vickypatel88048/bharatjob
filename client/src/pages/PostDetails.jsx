import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import "./PostDetails.css";

const API = "http://localhost:5000/api";
const SITE_NAME = "BharatJobs";
const SITE_URL = "https://bharatjobs360.com";

export default function PostDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  async function loadPost() {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/posts/${slug}`
      );

      const current =
        response.data?.post ||
        response.data?.data ||
        response.data;

      setPost(current);

      if (!current?._id) {
        return;
      }

      try {
        const allResponse = await axios.get(
          `${API}/posts?status=published&limit=100`
        );

        const posts =
          allResponse.data?.posts ||
          allResponse.data?.data ||
          [];

        const published = posts.filter(
          (item) =>
            item.status === "published" &&
            item.isDeleted !== true
        );

        const sorted = [...published].sort(
          (a, b) => {
            const dateA = new Date(
              a.publishedAt ||
                a.updatedAt ||
                a.createdAt ||
                0
            );

            const dateB = new Date(
              b.publishedAt ||
                b.updatedAt ||
                b.createdAt ||
                0
            );

            return dateB - dateA;
          }
        );

        setLatestPosts(
          sorted
            .filter(
              (item) =>
                String(item._id) !==
                String(current._id)
            )
            .slice(0, 8)
        );

        setRelatedPosts(
          sorted
            .filter(
              (item) =>
                String(item._id) !==
                  String(current._id) &&
                item.type === current.type
            )
            .slice(0, 8)
        );
      } catch (error) {
        console.log(
          "Posts list unavailable"
        );
      }
    } catch (error) {
      console.error(
        "Post Details Error:",
        error
      );

      setPost(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return <NotFound />;
  }

  const organization =
    post.organization?.shortName ||
    post.organization?.name ||
    "BharatJobs";

  const postDate =
    post.publishedAt ||
    post.createdAt;

  const updatedDate =
    post.updatedAt ||
    postDate;

  const totalPosts =
    getTotalPosts(post);

  const canonicalUrl =
    `${SITE_URL}/post/${post.slug}`;

  const seoDescription =
    post.shortDescription ||
    `${post.title} - Check latest government job notification, important dates, eligibility, vacancy, application fee, selection process and important links on ${SITE_NAME}.`;

  const keywords = [
    post.title,
    formatType(post.type),
    "Government Jobs",
    "Sarkari Jobs",
    "Government Job Notification",
    "Latest Government Jobs",
    "Recruitment 2026",
    organization,
    "BharatJobs",
  ].join(", ");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: formatType(post.type),
        item: `${SITE_URL}/${getTypePath(
          post.type
        )}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: seoDescription,
    url: canonicalUrl,
    datePublished:
      post.publishedAt ||
      post.createdAt ||
      undefined,
    dateModified:
      post.updatedAt ||
      post.publishedAt ||
      post.createdAt ||
      undefined,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const faqSchema =
    post.faq?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq
            .filter(
              (item) =>
                item.question &&
                item.answer
            )
            .map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
        }
      : null;

  const jobSchema =
    post.type === "job"
      ? createJobSchema({
          post,
          organization,
          canonicalUrl,
        })
      : null;

  return (
    <>
      <Helmet>
        <title>
          {post.title} | BharatJobs
        </title>

        <meta
          name="description"
          content={seoDescription}
        />

        <meta
          name="keywords"
          content={keywords}
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
          content="article"
        />

        <meta
          property="og:title"
          content={post.title}
        />

        <meta
          property="og:description"
          content={seoDescription}
        />

        <meta
          property="og:url"
          content={canonicalUrl}
        />

        <meta
          property="og:site_name"
          content={SITE_NAME}
        />

        {post.publishedAt && (
          <meta
            property="article:published_time"
            content={post.publishedAt}
          />
        )}

        {post.updatedAt && (
          <meta
            property="article:modified_time"
            content={post.updatedAt}
          />
        )}

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary"
        />

        <meta
          name="twitter:title"
          content={post.title}
        />

        <meta
          name="twitter:description"
          content={seoDescription}
        />

        {/* Breadcrumb */}

        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbSchema
          )}
        </script>

        {/* Article */}

        <script type="application/ld+json">
          {JSON.stringify(
            articleSchema
          )}
        </script>

        {/* Job */}

        {jobSchema && (
          <script type="application/ld+json">
            {JSON.stringify(jobSchema)}
          </script>
        )}

        {/* FAQ */}

        {faqSchema &&
          faqSchema.mainEntity.length > 0 && (
            <script type="application/ld+json">
              {JSON.stringify(faqSchema)}
            </script>
          )}
      </Helmet>

      <div className="bj-page">
        <div className="bj-wrapper">

          {/* HEADER */}

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

          {/* NAVIGATION */}

          <nav className="bg-[#050d52]">
            <div className="flex flex-wrap justify-center">

              <NavItem
                to="/"
                text="Home"
              />

              <NavItem
                to="/jobs"
                text="Latest Job"
                active={
                  post.type === "job"
                }
              />

              <NavItem
                to="/admit-card"
                text="Admit Card"
                active={
                  post.type ===
                  "admit-card"
                }
              />

              <NavItem
                to="/results"
                text="Result"
                active={
                  post.type === "result"
                }
              />

              <NavItem
                to="/admission"
                text="Admission"
                active={
                  post.type ===
                  "admission"
                }
              />

              <NavItem
                to="/syllabus"
                text="Syllabus"
              />

              <NavItem
                to="/answer-key"
                text="Answer Key"
                active={
                  post.type ===
                  "answer-key"
                }
              />

              <NavItem
                to="/contact"
                text="Contact"
              />

            </div>
          </nav>

          {/* MAIN */}

          <main className="px-3 sm:px-5 py-5">

            {/* BREADCRUMB */}

            <div className="bj-breadcrumb">
              <Link to="/">
                Home
              </Link>

              <span>›</span>

              <Link
                to={`/${getTypePath(
                  post.type
                )}`}
              >
                {formatType(post.type)}
              </Link>

              <span>›</span>

              <strong>
                {post.title}
              </strong>
            </div>

            {/* TITLE */}

            <section className="bj-title-area">

              <div className="bj-type-badge">
                {formatType(post.type)}
              </div>

              <h1>
                {post.title}
              </h1>

              <div className="bj-meta">

                <span>
                  📅 Post Date:{" "}
                  {formatDate(postDate)}
                </span>

                <span className="bj-meta-divider">
                  |
                </span>

                <span>
                  🏢 {organization}
                </span>

              </div>

            </section>

            {/* INTRO */}

            <div className="bj-intro">

              {post.shortDescription && (
                <p>
                  {post.shortDescription}
                </p>
              )}

              <p>
                <b>{organization}</b>{" "}
                has released the official
                notification for{" "}
                <b>{post.title}</b>.
                Candidates can check
                complete details including
                important dates,
                eligibility, vacancy,
                application fee, selection
                process and important links
                below.
              </p>

            </div>

            <AppLink />

            {/* SHORT DETAILS */}

            <section className="bj-details-card">

              <div className="bj-card-heading">
                <h2>
                  {post.title}
                </h2>

                <p>
                  {organization} :
                  Short Details
                </p>
              </div>

              <div className="bj-details-grid">

                {post.importantDates?.length >
                  0 && (
                  <InfoCard
                    title="Important Dates"
                    icon="📅"
                  >
                    <ul>
                      {post.importantDates.map(
                        (item, index) => (
                          <li key={index}>
                            <b>
                              {item.label}:
                            </b>{" "}
                            {item.date}
                          </li>
                        )
                      )}
                    </ul>
                  </InfoCard>
                )}

                {post.applicationFee?.length >
                  0 && (
                  <InfoCard
                    title="Application Fee"
                    icon="💳"
                  >
                    <ul>
                      {post.applicationFee.map(
                        (item, index) => (
                          <li key={index}>
                            <b>
                              {item.category}:
                            </b>{" "}
                            {item.amount}
                          </li>
                        )
                      )}
                    </ul>
                  </InfoCard>
                )}

                {hasAge(post) && (
                  <InfoCard
                    title="Age Limit"
                    icon="🎂"
                  >
                    <ul>
                      {post.ageLimit?.minimum && (
                        <li>
                          Minimum:{" "}
                          {
                            post.ageLimit
                              .minimum
                          }
                        </li>
                      )}

                      {post.ageLimit?.maximum && (
                        <li>
                          Maximum:{" "}
                          {
                            post.ageLimit
                              .maximum
                          }
                        </li>
                      )}

                      {post.ageLimit
                        ?.relaxation && (
                        <li>
                          Relaxation:{" "}
                          {
                            post.ageLimit
                              .relaxation
                          }
                        </li>
                      )}
                    </ul>
                  </InfoCard>
                )}

                <InfoCard
                  title="Total Vacancy"
                  icon="📊"
                >
                  <div className="bj-total-number">
                    {totalPosts}
                  </div>

                  <span className="bj-total-label">
                    Total Posts
                  </span>
                </InfoCard>

              </div>

              {post.applicationFee?.length >
                0 && (
                <div className="bj-payment">
                  <strong>
                    Payment Mode:
                  </strong>{" "}
                  Debit Card, Credit Card,
                  Internet Banking, IMPS,
                  Cash Card / Mobile Wallet
                </div>
              )}

            </section>

            <AppLink />

            {/* VACANCY */}

            {post.vacancies?.length > 0 && (
              <Section
                title={`${post.title} : Vacancy Details`}
              >
                <div className="bj-table-scroll">
                  <table className="bj-table">

                    <thead>
                      <tr>
                        <th>
                          Post Name
                        </th>

                        <th>
                          No. Of Post
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {post.vacancies.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>
                              {item.postName}
                            </td>

                            <td className="center">
                              {item.total}
                            </td>
                          </tr>
                        )
                      )}

                      <tr className="bj-total-row">
                        <td>Total</td>

                        <td className="center">
                          {totalPosts}
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </Section>
            )}

            {/* ELIGIBILITY */}

            {post.eligibility && (
              <Section
                title={`${post.title} : Education Qualification`}
              >
                <div className="bj-content-box">
                  {post.eligibility
                    .split("\n")
                    .filter(Boolean)
                    .map(
                      (line, index) => (
                        <div
                          key={index}
                          className="bj-bullet"
                        >
                          <span>•</span>

                          <span>
                            {line}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </Section>
            )}

            {/* CHECK */}

            {latestPosts.length > 0 && (
              <div className="bj-check-box">
                <strong>
                  You May Also Check
                </strong>

                <Link
                  to={`/post/${latestPosts[0].slug}`}
                >
                  {latestPosts[0].title}
                </Link>
              </div>
            )}

            {/* HOW TO APPLY */}

            {post.howToApply && (
              <Section
                title={`How To Apply ${post.title}`}
              >
                <div className="bj-content-box bj-pre">
                  {post.howToApply}
                </div>
              </Section>
            )}

            {/* SELECTION */}

            {post.selectionProcess?.length >
              0 && (
              <Section
                title={`${post.title} : Mode Of Selection`}
              >
                <ul className="bj-selection-list">
                  {post.selectionProcess.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </Section>
            )}

            {/* SALARY */}

            {post.salary && (
              <Section title="Salary / Pay Scale">
                <div className="bj-content-box">
                  {post.salary}
                </div>
              </Section>
            )}

            {/* SOCIAL */}

            <div className="bj-social">
              <span>
                Join Our WhatsApp Channel
              </span>

              <a href="#">
                Follow Now
              </a>

              <span>|</span>

              <span>
                Join Our Telegram Channel
              </span>

              <a href="#">
                Follow Now
              </a>
            </div>

            {/* IMPORTANT LINKS */}

            {post.importantLinks?.length >
              0 && (
              <Section
                title="SOME USEFUL IMPORTANT LINKS"
              >
                <div className="bj-important-links">

                  {post.importantLinks.map(
                    (item, index) => (
                      <div
                        className="bj-link-row"
                        key={index}
                      >
                        <div className="bj-link-name">
                          {item.label}
                        </div>

                        <div className="bj-link-action">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Click Here
                          </a>
                        </div>
                      </div>
                    )
                  )}

                </div>
              </Section>
            )}

            {/* FAQ */}

            {post.faq?.length > 0 && (
              <Section
                title={`${post.title} : Important Questions`}
              >
                <div className="bj-faq">

                  {post.faq.map(
                    (item, index) => (
                      <details
                        key={index}
                        className="bj-faq-item"
                      >
                        <summary>
                          {item.question}
                        </summary>

                        <div>
                          {item.answer}
                        </div>
                      </details>
                    )
                  )}

                </div>
              </Section>
            )}

            {/* CONTENT */}

            {post.content && (
              <Section title="Important Information">
                <div className="bj-content-box bj-pre">
                  {post.content}
                </div>
              </Section>
            )}

            {/* SITE CTA */}

            <div className="bj-final-cta">
              <h3>
                BharatJobs.com
              </h3>

              <p>
                Latest Government Jobs,
                Results, Admit Cards &
                Notifications
              </p>

              <Link to="/">
                Explore BharatJobs
              </Link>
            </div>

            {/* LATEST */}

            {latestPosts.length > 0 && (
              <PostList
                title="Latest Posts"
                posts={latestPosts}
              />
            )}

            {/* RELATED */}

            {relatedPosts.length > 0 && (
              <PostList
                title="Related Posts"
                posts={relatedPosts}
              />
            )}

          </main>

          {/* DISCLAIMER */}

          <section className="bj-disclaimer">
            <strong>
              Disclaimer:
            </strong>{" "}
            BharatJobs provides information
            related to government jobs,
            results, admit cards, answer keys
            and recruitment notifications.
            Candidates should verify all
            information from the official
            notification and official website
            of the concerned organization.
          </section>

          {/* FOOTER */}

          <footer className="bg-[#050d52] text-white mt-7">
            <div className="px-4 py-6 text-center">

              <h2 className="text-lg font-bold">
                BharatJobs
              </h2>

              <p className="text-[11px] text-slate-300 mt-2">
                Latest Government Jobs,
                Results, Admit Cards and
                Recruitment Notifications.
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
                  to="/contact"
                  className="text-slate-300 hover:text-white no-underline"
                >
                  Contact
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
   JOB SCHEMA
========================================================= */

function createJobSchema({
  post,
  organization,
  canonicalUrl,
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",

    title: post.title,

    description:
      post.content ||
      post.shortDescription ||
      post.title,

    datePosted:
      post.publishedAt ||
      post.createdAt,

    url: canonicalUrl,

    hiringOrganization: {
      "@type": "Organization",
      name: organization,
    },

    directApply: false,
  };

  if (post.salary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        value: extractSalaryValue(
          post.salary
        ),
        unitText: "MONTH",
      },
    };
  }

  return schema;
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
   APP LINK
========================================================= */

function AppLink() {
  return (
    <div className="bj-app">
      <Link to="/">
        Explore BharatJobs
      </Link>
    </div>
  );
}


/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  title,
  icon,
  children,
}) {
  return (
    <div className="bj-info-card">

      <div className="bj-info-title">
        <span>{icon}</span>

        <strong>
          {title}
        </strong>
      </div>

      {children}

    </div>
  );
}


/* =========================================================
   SECTION
========================================================= */

function Section({
  title,
  children,
}) {
  return (
    <section className="bj-section">

      <h2 className="bj-section-title">
        {title}
      </h2>

      <div className="bj-section-content">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   POST LIST
========================================================= */

function PostList({
  title,
  posts,
}) {
  return (
    <section className="bj-post-list">

      <h2>
        {title}
      </h2>

      <div className="bj-post-items">

        {posts.map((item) => (
          <Link
            key={item._id}
            to={`/post/${item.slug}`}
          >
            {item.title}
          </Link>
        ))}

      </div>

    </section>
  );
}


/* =========================================================
   HELPERS
========================================================= */

function hasAge(post) {
  return Boolean(
    post.ageLimit?.minimum ||
    post.ageLimit?.maximum ||
    post.ageLimit?.relaxation
  );
}


function getTotalPosts(post) {
  if (!post.vacancies?.length) {
    return "N/A";
  }

  const total =
    post.vacancies.reduce(
      (sum, item) =>
        sum + Number(item.total || 0),
      0
    );

  return total || "N/A";
}


function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}


function formatType(type) {
  const map = {
    job: "Latest Job",
    result: "Result",
    "admit-card": "Admit Card",
    "answer-key": "Answer Key",
    admission: "Admission",
    syllabus: "Syllabus",
  };

  return (
    map[type] ||
    "Government Jobs"
  );
}


function getTypePath(type) {
  const map = {
    job: "jobs",
    result: "results",
    "admit-card": "admit-card",
    "answer-key": "answer-key",
    admission: "admission",
    syllabus: "syllabus",
  };

  return map[type] || "jobs";
}


function extractSalaryValue(
  salary
) {
  if (!salary) {
    return 0;
  }

  const numbers =
    String(salary)
      .replace(/,/g, "")
      .match(/\d+(?:\.\d+)?/g);

  if (!numbers?.length) {
    return 0;
  }

  return Number(numbers[0]);
}


/* =========================================================
   LOADING
========================================================= */

function Loading() {
  return (
    <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">

      <div className="w-full max-w-[1000px] mx-auto bg-white min-h-screen">

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
            />

            <NavItem
              to="/contact"
              text="Contact"
            />

          </div>
        </nav>

        <div className="bj-loading">
          Loading Post...
        </div>

        <footer className="bg-[#050d52] text-white mt-7">
          <div className="px-4 py-6 text-center">

            <h2 className="text-lg font-bold">
              BharatJobs
            </h2>

            <p className="text-[11px] text-slate-300 mt-2">
              Latest Government Jobs,
              Results, Admit Cards and
              Recruitment Notifications.
            </p>

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
  );
}


/* =========================================================
   NOT FOUND
========================================================= */

function NotFound() {
  return (
    <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">

      <div className="w-full max-w-[1000px] mx-auto bg-white min-h-screen">

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
            />

            <NavItem
              to="/contact"
              text="Contact"
            />

          </div>
        </nav>

        <div className="bj-not-found">

          <h2>
            Post Not Found
          </h2>

          <p>
            The requested post could not
            be found.
          </p>

          <Link to="/">
            Go To Home
          </Link>

        </div>

        <footer className="bg-[#050d52] text-white mt-7">
          <div className="px-4 py-6 text-center">

            <h2 className="text-lg font-bold">
              BharatJobs
            </h2>

            <p className="text-[11px] text-slate-300 mt-2">
              Latest Government Jobs,
              Results, Admit Cards and
              Recruitment Notifications.
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
                to="/contact"
                className="text-slate-300 hover:text-white no-underline"
              >
                Contact
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
  );
}