import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="min-h-screen bg-[#eeeeee] font-[Arial,sans-serif]">

      <div className="w-full max-w-[1000px] mx-auto min-h-screen bg-white">

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

            <NavItem to="/" text="Home" />

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
              text="Contact Us"
              active
            />

          </div>
        </nav>

        {/* CONTENT */}
        <main className="px-3 sm:px-5 py-5">

          {/* PAGE TITLE */}
          <section className="border border-slate-300">

            <div className="bg-[#a90000] text-white text-center py-2">
              <h1 className="text-[18px] sm:text-[20px] font-bold">
                Contact Us
              </h1>
            </div>

            <div className="text-center px-4 py-3">
              <p className="text-[11px] sm:text-[12px] text-slate-600 leading-5">
                Contact BharatJobs for questions, suggestions,
                corrections and other website related queries.
              </p>
            </div>

          </section>

          {/* CONTACT INFORMATION */}
          <section className="mt-5 border border-slate-300">

            <div className="bg-[#a90000] text-white text-center py-2">
              <h2 className="text-[17px] font-bold">
                Contact BharatJobs
              </h2>
            </div>

            <div className="px-4 sm:px-6 py-5">

              <p className="text-[12px] leading-6 text-slate-700">
                If you have any questions, suggestions,
                corrections or feedback regarding the
                information published on BharatJobs, you
                can contact us through the details provided
                below.
              </p>

              {/* EMAIL */}
              <div className="border border-slate-300 mt-5 p-4 bg-[#fafafa]">

                <h3 className="text-[15px] font-bold text-slate-800">
                  Email
                </h3>

                <p className="text-[12px] text-slate-600 mt-1">
                  For general queries and website related
                  communication:
                </p>

                <a
                  href="mailto:contact@bharatjobs360.com"
                  className="inline-block mt-2 text-blue-700 text-[13px] font-bold hover:text-red-700 hover:underline"
                >
                  contact@bharatjobs360.com
                </a>

              </div>

              {/* CORRECTION */}
              <div className="border border-slate-300 mt-3 p-4 bg-[#fafafa]">

                <h3 className="text-[15px] font-bold text-slate-800">
                  Information Correction
                </h3>

                <p className="text-[12px] text-slate-600 mt-1 leading-5">
                  If you find any incorrect or outdated
                  information on BharatJobs, please contact
                  us with the relevant post or information
                  so that it can be reviewed.
                </p>

              </div>

              {/* SUGGESTIONS */}
              <div className="border border-slate-300 mt-3 p-4 bg-[#fafafa]">

                <h3 className="text-[15px] font-bold text-slate-800">
                  Suggestions & Feedback
                </h3>

                <p className="text-[12px] text-slate-600 mt-1 leading-5">
                  We welcome your suggestions and feedback
                  to improve BharatJobs and make the website
                  more useful for candidates.
                </p>

              </div>

            </div>

          </section>

          {/* IMPORTANT NOTICE */}
          <section className="mt-6 border border-slate-300">

            <div className="bg-[#000080] text-white text-center py-2">
              <h2 className="text-[17px] font-bold">
                Important Notice
              </h2>
            </div>

            <div className="px-4 py-4 text-[12px] leading-6 text-slate-700">

              <p>
                BharatJobs is an informational platform
                providing government job, result, admit card,
                answer key, syllabus, admission and other
                recruitment related updates.
              </p>

              <p className="mt-2">
                For applications, corrections, examination
                issues or official complaints, candidates
                should contact the concerned government
                department or official organization.
              </p>

            </div>

          </section>

        </main>

        {/* FOOTER */}
        <footer className="bg-[#050d52] text-white mt-7">

          <div className="px-4 py-6">

            <div className="text-center">

              <h2 className="text-lg font-bold">
                BharatJobs
              </h2>

              <p className="text-[11px] text-slate-300 mt-2">
                Latest Government Jobs, Results,
                Admit Cards and Recruitment Notifications.
              </p>

            </div>

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
                to="/privacy"
                className="text-slate-300 hover:text-white no-underline"
              >
                Privacy Policy
              </Link>

              <Link
                to="/contact"
                className="text-slate-300 hover:text-white no-underline"
              >
                Contact Us
              </Link>

            </div>

            <div className="border-t border-blue-900 mt-5 pt-4 text-center">

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


/* ==========================================
   NAV ITEM
========================================== */

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

export default Contact;