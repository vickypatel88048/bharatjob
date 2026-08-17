import axios from "axios";
import * as cheerio from "cheerio";

const ALLOWED_PROTOCOLS = ["http:", "https:"];

// =========================================================
// URL VALIDATION
// =========================================================

function validateUrl(value) {
  try {
    const url = new URL(value);

    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      throw new Error("Only HTTP/HTTPS URLs are allowed.");
    }

    const hostname = url.hostname.toLowerCase();

    const blockedHosts = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "::1",
    ];

    if (blockedHosts.includes(hostname)) {
      throw new Error("This URL is not allowed.");
    }

    return url;
  } catch {
    throw new Error("Invalid URL.");
  }
}

// =========================================================
// CLEAN TEXT
// =========================================================

function cleanText(value = "") {
  return String(value)
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

// =========================================================
// SLUG
// =========================================================

function createSlug(title) {
  return cleanText(title)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// =========================================================
// TYPE DETECTION
// =========================================================

function detectType(text) {
  const value = text.toLowerCase();

  if (
    value.includes("answer key") ||
    value.includes("answer-key")
  ) {
    return "answer-key";
  }

  if (
    value.includes("admit card") ||
    value.includes("admit-card") ||
    value.includes("hall ticket")
  ) {
    return "admit-card";
  }

  if (
    value.includes("result") ||
    value.includes("merit list") ||
    value.includes("selection list")
  ) {
    return "result";
  }

  if (
    value.includes("admission") ||
    value.includes("entrance form")
  ) {
    return "admission";
  }

  if (
    value.includes("syllabus") ||
    value.includes("exam pattern")
  ) {
    return "syllabus";
  }

  return "job";
}

// =========================================================
// ORGANIZATION DETECTION
// =========================================================

function detectOrganization(text) {
  const value = text.toLowerCase();

  const organizations = [
    {
      name: "Staff Selection Commission",
      shortName: "SSC",
      slug: "ssc",
      website: "https://ssc.gov.in/",
    },
    {
      name: "Union Public Service Commission",
      shortName: "UPSC",
      slug: "upsc",
      website: "https://upsc.gov.in/",
    },
    {
      name: "Bihar Public Service Commission",
      shortName: "BPSC",
      slug: "bpsc",
      website: "https://bpsc.bihar.gov.in/",
    },
    {
      name: "Bihar Technical Service Commission",
      shortName: "BTSC",
      slug: "btsc",
      website: "https://btsc.bihar.gov.in/",
    },
    {
      name: "Bihar Police Sub-Ordinate Services Commission",
      shortName: "BPSSC",
      slug: "bpssc",
      website: "https://bpssc.bihar.gov.in/",
    },
    {
      name: "Central Selection Board of Constable",
      shortName: "CSBC",
      slug: "csbc",
      website: "https://csbc.bihar.gov.in/",
    },
    {
      name: "Institute of Banking Personnel Selection",
      shortName: "IBPS",
      slug: "ibps",
      website: "https://www.ibps.in/",
    },
    {
      name: "Railway Recruitment Board",
      shortName: "RRB",
      slug: "rrb",
      website: "https://indianrailways.gov.in/",
    },
    {
      name: "Indian Space Research Organisation",
      shortName: "ISRO",
      slug: "isro",
      website: "https://www.isro.gov.in/",
    },
    {
      name: "Delhi Subordinate Services Selection Board",
      shortName: "DSSSB",
      slug: "dsssb",
      website: "https://dsssb.delhi.gov.in/",
    },
    {
      name: "Patna High Court",
      shortName: "Patna High Court",
      slug: "patna-high-court",
      website: "https://patnahighcourt.gov.in/",
    },
    {
      name: "Punjab National Bank",
      shortName: "PNB",
      slug: "pnb",
      website: "https://www.pnbindia.in/",
    },
  ];

  return (
    organizations.find(
      (item) =>
        value.includes(item.name.toLowerCase()) ||
        value.includes(item.shortName.toLowerCase())
    ) || {
      name: "Government Organization",
      shortName: "Government Organization",
      slug: "government-organization",
      website: "",
    }
  );
}

// =========================================================
// SECTION EXTRACTION
// =========================================================

function extractSectionText($, labels) {
  let result = "";

  $("h1, h2, h3, h4, h5, strong, b").each(
    (_, element) => {
      const heading = cleanText($(element).text());

      const matched = labels.some((label) =>
        heading
          .toLowerCase()
          .includes(label.toLowerCase())
      );

      if (!matched) return;

      const parentText = cleanText(
        $(element).parent().text()
      );

      if (parentText.length > result.length) {
        result = parentText;
      }
    }
  );

  return result;
}

// =========================================================
// IMPORTANT DATES
// =========================================================

function extractDates($) {
  const dates = [];

  $("tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => cleanText($(cell).text()))
      .get();

    if (cells.length < 2) return;

    const label = cells[0];
    const date = cells.slice(1).join(" ");

    const lowerLabel = label.toLowerCase();

    const isDateField =
      lowerLabel.includes("start date") ||
      lowerLabel.includes("apply start") ||
      lowerLabel.includes("online apply start") ||
      lowerLabel.includes("application start") ||
      lowerLabel.includes("last date") ||
      lowerLabel.includes("apply last") ||
      lowerLabel.includes("online apply last") ||
      lowerLabel.includes("application last") ||
      lowerLabel.includes("fee payment") ||
      lowerLabel.includes("exam date") ||
      lowerLabel.includes("admit card") ||
      lowerLabel.includes("result date");

    if (isDateField && date) {
      dates.push({
        label,
        date,
      });
    }
  });

  return dates;
}

// =========================================================
// FEES
// =========================================================

function extractFees($) {
  const fees = [];

  $("tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => cleanText($(cell).text()))
      .get();

    if (cells.length < 2) return;

    const joined = cells.join(" ").toLowerCase();

    if (
      joined.includes("fee") ||
      joined.includes("rs.") ||
      joined.includes("₹") ||
      joined.includes("application fee")
    ) {
      fees.push({
        category: cells[0],
        amount: cells.slice(1).join(" "),
      });
    }
  });

  return fees.slice(0, 20);
}

// =========================================================
// VACANCIES
// =========================================================

function extractVacancies($) {
  const vacancies = [];

  $("tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => cleanText($(cell).text()))
      .get();

    if (cells.length < 2) return;

    const numberText = cells[cells.length - 1];

    // FIXED REGEX
    const match = numberText.match(/\d[\d,]*/);

    if (!match) return;

    const number = Number(
      match[0].replace(/,/g, "")
    );

    if (!Number.isFinite(number)) return;

    const postName = cells.slice(0, -1).join(" ");

    if (!postName) return;

    const lowerPostName = postName.toLowerCase();

    if (
      lowerPostName.includes("total") ||
      lowerPostName.includes("category") ||
      lowerPostName === "post"
    ) {
      return;
    }

    vacancies.push({
      postName,
      total: number,
    });
  });

  return vacancies.slice(0, 100);
}

// =========================================================
// AGE LIMIT
// =========================================================

function extractAgeLimit(text) {
  const result = {
    minimum: "",
    maximum: "",
    relaxation: "",
  };

  const minMatch = text.match(
    /minimum\s*(?:age)?\s*[:\-]?\s*(\d+\s*years?)/i
  );

  const maxMatch = text.match(
    /maximum\s*(?:age)?\s*[:\-]?\s*(\d+\s*years?)/i
  );

  if (minMatch) {
    result.minimum = minMatch[1];
  }

  if (maxMatch) {
    result.maximum = maxMatch[1];
  }

  const relaxationMatch = text.match(
    /age relaxation[^.:\n]*/i
  );

  if (relaxationMatch) {
    result.relaxation = cleanText(
      relaxationMatch[0]
    );
  }

  return result;
}

// =========================================================
// IMPORTANT LINKS
// =========================================================

function extractLinks($, sourceUrl) {
  const links = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    const label = cleanText(
      $(element).text()
    );

    if (!href || !label) return;

    try {
      const absoluteUrl = new URL(
        href,
        sourceUrl
      ).href;

      const lowerLabel = label.toLowerCase();

      if (
        lowerLabel.includes("apply") ||
        lowerLabel.includes("notification") ||
        lowerLabel.includes("official") ||
        lowerLabel.includes("download") ||
        lowerLabel.includes("admit") ||
        lowerLabel.includes("result") ||
        lowerLabel.includes("syllabus") ||
        lowerLabel.includes("answer")
      ) {
        links.push({
          label,
          url: absoluteUrl,
        });
      }
    } catch {
      // Ignore invalid URL
    }
  });

  const unique = [];
  const seen = new Set();

  for (const item of links) {
    if (seen.has(item.url)) continue;

    seen.add(item.url);
    unique.push(item);
  }

  return unique.slice(0, 30);
}

// =========================================================
// CONTENT
// =========================================================

function extractContent($) {
  const selectors = [
    "article",
    ".entry-content",
    ".post-content",
    ".td-post-content",
    "main",
  ];

  for (const selector of selectors) {
    const element = $(selector).first();

    if (element.length) {
      const text = cleanText(
        element.text()
      );

      if (text.length > 300) {
        return text;
      }
    }
  }

  return cleanText(
    $("body").text()
  );
}

// =========================================================
// PARSE SINGLE POST
// =========================================================

async function parsePostPage(url) {
  const response = await axios.get(url, {
    timeout: 20000,

    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",

      Accept:
        "text/html,application/xhtml+xml",
    },
  });

  const $ = cheerio.load(response.data);

  const title =
    cleanText(
      $("h1").first().text()
    ) ||
    cleanText(
      $("title").text()
    );

  const content = extractContent($);

  const fullText = `${title} ${content}`;

  const organization =
    detectOrganization(fullText);

  const type =
    detectType(fullText);

  const dates =
    extractDates($);

  const fees =
    extractFees($);

  const vacancies =
    extractVacancies($);

  const ageLimit =
    extractAgeLimit(fullText);

  const importantLinks =
    extractLinks($, url);

  const eligibility =
    extractSectionText($, [
      "eligibility",
      "education qualification",
      "educational qualification",
      "qualification",
    ]);

  const selectionProcessText =
    extractSectionText($, [
      "selection process",
      "mode of selection",
      "selection procedure",
    ]);

  const howToApply =
    extractSectionText($, [
      "how to apply",
      "how to fill",
      "how to fill form",
    ]);

  const salary =
    extractSectionText($, [
      "salary",
      "pay scale",
      "pay level",
      "salary / pay",
    ]);

  const shortDescription =
    content.substring(0, 500);

  return {
    title,

    slug:
      createSlug(title) ||
      `imported-post-${Date.now()}`,

    type,

    organization,

    shortDescription,

    content,

    status: "draft",

    featured: false,

    importantDates: dates,

    applicationFee: fees,

    ageLimit,

    vacancies,

    eligibility,

    selectionProcess:
      selectionProcessText
        ? selectionProcessText
            .split(/[•\n]+/)
            .map(cleanText)
            .filter(Boolean)
        : [],

    salary,

    howToApply,

    importantLinks,

    faq: [],

    sourceUrl: url,

    importedAt: new Date(),
  };
}

// =========================================================
// GET POST LINKS FROM LIST PAGE
// =========================================================

async function getPostLinks(sourceUrl) {
  const response = await axios.get(
    sourceUrl,
    {
      timeout: 20000,

      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",

        Accept:
          "text/html,application/xhtml+xml",
      },
    }
  );

  const $ = cheerio.load(
    response.data
  );

  const links = [];

  $("a[href]").each((_, element) => {
    const href =
      $(element).attr("href");

    const text =
      cleanText(
        $(element).text()
      );

    if (!href || !text) return;

    try {
      const absoluteUrl =
        new URL(
          href,
          sourceUrl
        ).href;

      const lowerText =
        text.toLowerCase();

      const isJobLike =
        lowerText.includes("online form") ||
        lowerText.includes("recruitment") ||
        lowerText.includes("vacancy") ||
        lowerText.includes("bharti") ||
        lowerText.includes("post") ||
        lowerText.includes("officer") ||
        lowerText.includes("assistant") ||
        lowerText.includes("teacher") ||
        lowerText.includes("engineer") ||
        lowerText.includes("clerk") ||
        lowerText.includes("apprentice") ||
        lowerText.includes("constable") ||
        lowerText.includes("admit card") ||
        lowerText.includes("result") ||
        lowerText.includes("answer key");

      if (
        absoluteUrl.includes(
          "sarkariresult.com.cm"
        ) &&
        isJobLike
      ) {
        links.push({
          title: text,
          url: absoluteUrl,
        });
      }
    } catch {
      // Ignore invalid links
    }
  });

  const unique = [];
  const seen = new Set();

  for (const item of links) {
    if (seen.has(item.url)) continue;

    seen.add(item.url);
    unique.push(item);
  }

  return unique;
}

// =========================================================
// IMPORT POSTS
// =========================================================

export async function importPostsFromUrl(
  req,
  res
) {
  try {
    const {
      url,
      single = false,
    } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    const parsedUrl =
      validateUrl(url);

    // =====================================================
    // SINGLE POST
    // =====================================================

    if (single) {
      const post =
        await parsePostPage(
          parsedUrl.href
        );

      return res.json({
        success: true,

        count: 1,

        post,

        posts: [post],
      });
    }

    // =====================================================
    // LIST PAGE
    // =====================================================

    const links =
      await getPostLinks(
        parsedUrl.href
      );

    if (!links.length) {
      return res.status(404).json({
        success: false,
        message:
          "No post links found on this page.",
      });
    }

    const posts = [];

    for (
      const item of links.slice(0, 100)
    ) {
      try {
        const post =
          await parsePostPage(
            item.url
          );

        if (!post.title) {
          continue;
        }

        posts.push(post);

        console.log(
          `Parsed ${posts.length}:`,
          post.title
        );
      } catch (error) {
        console.log(
          "Parse failed:",
          item.url,
          error.message
        );
      }
    }

    // =====================================================
    // IMPORTANT
    // FRONTEND NEEDS "post"
    // =====================================================

    return res.json({
      success: true,

      sourceUrl:
        parsedUrl.href,

      count:
        posts.length,

      // First post for current preview UI
      post:
        posts.length > 0
          ? posts[0]
          : null,

      // All imported posts
      posts,
    });
  } catch (error) {
    console.error(
      "Import URL Error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to import data.",
    });
  }
}