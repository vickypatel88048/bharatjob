import Organization from "../models/Organization.js";

// ==========================================
// CREATE ORGANIZATION - ADMIN ONLY
// ==========================================
export const createOrganization = async (req, res) => {
  try {
    const {
      name,
      shortName,
      slug,
      website,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existing = await Organization.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Organization already exists",
      });
    }

    const organization =
      await Organization.create({
        name: name.trim(),
        shortName: shortName?.trim() || "",
        slug: slug.toLowerCase().trim(),
        website: website?.trim() || "",
      });

    return res.status(201).json({
      success: true,
      message:
        "Organization created successfully",
      organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ORGANIZATIONS - PUBLIC
// ==========================================
export const getOrganizations = async (
  req,
  res
) => {
  try {
    const organizations =
      await Organization.find({
        isActive: true,
      }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: organizations.length,
      organizations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE ORGANIZATION - ADMIN ONLY
// ==========================================
export const updateOrganization = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const organization =
      await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const {
      name,
      shortName,
      slug,
      website,
      isActive,
    } = req.body;

    // ==========================================
    // CHECK DUPLICATE SLUG
    // ==========================================

    if (
      slug &&
      slug.toLowerCase().trim() !==
        organization.slug
    ) {
      const existing =
        await Organization.findOne({
          slug: slug.toLowerCase().trim(),
          _id: { $ne: id },
        });

      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "Organization with this slug already exists",
        });
      }
    }

    // ==========================================
    // UPDATE FIELDS
    // ==========================================

    if (name !== undefined) {
      organization.name = name.trim();
    }

    if (shortName !== undefined) {
      organization.shortName =
        shortName.trim();
    }

    if (slug !== undefined) {
      organization.slug =
        slug.toLowerCase().trim();
    }

    if (website !== undefined) {
      organization.website =
        website.trim();
    }

    if (typeof isActive === "boolean") {
      organization.isActive = isActive;
    }

    await organization.save();

    return res.status(200).json({
      success: true,
      message:
        "Organization updated successfully",
      organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DEACTIVATE ORGANIZATION - ADMIN ONLY
// ==========================================
export const deactivateOrganization = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const organization =
      await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (!organization.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Organization is already inactive",
      });
    }

    organization.isActive = false;

    await organization.save();

    return res.status(200).json({
      success: true,
      message:
        "Organization deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};