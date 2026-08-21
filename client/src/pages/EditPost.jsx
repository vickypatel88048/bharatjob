import { useEffect, useState } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

// Stable post editor: keep the original single post type flow.
const API = `${import.meta.env.VITE_API_URL || "https://bharatjob-1.onrender.com"}/api`;

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [form, setForm] = useState({ title:"", slug:"", type:"job", organization:"", shortDescription:"", content:"", status:"draft", featured:false, importantDates:[], applicationFee:[], ageLimit:{minimum:"",maximum:"",relaxation:""}, vacancies:[], eligibility:"", selectionProcess:[], salary:"", howToApply:"", importantLinks:[], faq:[] });

  const authConfig = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login", { replace: true });
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      toast.error("Session expired. Please login again.");
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  };

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const config = authConfig();
      if (!config) return;
      const [postResponse, organizationResponse] = await Promise.all([
        axios.get(`${API}/posts/id/${id}`, config),
        axios.get(`${API}/organizations`, config),
      ]);
      const post = postResponse.data.post;
      setOrganizations(organizationResponse.data.organizations || []);
      setForm({
        title: post.title || "", slug: post.slug || "", type: post.type || "job",
        organization: post.organization?._id || post.organization || "",
        shortDescription: post.shortDescription || "", content: post.content || "",
        status: post.status || "draft", featured: post.featured || false,
        importantDates: post.importantDates || [], applicationFee: post.applicationFee || [],
        ageLimit: { minimum: post.ageLimit?.minimum || "", maximum: post.ageLimit?.maximum || "", relaxation: post.ageLimit?.relaxation || "" },
        vacancies: post.vacancies || [], eligibility: post.eligibility || "",
        selectionProcess: post.selectionProcess || [], salary: post.salary || "",
        howToApply: post.howToApply || "", importantLinks: post.importantLinks || [], faq: post.faq || [],
      });
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.response?.data?.message || "Failed to load post");
      if (error.response?.status !== 401) navigate("/admin/posts");
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const updateArrayItem = (field,index,key,value) => setForm(prev => ({...prev,[field]:prev[field].map((item,i)=>i===index?{...item,[key]:value}:item)}));
  const addArrayItem = (field,item) => setForm(prev => ({...prev,[field]:[...prev[field],item]}));
  const removeArrayItem = (field,index) => setForm(prev => ({...prev,[field]:prev[field].filter((_,i)=>i!==index)}));
  const updateAge = (field,value) => setForm(prev => ({...prev,ageLimit:{...prev.ageLimit,[field]:value}}));
  const updateSelection = (index,value) => setForm(prev => ({...prev,selectionProcess:prev.selectionProcess.map((item,i)=>i===index?value:item)}));
  const addSelection = () => setForm(prev => ({...prev,selectionProcess:[...prev.selectionProcess,""]}));
  const removeSelection = index => setForm(prev => ({...prev,selectionProcess:prev.selectionProcess.filter((_,i)=>i!==index)}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.slug.trim()) return toast.error("Slug is required");
    if (!form.organization) return toast.error("Organization is required");
    try {
      setSaving(true);
      const config = authConfig();
      if (!config) return;
      await axios.put(`${API}/posts/${id}`, form, { ...config, headers: { ...config.headers, "Content-Type":"application/json" } });
      toast.success("Post updated successfully");
      navigate("/admin/posts");
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.response?.data?.message || "Failed to update post");
    } finally { setSaving(false); }
  };

  const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  if (loading) return <AdminLayout><div className="min-h-screen flex items-center justify-center bg-slate-100"><p className="text-slate-500">Loading post...</p></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6"><button type="button" onClick={()=>navigate("/admin/posts")} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ArrowLeft size={20}/></button><div><h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Edit Post</h1><p className="text-slate-500 mt-1">Update notification details</p></div></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-5">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-2">Title *</label><input name="title" value={form.title} onChange={handleChange} className={inputClass} required/></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Slug *</label><input name="slug" value={form.slug} onChange={handleChange} className={inputClass} required/></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Type</label><select name="type" value={form.type} onChange={handleChange} className={inputClass}><option value="job">Job</option><option value="result">Result</option><option value="admit-card">Admit Card</option><option value="answer-key">Answer Key</option><option value="admission">Admission</option></select></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Organization *</label><select name="organization" value={form.organization} onChange={handleChange} className={inputClass} required><option value="">Select Organization</option>{organizations.map(o=><option key={o._id} value={o._id}>{o.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Status</label><select name="status" value={form.status} onChange={handleChange} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option></select></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label><textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows="3" className={inputClass}/></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-2">Content</label><textarea name="content" value={form.content} onChange={handleChange} rows="5" className={inputClass}/></div>
                <div className="md:col-span-2"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4"/><span className="text-sm font-medium text-slate-700">Featured Post</span></label></div>
              </div>
            </section>
            <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"><div className="flex justify-between items-center mb-5"><h2 className="text-lg font-semibold text-slate-800">Important Dates</h2><button type="button" onClick={()=>addArrayItem("importantDates",{label:"",date:""})} className="text-blue-600 flex items-center gap-1 text-sm font-medium"><Plus size={17}/>Add</button></div><div className="space-y-3">{form.importantDates.map((item,index)=><div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3"><input value={item.label||""} onChange={e=>updateArrayItem("importantDates",index,"label",e.target.value)} placeholder="Application Start" className={inputClass}/><input value={item.date||""} onChange={e=>updateArrayItem("importantDates",index,"date",e.target.value)} placeholder="10 August 2026" className={inputClass}/><button type="button" onClick={()=>removeArrayItem("importantDates",index)} className="text-red-600 p-2 rounded-lg"><Trash2 size={18}/></button></div>)}</div></section>
            <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"><div className="flex justify-between items-center mb-5"><h2 className="text-lg font-semibold text-slate-800">Selection Process</h2><button type="button" onClick={addSelection} className="text-blue-600 flex items-center gap-1 text-sm font-medium"><Plus size={17}/>Add</button></div><div className="space-y-3">{form.selectionProcess.map((item,index)=><div key={index} className="flex gap-3"><input value={item||""} onChange={e=>updateSelection(index,e.target.value)} className={inputClass}/><button type="button" onClick={()=>removeSelection(index)} className="text-red-600 p-2"><Trash2 size={18}/></button></div>)}</div></section>
            <div className="flex justify-end gap-3"><button type="button" onClick={()=>navigate("/admin/posts")} className="px-5 py-2.5 bg-white border rounded-lg">Cancel</button><button type="submit" disabled={saving} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60"><Save size={18}/>{saving?"Saving...":"Save Changes"}</button></div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
export default EditPost;
