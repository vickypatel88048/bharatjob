import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";

import Post from "../models/Post.js";
import Organization from "../models/Organization.js";

dotenv.config();

const SOURCE_URL =
  "https://sarkariresult.com.cm/latest-jobs/";

const MAX_ITEMS = 60;

/* =====================================================
   ORGANIZATIONS
===================================================== */

const ORGANIZATIONS = {
  ssc: {
    name: "Staff Selection Commission",
    shortName: "SSC",
    slug: "ssc",
    website: "https://ssc.gov.in/",
  },

  ibps: {
    name: "Institute of Banking Personnel Selection",
    shortName: "IBPS",
    slug: "ibps",
    website: "https://www.ibps.in/",
  },

  btsc: {
    name: "Bihar Technical Service Commission",
    shortName: "BTSC",
    slug: "btsc",
    website: "https://btsc.bihar.gov.in/",
  },

  csbc: {
    name: "Central Selection Board of Constable",
    shortName: "CSBC",
    slug: "csbc",
    website: "https://csbc.bihar.gov.in/",
  },

  bpssc: {
    name: "Bihar Police Sub-Ordinate Services Commission",
    shortName: "BPSSC",
    slug: "bpssc",
    website: "https://bpssc.bihar.gov.in/",
  },

  upsc: {
    name: "Union Public Service Commission",
    shortName: "UPSC",
    slug: "upsc",
    website: "https://upsc.gov.in/",
  },

  bpsc: {
    name: "Bihar Public Service Commission",
    shortName: "BPSC",
    slug: "bpsc",
    website: "https://bpsc.bihar.gov.in/",
  },

  railway: {
    name: "Railway Recruitment Board",
    shortName: "RRB",
    slug: "rrb",
    website: "https://www.rrbcdg.gov.in/",
  },

  sbi: {
    name: "State Bank of India",
    shortName: "SBI",
    slug: "sbi",
    website: "https://sbi.co.in/",
  },

  pnb: {
    name: "Punjab National Bank",
    shortName: "PNB",
    slug: "pnb",
    website: "https://www.pnbindia.in/",
  },

  upsssc: {
    name: "Uttar Pradesh Subordinate Services Selection Commission",
    shortName: "UPSSSC",
    slug: "upsssc",
    website: "https://upsssc.gov.in/",
  },

  uppsc: {
    name: "Uttar Pradesh Public Service Commission",
    shortName: "UPPSC",
    slug: "uppsc",
    website: "https://uppsc.up.nic.in/",
  },

  isro: {
    name: "Indian Space Research Organisation",
    shortName: "ISRO",
    slug: "isro",
    website: "https://www.isro.gov.in/",
  },

  aai: {
    name: "Airports Authority of India",
    shortName: "AAI",
    slug: "aai",
    website: "https://www.aai.aero/",
  },

  aiims: {
    name: "All India Institute of Medical Sciences",
    shortName: "AIIMS",
    slug: "aiims",
    website: "https://www.aiims.edu/",
  },

  indianArmy: {
    name: "Indian Army",
    shortName: "Indian Army",
    slug: "indian-army",
    website: "https://joinindianarmy.nic.in/",
  },

  indianNavy: {
    name: "Indian Navy",
    shortName: "Indian Navy",
    slug: "indian-navy",
    website: "https://www.joinindiannavy.gov.in/",
  },

  indianAirForce: {
    name: "Indian Air Force",
    shortName: "Indian Air Force",
    slug: "indian-air-force",
    website: "https://indianairforce.nic.in/",
  },

  up: {
    name: "Government of Uttar Pradesh",
    shortName: "Uttar Pradesh",
    slug: "uttar-pradesh",
    website: "https://up.gov.in/",
  },

  rajasthan: {
    name: "Government of Rajasthan",
    shortName: "Rajasthan",
    slug: "rajasthan",
    website: "https://rajasthan.gov.in/",
  },

  chhattisgarh: {
    name: "Government of Chhattisgarh",
    shortName: "Chhattisgarh",
    slug: "chhattisgarh",
    website: "https://cgstate.gov.in/",
  },

  uttarakhand: {
    name: "Government of Uttarakhand",
    shortName: "Uttarakhand",
    slug: "uttarakhand",
    website: "https://uk.gov.in/",
  },

  himachal: {
    name: "Government of Himachal Pradesh",
    shortName: "Himachal Pradesh",
    slug: "himachal-pradesh",
    website: "https://himachal.nic.in/",
  },

  mpesb: {
    name: "Madhya Pradesh Employees Selection Board",
    shortName: "MPESB",
    slug: "mpesb",
    website: "https://esb.mp.gov.in/",
  },

  mppsc: {
    name: "Madhya Pradesh Public Service Commission",
    shortName: "MPPSC",
    slug: "mppsc",
    website: "https://mppsc.mp.gov.in/",
  },

  jssc: {
    name: "Jharkhand Staff Selection Commission",
    shortName: "JSSC",
    slug: "jssc",
    website: "https://jssc.nic.in/",
  },

  uksssc: {
    name: "Uttarakhand Subordinate Service Selection Commission",
    shortName: "UKSSSC",
    slug: "uksssc",
    website: "https://sssc.uk.gov.in/",
  },

  rpsc: {
    name: "Rajasthan Public Service Commission",
    shortName: "RPSC",
    slug: "rpsc",
    website: "https://rpsc.rajasthan.gov.in/",
  },

  sjvn: {
    name: "SJVN Limited",
    shortName: "SJVN",
    slug: "sjvn",
    website: "https://sjvn.nic.in/",
  },

  igcar: {
    name: "Indira Gandhi Centre for Atomic Research",
    shortName: "IGCAR",
    slug: "igcar",
    website: "https://www.igcar.gov.in/",
  },

  bankOfBaroda: {
    name: "Bank of Baroda",
    shortName: "Bank of Baroda",
    slug: "bank-of-baroda",
    website: "https://www.bankofbaroda.in/",
  },

  unionBank: {
    name: "Union Bank of India",
    shortName: "Union Bank",
    slug: "union-bank",
    website: "https://www.unionbankofindia.co.in/",
  },

  iob: {
    name: "Indian Overseas Bank",
    shortName: "IOB",
    slug: "iob",
    website: "https://www.iob.in/",
  },

  iocl: {
    name: "Indian Oil Corporation Limited",
    shortName: "IOCL",
    slug: "iocl",
    website: "https://iocl.com/",
  },

  ongc: {
    name: "Oil and Natural Gas Corporation",
    shortName: "ONGC",
    slug: "ongc",
    website: "https://ongcindia.com/",
  },

  nbems: {
    name: "National Board of Examinations in Medical Sciences",
    shortName: "NBEMS",
    slug: "nbems",
    website: "https://natboard.edu.in/",
  },

  wcl: {
    name: "Western Coalfields Limited",
    shortName: "WCL",
    slug: "wcl",
    website: "https://www.westerncoal.in/",
  },

  rcfl: {
    name: "Rashtriya Chemicals and Fertilizers Limited",
    shortName: "RCFL",
    slug: "rcfl",
    website: "https://www.rcfltd.com/",
  },

  upessc: {
    name: "Uttar Pradesh Education Service Selection Commission",
    shortName: "UPESSC",
    slug: "upessc",
    website: "https://upessc.org/",
  },

  patnaHighCourt: {
    name: "Patna High Court",
    shortName: "Patna High Court",
    slug: "patna-high-court",
    website: "https://patnahighcourt.gov.in/",
  },

  delhiCantonment: {
    name: "Delhi Cantonment Board",
    shortName: "DCB",
    slug: "delhi-cantonment-board",
    website: "https://delhi.cantt.gov.in/",
  },

  rrc: {
    name: "Railway Recruitment Cell",
    shortName: "RRC",
    slug: "rrc",
    website: "https://indianrailways.gov.in/",
  },

  other: {
    name: "Government Recruitment",
    shortName: "Government",
    slug: "government-recruitment",
    website: "",
  },
};

/* =====================================================
   AXIOS
===================================================== */

const http = axios.create({
  timeout: 30000,

  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  },
});

/* =====================================================
   HELPERS
===================================================== */

function cleanText(value = "") {
  return value
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

function slugify(text = "") {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 180);
}

function detectOrganization(title = "") {
  const t = title.toLowerCase();

  if (t.includes("bpssc")) return "bpssc";
  if (t.includes("bihar police")) return "bpssc";
  if (t.includes("csbc")) return "csbc";

  if (t.includes("bihar public service") || t.includes("bpsc"))
    return "bpsc";

  if (t.includes("ssc ") || t.startsWith("ssc"))
    return "ssc";

  if (t.includes("ibps"))
    return "ibps";

  if (t.includes("sbi ") || t.includes("state bank"))
    return "sbi";

  if (t.includes("pnb") || t.includes("punjab national bank"))
    return "pnb";

  if (t.includes("rrb ") || t.includes("railway rrb"))
    return "railway";

  if (t.includes("railway"))
    return "railway";

  if (t.includes("isro"))
    return "isro";

  if (t.includes("aiims"))
    return "aiims";

  if (t.includes("upsssc"))
    return "upsssc";

  if (t.includes("uppsc"))
    return "uppsc";

  if (t.includes("upessc"))
    return "upessc";

  if (t.includes("mpesb"))
    return "mpesb";

  if (t.includes("mppsc"))
    return "mppsc";

  if (t.includes("jssc"))
    return "jssc";

  if (t.includes("uksssc"))
    return "uksssc";

  if (t.includes("rpsc"))
    return "rpsc";

  if (t.includes("sjvn"))
    return "sjvn";

  if (t.includes("igcar"))
    return "igcar";

  if (t.includes("bank of baroda"))
    return "bankOfBaroda";

  if (t.includes("union bank"))
    return "unionBank";

  if (t.includes("iob ") || t.includes("indian overseas bank"))
    return "iob";

  if (t.includes("iocl"))
    return "iocl";

  if (t.includes("ongc"))
    return "ongc";

  if (t.includes("nbems"))
    return "nbems";

  if (t.includes("wcl"))
    return "wcl";

  if (t.includes("rcfl"))
    return "rcfl";

  if (t.includes("patna high court"))
    return "patnaHighCourt";

  if (t.includes("delhi cantonment"))
    return "delhiCantonment";

  if (t.includes("rrc "))
    return "rrc";

  if (t.includes("indian army"))
    return "indianArmy";

  if (t.includes("indian navy"))
    return "indianNavy";

  if (t.includes("indian airforce") ||
      t.includes("indian air force"))
    return "indianAirForce";

  if (t.includes("himachal"))
    return "himachal";

  if (t.includes("uttarakhand"))
    return "uttarakhand";

  if (t.includes("rajasthan"))
    return "rajasthan";

  if (t.includes("chhattisgarh"))
    return "chhattisgarh";

  return "other";
}

function detectType(title = "") {
  const t = title.toLowerCase();

  if (
    t.includes("admit card") ||
    t.includes("admitcard")
  ) {
    return "admit-card";
  }

  if (
    t.includes("result") ||
    t.includes("merit list")
  ) {
    return "result";
  }

  if (
    t.includes("answer key") ||
    t.includes("answer-key")
  ) {
    return "answer-key";
  }

  if (
    t.includes("syllabus") ||
    t.includes("exam pattern")
  ) {
    return "syllabus";
  }

  if (
    t.includes("admission") ||
    t.includes("counselling") ||
    t.includes("counseling")
  ) {
    return "admission";
  }

  return "job";
}

/* =====================================================
   EXTRACT LAST DATE
===================================================== */

function extractLastDate(text) {
  const regex =
    /(?:last date|last date to apply|closing date)[^0-9]{0,50}(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i;

  const match = text.match(regex);

  if (match) {
    return cleanText(match[1]);
  }

  return null;
}

/* =====================================================
   EXTRACT VACANCY FROM TITLE
===================================================== */

function extractVacancyFromTitle(title) {
  const match = title.match(
    /\(?([\d,]+)\s*(?:Posts?|Vacancies?)\)?/i
  );

  if (!match) {
    return null;
  }

  const total = Number(
    match[1].replace(/,/g, "")
  );

  return Number.isFinite(total)
    ? total
    : null;
}

/* =====================================================
   FETCH
===================================================== */

async function fetchPage(url) {
  try {
    const response = await http.get(url);

    return cheerio.load(response.data);
  } catch (error) {
    console.log(
      `Failed to fetch: ${url}`
    );

    return null;
  }
}

/* =====================================================
   GET LATEST JOB LINKS
===================================================== */

async function getLatestJobs() {
  console.log(
    "Fetching latest jobs..."
  );

  const $ = await fetchPage(
    SOURCE_URL
  );

  if (!$) {
    return [];
  }

  const jobs = [];
  const seen = new Set();

  $("a").each((index, element) => {
    const title = cleanText(
      $(element).text()
    );

    let href =
      $(element).attr("href");

    if (!title || !href) {
      return;
    }

    href = new URL(
      href,
      SOURCE_URL
    ).href;

    const isJob =
      title.length >= 15 &&
      (
        title.includes("Online Form") ||
        title.includes("Recruitment") ||
        title.includes("Apprentice") ||
        title.includes("Bharti") ||
        title.includes("Course") ||
        title.includes("SET") ||
        title.includes("PET") ||
        title.includes("Correction") ||
        title.includes("Various Post")
      );

    if (!isJob) {
      return;
    }

    if (
      href.includes("/category/") ||
      href === SOURCE_URL
    ) {
      return;
    }

    if (seen.has(href)) {
      return;
    }

    seen.add(href);

    jobs.push({
      title,
      url: href,
    });
  });

  return jobs.slice(
    0,
    MAX_ITEMS
  );
}

/* =====================================================
   CREATE / GET ORGANIZATION
===================================================== */

async function getOrganization(key) {
  const data =
    ORGANIZATIONS[key] ||
    ORGANIZATIONS.other;

  let organization =
    await Organization.findOne({
      slug: data.slug,
    });

  if (!organization) {
    organization =
      await Organization.create(data);

    console.log(
      `Organization created: ${data.shortName}`
    );
  }

  return organization;
}

/* =====================================================
   PARSE DETAIL PAGE
===================================================== */

async function parseJob(job) {
  const $ =
    await fetchPage(job.url);

  if (!$) {
    return null;
  }

  const pageText =
    cleanText(
      $("body").text()
    );

  const h1 =
    cleanText(
      $("h1").first().text()
    );

  const title =
    h1 || job.title;

  const lastDate =
    extractLastDate(pageText);

  const vacancy =
    extractVacancyFromTitle(
      title
    );

  const organizationKey =
    detectOrganization(title);

  const type =
    detectType(title);

  const organization =
    await getOrganization(
      organizationKey
    );

  const importantLinks = [];

  $("a").each(
    (index, element) => {
      const text =
        cleanText(
          $(element).text()
        );

      const href =
        $(element).attr("href");

      if (
        !text ||
        !href ||
        !/^https?:\/\//i.test(
          href
        )
      ) {
        return;
      }

      if (
        /official|apply|notification|download|website/i.test(
          text
        )
      ) {
        importantLinks.push({
          label: text.substring(
            0,
            150
          ),
          url: href,
        });
      }
    }
  );

  const uniqueLinks =
    Array.from(
      new Map(
        importantLinks.map(
          (item) => [
            item.url,
            item,
          ]
        )
      ).values()
    ).slice(0, 10);

  const shortDescription =
    `${title}. Check recruitment details, important dates, eligibility and official links.`;

  const postData = {
    title,

    slug: slugify(title),

    type,

    organization:
      organization._id,

    shortDescription,

    content:
      `${title} - Candidates should verify complete details from the official recruitment notification and official organization website.`,

    status: "published",

    featured: false,

    importantDates:
      lastDate
        ? [
            {
              label: "Last Date",
              date: lastDate,
            },
          ]
        : [],

    applicationFee: [],

    vacancies:
      vacancy
        ? [
            {
              postName: title,
              total: vacancy,
            },
          ]
        : [],

    eligibility:
      "Please check the official recruitment notification for educational qualification, age limit and other eligibility requirements.",

    selectionProcess: [],

    howToApply:
      "Candidates should visit the official organization website and follow the instructions given in the official recruitment notification.",

    importantLinks:
      uniqueLinks,

    faq: [
      {
        question:
          `What is ${title}?`,
        answer:
          `This is a recruitment/update listed on the latest jobs page. Candidates should verify the complete details from the official notification.`,
      },
    ],

    publishedAt:
      new Date(),
  };

  return {
    postData,
    sourceUrl: job.url,
  };
}

/* =====================================================
   SAVE POST
===================================================== */

async function savePost(
  postData,
  sourceUrl
) {
  const existing =
    await Post.findOne({
      slug: postData.slug,
    });

  if (existing) {
    console.log(
      `Skipped: ${postData.title}`
    );

    return "skipped";
  }

  await Post.create(
    postData
  );

  console.log(
    `Inserted: ${postData.title}`
  );

  console.log(
    `Source: ${sourceUrl}`
  );

  return "inserted";
}

/* =====================================================
   MAIN
===================================================== */

async function syncLatestJobs() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI missing in .env"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );

    const jobs =
      await getLatestJobs();

    console.log(
      `Found ${jobs.length} latest jobs`
    );

    let inserted = 0;
    let skipped = 0;
    let failed = 0;

    for (const job of jobs) {
      try {
        console.log("");
        console.log(
          `Processing: ${job.title}`
        );

        const parsed =
          await parseJob(job);

        if (!parsed) {
          failed++;
          continue;
        }

        const result =
          await savePost(
            parsed.postData,
            parsed.sourceUrl
          );

        if (
          result ===
          "inserted"
        ) {
          inserted++;
        } else {
          skipped++;
        }
      } catch (error) {
        failed++;

        console.log(
          `Failed: ${job.title}`
        );

        console.log(
          error.message
        );
      }
    }

    console.log("");
    console.log(
      "================================"
    );
    console.log(
      "LATEST JOB SYNC COMPLETE"
    );
    console.log(
      "================================"
    );

    console.log(
      `Found   : ${jobs.length}`
    );

    console.log(
      `Inserted: ${inserted}`
    );

    console.log(
      `Skipped : ${skipped}`
    );

    console.log(
      `Failed  : ${failed}`
    );

    console.log(
      "================================"
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "SYNC ERROR:"
    );

    console.error(
      error
    );

    if (
      mongoose.connection.readyState
    ) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

syncLatestJobs();