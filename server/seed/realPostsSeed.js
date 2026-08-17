import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../models/Post.js";
import Organization from "../models/Organization.js";

dotenv.config();

/* =====================================================
   ORGANIZATIONS
===================================================== */

const organizations = [
  {
    name: "Staff Selection Commission",
    shortName: "SSC",
    slug: "ssc",
    website: "https://ssc.gov.in/",
  },

  {
    name: "Institute of Banking Personnel Selection",
    shortName: "IBPS",
    slug: "ibps",
    website: "https://www.ibps.in/",
  },

  {
    name: "Bihar Technical Service Commission",
    shortName: "BTSC",
    slug: "btsc",
    website: "https://btsc.bihar.gov.in/",
  },

  {
    name: "Central Selection Board of Constable",
    shortName: "CSBC",
    slug: "csbc",
    website: "https://csbc.bihar.gov.in/",
  },

  {
    name: "Bihar Police Sub-Ordinate Services Commission",
    shortName: "BPSSC",
    slug: "bpssc",
    website: "https://bpssc.bihar.gov.in/",
  },

  {
    name: "Union Public Service Commission",
    shortName: "UPSC",
    slug: "upsc",
    website: "https://upsc.gov.in/",
  },

  {
    name: "Bihar Rojgar Setu",
    shortName: "Bihar Rojgar Setu",
    slug: "bihar-rojgar-setu",
    website: "https://detjob.bihar.gov.in/",
  },

  {
    name: "Punjab National Bank",
    shortName: "PNB",
    slug: "pnb",
    website: "https://pnb.bank.in/",
  },

  {
    name: "Oil and Natural Gas Corporation Limited",
    shortName: "ONGC",
    slug: "ongc",
    website: "https://ongcindia.com/",
  },
];

/* =====================================================
   POSTS
===================================================== */

const posts = [
  // ===================================================
  // 21. BTSC FOOD ANALYST
  // ===================================================

  {
    title: "BTSC Food Analyst Recruitment 2026",

    slug: "btsc-food-analyst-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "Bihar Technical Service Commission recruitment for the post of Food Analyst under Advertisement No. 24/2026.",

    content:
      "Bihar Technical Service Commission has published Advertisement No. 24/2026 for regular appointment to the post of Food Analyst.",

    status: "published",

    featured: true,

    importantDates: [
      {
        label: "Registration Start",
        date: "20 May 2026",
      },
      {
        label: "Registration End",
        date: "19 June 2026",
      },
      {
        label: "Application Last Date",
        date: "19 June 2026",
      },
      {
        label: "Payment Last Date",
        date: "19 June 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName: "Food Analyst",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should check the official BTSC Advertisement No. 24/2026 for educational qualification, age limit and other eligibility requirements.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Visit the official BTSC website and follow the recruitment instructions for Advertisement No. 24/2026.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 24/2026.",
      },
      {
        question: "What is the last date to apply?",
        answer:
          "The official BTSC recruitment page lists 19 June 2026.",
      },
    ],
  },

  // ===================================================
  // 22. BTSC INSTRUCTOR ELECTRICIAN
  // ===================================================

  {
    title:
      "BTSC Instructor Electrician Wireman Recruitment 2026",

    slug:
      "btsc-instructor-electrician-wireman-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "BTSC recruitment for Instructor (Electrician/Wireman) and Electrician posts under Advertisement No. 23/2026.",

    content:
      "Bihar Technical Service Commission has published Advertisement No. 23/2026 for regular appointment to the post of Instructor (Electrician/Wireman)/Electrician.",

    status: "published",

    featured: true,

    importantDates: [
      {
        label: "Registration Start",
        date: "15 April 2026",
      },
      {
        label: "Registration End",
        date: "15 May 2026",
      },
      {
        label: "Application Last Date",
        date: "15 May 2026",
      },
      {
        label: "Payment Last Date",
        date: "15 May 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName:
          "Instructor (Electrician/Wireman)/Electrician",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should check the official BTSC Advertisement No. 23/2026 for complete educational qualification and eligibility requirements.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Apply through the official BTSC recruitment portal according to Advertisement No. 23/2026.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 23/2026.",
      },
    ],
  },

  // ===================================================
  // 23. BTSC INSTRUCTOR ELECTRONICS
  // ===================================================

  {
    title:
      "BTSC Instructor Electronics Mechanic Recruitment 2026",

    slug:
      "btsc-instructor-electronics-mechanic-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "BTSC recruitment for Instructor (Electronics Mechanic/Mechanic Radio and TV) under Advertisement No. 22/2026.",

    content:
      "Bihar Technical Service Commission has published Advertisement No. 22/2026 for regular appointment to the post of Instructor (Electronics Mechanic/Mechanic Radio and TV).",

    status: "published",

    featured: false,

    importantDates: [
      {
        label: "Registration Start",
        date: "15 April 2026",
      },
      {
        label: "Registration End",
        date: "15 May 2026",
      },
      {
        label: "Application Last Date",
        date: "15 May 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName:
          "Instructor (Electronics Mechanic/Mechanic Radio and TV)",
        total: 0,
      },
    ],

    eligibility:
      "Eligibility and educational qualification should be checked in the official BTSC Advertisement No. 22/2026.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Visit the official BTSC website and complete the application according to the official notification.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 22/2026.",
      },
    ],
  },

  // ===================================================
  // 24. BTSC INSTRUCTOR FITTER
  // ===================================================

  {
    title: "BTSC Instructor Fitter Recruitment 2026",

    slug: "btsc-instructor-fitter-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "BTSC recruitment for Instructor (Fitter) under Advertisement No. 21/2026.",

    content:
      "Bihar Technical Service Commission has published Advertisement No. 21/2026 for regular appointment to the post of Instructor (Fitter).",

    status: "published",

    featured: false,

    importantDates: [
      {
        label: "Registration Start",
        date: "15 April 2026",
      },
      {
        label: "Registration End",
        date: "15 May 2026",
      },
      {
        label: "Application Last Date",
        date: "15 May 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName: "Instructor (Fitter)",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should check the official BTSC Advertisement No. 21/2026 for eligibility details.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Apply through the official BTSC recruitment portal.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 21/2026.",
      },
    ],
  },

  // ===================================================
  // 25. BTSC AGRICULTURE
  // ===================================================

  {
    title:
      "BTSC Instructor Agriculture Machinery Recruitment 2026",

    slug:
      "btsc-instructor-agriculture-machinery-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "BTSC recruitment for Instructor (Agriculture and Machinery) under Advertisement No. 20/2026.",

    content:
      "Bihar Technical Service Commission has published Advertisement No. 20/2026 for regular appointment to the post of Instructor (Agriculture and Machinery).",

    status: "published",

    featured: false,

    importantDates: [
      {
        label: "Registration Start",
        date: "15 April 2026",
      },
      {
        label: "Registration End",
        date: "15 May 2026",
      },
      {
        label: "Application Last Date",
        date: "15 May 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName:
          "Instructor (Agriculture and Machinery)",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should verify the qualification and eligibility from the official BTSC Advertisement No. 20/2026.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Visit the BTSC official website and complete the online application as instructed.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 20/2026.",
      },
    ],
  },

  // ===================================================
  // 26. BTSC MECHANIC TRACTOR
  // ===================================================

  {
    title:
      "BTSC Instructor Mechanic Tractor Recruitment 2026",

    slug:
      "btsc-instructor-mechanic-tractor-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "BTSC recruitment for Instructor (Mechanic Tractor) under Advertisement No. 19/2026.",

    content:
      "Bihar Technical Service Commission has published Advertisement No. 19/2026 for regular appointment to the post of Instructor (Mechanic Tractor).",

    status: "published",

    featured: false,

    importantDates: [
      {
        label: "Registration Start",
        date: "15 April 2026",
      },
      {
        label: "Registration End",
        date: "15 May 2026",
      },
      {
        label: "Application Last Date",
        date: "15 May 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName: "Instructor (Mechanic Tractor)",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should check the official BTSC Advertisement No. 19/2026 for educational qualification and other requirements.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Apply online through the official BTSC recruitment portal.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 19/2026.",
      },
    ],
  },

  // ===================================================
  // 27. BTSC WELDER
  // ===================================================

  {
    title: "BTSC Instructor Welder Recruitment 2026",

    slug: "btsc-instructor-welder-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "BTSC recruitment for Instructor (Welder) under Advertisement No. 18/2025.",

    content:
      "Bihar Technical Service Commission recruitment list includes recruitment for Instructor (Welder) under Advertisement No. 18/2025.",

    status: "published",

    featured: false,

    importantDates: [
      {
        label: "Registration Start",
        date: "15 April 2026",
      },
      {
        label: "Registration End",
        date: "15 May 2026",
      },
      {
        label: "Application Last Date",
        date: "15 May 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName: "Instructor (Welder)",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should verify all eligibility requirements from the official BTSC advertisement.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Visit the official BTSC website and follow the application instructions.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 18/2025.",
      },
    ],
  },

  // ===================================================
  // 28. BTSC LEATHER TECHNOLOGY
  // ===================================================

  {
    title:
      "BTSC Instructor Leather Technology Recruitment 2026",

    slug:
      "btsc-instructor-leather-technology-recruitment-2026",

    type: "job",

    organizationSlug: "btsc",

    shortDescription:
      "BTSC recruitment for Instructor (Leather Technology) under Advertisement No. 17/2026.",

    content:
      "Bihar Technical Service Commission recruitment list includes recruitment for Instructor (Leather Technology) under Advertisement No. 17/2026.",

    status: "published",

    featured: false,

    importantDates: [
      {
        label: "Registration Start",
        date: "15 April 2026",
      },
      {
        label: "Registration End",
        date: "15 May 2026",
      },
      {
        label: "Application Last Date",
        date: "15 May 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "See official BTSC Advertisement",
      },
    ],

    vacancies: [
      {
        postName: "Instructor (Leather Technology)",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should check the official BTSC Advertisement No. 17/2026 for complete eligibility requirements.",

    selectionProcess: [
      "As per BTSC recruitment rules",
    ],

    howToApply:
      "Apply through the official BTSC recruitment portal.",

    importantLinks: [
      {
        label: "Official BTSC Website",
        url: "https://btsc.bihar.gov.in/",
      },
      {
        label: "BTSC Recruitment",
        url: "https://btsc.bihar.gov.in/recruitment?page=0",
      },
    ],

    faq: [
      {
        question: "What is the advertisement number?",
        answer: "The advertisement number is 17/2026.",
      },
    ],
  },

  // ===================================================
  // 29. IBPS DCCB
  // ===================================================

  {
    title:
      "IBPS DCCB Manager Staff Assistant Recruitment 2026",

    slug:
      "ibps-dccb-manager-staff-assistant-recruitment-2026",

    type: "job",

    organizationSlug: "ibps",

    shortDescription:
      "Recruitment application for Manager and Staff Assistant posts through the IBPS recruitment portal.",

    content:
      "The official IBPS recruitment portal lists applications for Manager and Staff Assistant posts. Online registration was open from 24 July 2026 to 07 August 2026.",

    status: "published",

    featured: true,

    importantDates: [
      {
        label: "Registration Start",
        date: "24 July 2026",
      },
      {
        label: "Registration End",
        date: "07 August 2026",
      },
      {
        label: "Last Date for Application Print",
        date: "22 August 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "As per official notification",
      },
    ],

    vacancies: [
      {
        postName: "Manager / Staff Assistant",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should check the official recruitment notification for participating DCCBs, educational qualification and other eligibility conditions.",

    selectionProcess: [
      "Online Examination",
      "Further stages as prescribed by the concerned DCCB",
    ],

    howToApply:
      "Visit the official IBPS recruitment portal and select the concerned DCCB before completing the application.",

    importantLinks: [
      {
        label: "Official IBPS Website",
        url: "https://www.ibps.in/",
      },
      {
        label: "Official Application Portal",
        url: "https://ibpsreg.ibps.in/dccbmay26/",
      },
    ],

    faq: [
      {
        question: "When did registration start?",
        answer: "Registration started on 24 July 2026.",
      },
      {
        question: "When did registration close?",
        answer: "Registration closed on 07 August 2026.",
      },
    ],
  },

  // ===================================================
  // 30. PNB LOCAL BANK OFFICER
  // ===================================================

  {
    title:
      "PNB Local Bank Officer JMGS I Recruitment 2026",

    slug:
      "pnb-local-bank-officer-jmgs-i-recruitment-2026",

    type: "job",

    organizationSlug: "pnb",

    shortDescription:
      "Punjab National Bank recruitment for Local Bank Officer in JMGS-I.",

    content:
      "Punjab National Bank recruitment for Local Bank Officer in JMGS-I. Candidates should verify the official notification for complete eligibility, dates and state-wise requirements.",

    status: "published",

    featured: true,

    importantDates: [
      {
        label: "Registration Start",
        date: "20 July 2026",
      },
      {
        label: "Registration End",
        date: "09 August 2026",
      },
      {
        label: "Last Date for Application Print",
        date: "24 August 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "As per official notification",
      },
    ],

    vacancies: [
      {
        postName: "Local Bank Officer JMGS-I",
        total: 545,
      },
    ],

    eligibility:
      "Candidates should verify educational qualification, age and state-wise requirements from the official PNB recruitment notification.",

    selectionProcess: [
      "Online Examination",
      "Interview",
      "Further selection as prescribed",
    ],

    howToApply:
      "Apply through the official PNB recruitment portal and follow the instructions given in the official notification.",

    importantLinks: [
      {
        label: "Official PNB Website",
        url: "https://pnb.bank.in/",
      },
      {
        label: "Official IBPS Website",
        url: "https://www.ibps.in/",
      },
    ],

    faq: [
      {
        question: "What is the post?",
        answer:
          "The recruitment is for Local Bank Officer in JMGS-I.",
      },
      {
        question: "How many vacancies are listed?",
        answer: "545 vacancies.",
      },
    ],
  },

  // ===================================================
  // 31. NIC ASSISTANT
  // ===================================================

  {
    title: "NIC Recruitment 500 Assistants 2026",

    slug: "nic-recruitment-500-assistants-2026",

    type: "job",

    organizationSlug: "ibps",

    shortDescription:
      "Recruitment for 500 Assistant posts listed through the official recruitment portal.",

    content:
      "The recruitment portal lists recruitment for 500 Assistant posts at NIC. Candidates should verify the official notification for complete details.",

    status: "published",

    featured: true,

    importantDates: [
      {
        label: "Registration Start",
        date: "18 July 2026",
      },
      {
        label: "Registration End",
        date: "07 August 2026",
      },
      {
        label: "Last Date for Application Print",
        date: "22 August 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "As per official notification",
      },
    ],

    vacancies: [
      {
        postName: "Assistant",
        total: 500,
      },
    ],

    eligibility:
      "Candidates should check the official NIC recruitment notification for educational qualification, age limit and other eligibility conditions.",

    selectionProcess: [
      "Online Examination",
      "Further stages as prescribed by NIC",
    ],

    howToApply:
      "Visit the official recruitment portal and follow the application instructions for NIC recruitment.",

    importantLinks: [
      {
        label: "Official IBPS Website",
        url: "https://www.ibps.in/",
      },
    ],

    faq: [
      {
        question: "How many Assistant vacancies are listed?",
        answer:
          "The recruitment listing mentions 500 Assistant posts.",
      },
      {
        question: "When did registration start?",
        answer: "Registration started on 18 July 2026.",
      },
    ],
  },

  // ===================================================
  // 32. ONGC GEOLOGISTS / ENGINEERS
  // ===================================================

  {
    title:
      "ONGC Geologists Engineers Recruitment 2026",

    slug:
      "ongc-geologists-engineers-recruitment-2026",

    type: "job",

    organizationSlug: "ongc",

    shortDescription:
      "ONGC recruitment of Geologists and Engineers at E1 levels.",

    content:
      "Oil and Natural Gas Corporation Limited recruitment for Geologists and Engineers at E1 levels. Candidates should verify the official ONGC notification for complete details.",

    status: "published",

    featured: false,

    importantDates: [
      {
        label: "Registration Start",
        date: "17 July 2026",
      },
      {
        label: "Registration End",
        date: "31 July 2026",
      },
    ],

    applicationFee: [
      {
        category: "Application Fee",
        amount: "As per official ONGC notification",
      },
    ],

    vacancies: [
      {
        postName: "Geologists and Engineers at E1 Level",
        total: 0,
      },
    ],

    eligibility:
      "Candidates should verify post-wise educational qualification and eligibility requirements from the official ONGC notification.",

    selectionProcess: [
      "As per ONGC recruitment rules",
    ],

    howToApply:
      "Visit the official ONGC recruitment/application portal and follow the instructions in the recruitment notification.",

    importantLinks: [
      {
        label: "Official ONGC Website",
        url: "https://ongcindia.com/",
      },
    ],

    faq: [
      {
        question: "Which posts are listed?",
        answer:
          "The recruitment is for Geologists and Engineers at E1 levels.",
      },
      {
        question: "When was registration listed?",
        answer:
          "Registration was listed from 17 July 2026 to 31 July 2026.",
      },
    ],
  },
];

/* =====================================================
   GET / CREATE ORGANIZATION
===================================================== */

async function getOrganization(data) {
  let organization = await Organization.findOne({
    slug: data.slug,
  });

  if (!organization) {
    organization = await Organization.create(data);

    console.log(
      `Organization created: ${data.shortName} (${data.slug})`
    );
  } else {
    console.log(
      `Organization exists: ${data.shortName} (${data.slug})`
    );
  }

  return organization;
}

/* =====================================================
   SEED POSTS
===================================================== */

async function seedPosts() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in .env file"
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    /* ================================================
       ORGANIZATION MAP
    ================================================ */

    const organizationMap = {};

    for (const organizationData of organizations) {
      const organization =
        await getOrganization(organizationData);

      organizationMap[
        organizationData.slug
      ] = organization;
    }

    /* ================================================
       SEED POSTS
    ================================================ */

    let inserted = 0;
    let skipped = 0;
    let missingOrganization = 0;

    for (const data of posts) {
      const organization =
        organizationMap[data.organizationSlug];

      if (!organization) {
        console.log(
          `Organization missing: ${data.organizationSlug}`
        );

        missingOrganization++;
        continue;
      }

      /* ==============================================
         DUPLICATE CHECK
      ============================================== */

      const existing = await Post.findOne({
        slug: data.slug,
      });

      if (existing) {
        console.log(
          `Skipped: ${data.slug}`
        );

        skipped++;
        continue;
      }

      /* ==============================================
         REMOVE organizationSlug
      ============================================== */

      const {
        organizationSlug,
        ...postData
      } = data;

      /* ==============================================
         SET ORGANIZATION
      ============================================== */

      postData.organization =
        organization._id;

      /* ==============================================
         PUBLISHED DATE
      ============================================== */

      if (postData.status === "published") {
        postData.publishedAt =
          postData.publishedAt ||
          new Date();
      }

      /* ==============================================
         CREATE POST
      ============================================== */

      await Post.create(postData);

      console.log(
        `Inserted: ${postData.title}`
      );

      inserted++;
    }

    /* ================================================
       FINAL REPORT
    ================================================ */

    console.log("");

    console.log(
      "=============================="
    );

    console.log(
      "SEED COMPLETE"
    );

    console.log(
      "=============================="
    );

    console.log(
      `Inserted: ${inserted}`
    );

    console.log(
      `Skipped: ${skipped}`
    );

    console.log(
      `Missing Organization: ${missingOrganization}`
    );

    console.log(
      `Total seed records: ${posts.length}`
    );

    console.log(
      `Organizations available: ${organizations.length}`
    );

    console.log(
      "=============================="
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Seed Error:",
      error
    );

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedPosts();