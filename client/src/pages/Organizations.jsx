import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

const Organizations = () => {
  const [organizations, setOrganizations] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openModal, setOpenModal] =
    useState(false);

  const [editingOrganization, setEditingOrganization] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    slug: "",
    website: "",
  });

  // ==========================================
  // LOAD ORGANIZATIONS
  // ==========================================

  const loadOrganizations = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API}/organizations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrganizations(
        response.data.organizations || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load organizations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  // ==========================================
  // FORM
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;

    setForm((prev) => ({
      ...prev,
      name,
      slug: editingOrganization
        ? prev.slug
        : generateSlug(name),
    }));
  };

  // ==========================================
  // OPEN ADD
  // ==========================================

  const openAddModal = () => {
    setEditingOrganization(null);

    setForm({
      name: "",
      shortName: "",
      slug: "",
      website: "",
    });

    setOpenModal(true);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const openEditModal = (organization) => {
    setEditingOrganization(organization);

    setForm({
      name: organization.name || "",
      shortName:
        organization.shortName || "",
      slug: organization.slug || "",
      website:
        organization.website || "",
    });

    setOpenModal(true);
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("adminToken");

      if (editingOrganization) {
        await axios.put(
          `${API}/organizations/${editingOrganization._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        toast.success(
          "Organization updated successfully"
        );
      } else {
        await axios.post(
          `${API}/organizations`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        toast.success(
          "Organization created successfully"
        );
      }

      setOpenModal(false);
      loadOrganizations();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save organization"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DEACTIVATE
  // ==========================================

  const handleDeactivate = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this organization?"
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("adminToken");

      await axios.delete(
        `${API}/organizations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Organization deactivated"
      );

      loadOrganizations();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to deactivate organization"
      );
    }
  };

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Organizations
              </h1>

              <p className="text-slate-500 mt-1">
                Manage government organizations
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium"
            >
              <Plus size={19} />
              Add Organization
            </button>

          </div>


          {/* TABLE */}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Loading organizations...
              </div>
            ) : organizations.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No organizations found.
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-slate-50 border-b">

                    <tr>

                      <th className="text-left px-5 py-4">
                        Organization
                      </th>

                      <th className="text-left px-5 py-4">
                        Short Name
                      </th>

                      <th className="text-left px-5 py-4">
                        Website
                      </th>

                      <th className="text-left px-5 py-4">
                        Status
                      </th>

                      <th className="text-right px-5 py-4">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {organizations.map(
                      (organization) => (

                        <tr
                          key={organization._id}
                          className="hover:bg-slate-50"
                        >

                          <td className="px-5 py-4">

                            <p className="font-semibold text-slate-800">
                              {organization.name}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              /{organization.slug}
                            </p>

                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {organization.shortName ||
                              "-"}
                          </td>

                          <td className="px-5 py-4">

                            {organization.website ? (
                              <a
                                href={
                                  organization.website
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            ) : (
                              "-"
                            )}

                          </td>

                          <td className="px-5 py-4">

                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Active
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  openEditModal(
                                    organization
                                  )
                                }
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeactivate(
                                    organization._id
                                  )
                                }
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                title="Deactivate"
                              >
                                <Trash2 size={18} />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>


        {/* MODAL */}

        {openModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

            <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">

              <div className="flex items-center justify-between px-5 py-4 border-b">

                <h2 className="text-lg font-semibold text-slate-800">
                  {editingOrganization
                    ? "Edit Organization"
                    : "Add Organization"}
                </h2>

                <button
                  onClick={() =>
                    setOpenModal(false)
                  }
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X size={20} />
                </button>

              </div>


              <form
                onSubmit={handleSubmit}
                className="p-5 space-y-4"
              >

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Organization Name
                  </label>

                  <input
                    value={form.name}
                    onChange={handleNameChange}
                    className={inputClass}
                    placeholder="Staff Selection Commission"
                    required
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Name
                  </label>

                  <input
                    name="shortName"
                    value={form.shortName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="SSC"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slug
                  </label>

                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="ssc"
                    required
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website
                  </label>

                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://ssc.gov.in"
                  />
                </div>


                <div className="flex justify-end gap-3 pt-3">

                  <button
                    type="button"
                    onClick={() =>
                      setOpenModal(false)
                    }
                    className="px-4 py-2.5 rounded-lg border bg-white hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingOrganization
                      ? "Update"
                      : "Create"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default Organizations;