// src/components/AdminDashboard.jsx
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Concept from "../assets/Concept_Logo_Black_April2025-01 2(1)(1).png";
import TheOutlineMain from "@/assets/TheOutlineMain.png";

import {
  Image as ImageIcon,
  Plus,
  Trash,
  Handshake,
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Search,
} from "lucide-react";

const API_BASE = "http://localhost:5000"; // change for production

const AdminDashboard = () => {
  // --- UI + form state
    const [activeSection, setActiveSection] = useState("dashboard");

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include", // important to include cookies
            });
            // redirect to login page
            window.location.href = "/adminLog";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };




   const [openSales , setOpenSales] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [projectType, setProjectType] = useState("interior");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Cover + Map file states + previews
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [mapFile, setMapFile] = useState(null);
  const [mapPreview, setMapPreview] = useState(null);

  // optional existing URL fallback when editing (server stored)
  const [projectCoverURL, setProjectCoverURL] = useState("");
  const [projectMapURL, setProjectMapURL] = useState("");

  // layout
  const [totalArea, setTotalArea] = useState("");
  const [floors, setFloors] = useState("");
  const [layoutRooms, setLayoutRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [ceilingHeight, setCeilingHeight] = useState("");

  // rooms: each room = { name: string, images: (File | string)[] }
  const [rooms, setRooms] = useState([]);

  // previews for room file objects: mapping "rIdx-iIdx" -> objectUrl
  const [roomPreviews, setRoomPreviews] = useState({});

  const previewUrlsRef = useRef([]); // keep track to revoke on cleanup

  const [projectsList, setProjectsList] = useState([]);
  const [salesList, setSalesList] = useState([]);

  const [openSale, setOpenSale] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Fetch data initially
  useEffect(() => {
    fetchProjects();
    fetchSales();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      const data = await res.json();
      setProjectsList(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sales`);
      if (!res.ok) {
        setSalesList([]);
        return;
      }
      const data = await res.json();
      setSalesList(data || []);
    } catch (err) {
      console.warn("Sales fetch failed:", err);
      setSalesList([]);
    }
  };

  // rooms helpers
  const addRoom = () => setRooms((r) => [...r, { name: "", images: [] }]);
  const updateRoom = (index, key, value) => {
    setRooms((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };
  const removeRoom = (index) =>
    setRooms((prev) => prev.filter((_, i) => i !== index));

  // remove single image from a room (either existing URL or new File)
  const removeRoomImage = (roomIdx, imgIdx) => {
    setRooms((prev) => {
      const copy = [...prev];
      const room = { ...copy[roomIdx] };
      room.images = (room.images || []).filter((_, i) => i !== imgIdx);
      copy[roomIdx] = room;
      return copy;
    });
    // Also remove preview if existed
    const key = `${roomIdx}-${imgIdx}`;
    if (roomPreviews[key]) {
      URL.revokeObjectURL(roomPreviews[key]);
      setRoomPreviews((p) => {
        const np = { ...p };
        delete np[key];
        return np;
      });
    }
  };

  // previews for cover and map (createObjectURL + revoke)
  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    if (!mapFile) {
      setMapPreview(null);
      return;
    }
    const url = URL.createObjectURL(mapFile);
    setMapPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [mapFile]);

  // room previews: create object URLs for File entries and revoke previous
  useEffect(() => {
    // revoke previous urls
    previewUrlsRef.current.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    previewUrlsRef.current = [];

    const newPreviews = {};
    rooms.forEach((room, rIdx) => {
      (room.images || []).forEach((img, iIdx) => {
        if (img instanceof File) {
          const key = `${rIdx}-${iIdx}`;
          const url = URL.createObjectURL(img);
          newPreviews[key] = url;
          previewUrlsRef.current.push(url);
        }
      });
    });

    setRoomPreviews(newPreviews);

    // cleanup on unmount
    return () => {
      previewUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      previewUrlsRef.current = [];
    };
  }, [rooms]);

  // ---------------- buildFormData ----------------
  // Strategy:
  // - rooms: send metadata (existing URLs) as JSON in "rooms"
  // - append **only new** File objects as "roomImages" (flat list)
  // - include "roomFilesCounts" to tell backend how many new files belong to each room
  // - send coverImage and mapImage as separate fields (or URLs if using existing)
  const buildProjectFormData = () => {
    const formData = new FormData();

    // Basic fields
    formData.append("title", projectTitle);
    formData.append("description", projectDescription);
    formData.append("type", projectType);
    formData.append(
      "layout",
      JSON.stringify({
        totalArea,
        floors,
        rooms: layoutRooms,
        bathrooms,
        ceilingHeight,
      })
    );

    // Rooms meta + append new files flat
    const roomsMeta = [];
    const newFilesCounts = [];
    rooms.forEach((r) => {
      const existingUrls = (r.images || []).filter((x) => typeof x === "string");
      const newFiles = (r.images || []).filter((x) => x instanceof File);
      roomsMeta.push({ name: r.name || "", photos: existingUrls });
      newFilesCounts.push(newFiles.length);
      newFiles.forEach((f) => formData.append("roomImages", f));
    });

    formData.append("rooms", JSON.stringify(roomsMeta));
    formData.append("roomFilesCounts", newFilesCounts.join(",")); // e.g. "2,0,1"

    // Cover & Map images (prefer new files; otherwise send existing URL)
    if (coverFile) {
      formData.append("coverImage", coverFile);
    } else if (projectCoverURL) {
      formData.append("coverImageURL", projectCoverURL);
    }

    if (mapFile) {
      formData.append("mapImage", mapFile);
    } else if (projectMapURL) {
      formData.append("mapImageURL", projectMapURL);
    }

    return formData;
  };

  // ---------------- Save Project ----------------
  const handleSaveProject = async () => {
    try {
      const formData = buildProjectFormData();

      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed saving project");
      }

      const saved = await res.json();
      console.log("Project saved:", saved);
      resetProjectForm();
      setOpenProject(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Error saving project: " + (err.message || ""));
    }
  };

  const resetProjectForm = () => {
    setProjectType("interior");
    setProjectTitle("");
    setProjectDescription("");
    setProjectCoverURL("");
    setProjectMapURL("");
    setCoverFile(null);
    setCoverPreview(null);
    setMapFile(null);
    setMapPreview(null);
    setTotalArea("");
    setFloors("");
    setLayoutRooms("");
    setBathrooms("");
    setCeilingHeight("");
    setRooms([]);
    setEditingProjectId(null);
    setRoomPreviews({});
  };

  // ---------------- Update Project ----------------
  const handleUpdateProject = async () => {
    if (!editingProjectId) return alert("No project selected for updating");
    try {
      const formData = buildProjectFormData();

      const res = await fetch(`${API_BASE}/api/projects/${editingProjectId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed updating project");
      }

      const updated = await res.json();
      console.log("Project updated:", updated);
      resetProjectForm();
      setOpenProject(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Error updating project: " + (err.message || ""));
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete project");
      }

      alert("Project deleted successfully");
      setProjectsList((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Check console.");
    }
  };

  // When editing a project, convert its rooms/photos into the rooms state format:
  const openEditModalWithProject = (proj) => {
    setEditingProjectId(proj._id);
    setProjectType(proj.type || "interior");
    setProjectTitle(proj.title || "");
    setProjectDescription(proj.description || "");
    // backend stores cover in `image`, map in `mapImage`
    setProjectCoverURL(proj.image || "");
    setProjectMapURL(proj.mapImage || "");
    setTotalArea(proj.layout?.totalArea || "");
    setFloors(proj.layout?.floors || "");
    setLayoutRooms(proj.layout?.rooms || "");
    setBathrooms(proj.layout?.bathrooms || "");
    setCeilingHeight(proj.layout?.ceilingHeight || "");
    // rooms: convert project.rooms (array of {name, photos: [url]}) to your state shape:
    setRooms(
      (proj.rooms || []).map((r) => ({
        name: r.name || "",
        images: (r.photos || []).slice(), // strings (existing)
      }))
    );
    setOpenProject(true);
  };

  // ---------- UI Render ----------
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
       {/* Sidebar */}
 {/* Sidebar */}
          <aside className="w-20 md:w-64 bg-white text-black shadow-xl flex flex-col">
              <div className="flex items-center justify-center md:justify-start">
                  <img
                      src={Concept}
                      alt="Concept Logo"
                      className="h-8 w-auto mt-4 mb-2 md:h-12 md:ml-6 md:mt-6 md:mb-3"
                  />
              </div>

              <nav className="flex-1 p-2 md:p-4 space-y-3">
                  <button
                      onClick={() => setActiveSection("dashboard")}
                      className={`flex items-center gap-1 md:gap-3 w-full p-3 rounded-lg transition ${activeSection === "dashboard"
                              ? "bg-[#D6DF25]"
                              : "hover:bg-[#f0f3a3]"
                          }`}
                  >
                      <LayoutDashboard size={18} />
                      <span className="hidden md:inline">Dashboard</span>
                  </button>

                  <button
                      onClick={() => setActiveSection("projects")}
                      className={`flex items-center gap-1 md:gap-3 w-full p-3 rounded-lg transition ${activeSection === "projects"
                              ? "bg-[#D6DF25]"
                              : "hover:bg-[#f0f3a3]"
                          }`}
                  >
                      <FolderKanban size={18} />
                      <span className="hidden md:inline">Projects</span>
                  </button>
              </nav>

              {/* Logout Button */}
              <div className="p-2 md:p-4 border-t border-gray-200">
                  <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 md:gap-3 w-full p-3 rounded-lg hover:bg-red-100 text-red-600 transition"
                  >
                      <LogOut size={18} />
                      <span className="hidden md:inline">Logout</span>
                  </button>
              </div>
          </aside>




      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm sticky top-0 z-10">
        

          <div className="flex items-center space-x-3">
            {activeSection !== "dashboard" && (
              <>
                <Button
                  onClick={() =>
                                      activeSection === "projects" ? setOpenProject(true) : setOpenSales(true)
                  }
                  className="flex items-center gap-2 bg-[#D7DF21] hover:bg-[#c8d322]"
                >
                  <Plus size={16} /> {activeSection === "projects" ? "Add Project" : "Add Sale"}
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <main className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-light mb-6">Welcome to Concept Admin</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-md">
                <h3 className="text-lg font-semibold">Total Projects</h3>
                <p className="text-3xl font-bold mt-2">{projectsList.length}</p>
              </Card>
              <Card className="p-6 shadow-md">
                <h3 className="text-lg font-semibold">Total Sales</h3>
                <p className="text-3xl font-bold mt-2">{salesList.length}</p>
              </Card>
              <Card className="p-6 shadow-md">
                <h3 className="text-lg font-semibold">Active Users</h3>
                <p className="text-3xl font-bold mt-2">—</p>
              </Card>
            </div>
          </main>
        )}

        {/* Projects */}
       {activeSection === "projects" && (
                  <main className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto">
                      {projectsList.length === 0 ? (
                          <p className="text-gray-500 col-span-full text-center">No projects yet. Click "Add Project" to create one.</p>
                      ) : (
                          projectsList.map((proj) => (
                              <Card
                                  key={proj._id}
                                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 min-h-[320px] md:min-h-[400px] flex flex-col"
                              >
                                  <div className="relative flex-shrink-0">
                                      <img
                                          src={proj.image}
                                          alt={proj.title}
                                          className="w-full h-32 md:h-52 object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                          <h3 className="text-lg font-semibold text-white">{proj.title}</h3>
                                      </div>
                                  </div>
                                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                                      <p className="text-gray-600 text-sm mb-4">{proj.description}</p>
                                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                          <div className="text-sm text-gray-500">
                                              <div>Total Area: {proj.layout?.totalArea}</div>
                                              <div>Rooms: {proj.layout?.rooms}</div>
                                          </div>
                                          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                              <Button
                                                  className="text-white hover:bg-[#D6DF25]/50 px-4 md:px-6 py-2 border-2 rounded-full font-semibold shadow-md flex-1 md:flex-none"
                                                  onClick={() => openEditModalWithProject(proj)}
                                              >
                                                  Edit
                                              </Button>
                                              <Button
                                                  className="bg-[#D7DF21] text-black hover:bg-[#D6DF25]/50 px-4 md:px-6 py-2 rounded-full font-semibold shadow-md flex-1 md:flex-none"
                                                  onClick={() => handleDelete(proj._id)}
                                              >
                                                  Delete
                                              </Button>
                                          </div>
                                      </div>
                                  </CardContent>
                              </Card>
                          ))
                      )}
                  </main>
              )}


        {/* Sales */}
        {activeSection === "sales" && (
          <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
            {salesList.length === 0 ? (
              <p className="text-gray-500">No sales yet. Click "Add Sale" to create one.</p>
            ) : (
              salesList.map((s) => (
                <Card
                  key={s._id}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={s.image || TheOutlineMain}
                      alt={s.title || s.unitName}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <h3 className="text-lg font-semibold text-white">{s.title || s.unitName}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm">Buyer: {s.buyer || "-"}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">${s.price || "-"}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => alert("Implement Edit Sale")}>Edit</Button>
                        <div className="w-full md:w-auto flex justify-center md:justify-start">
                          <Button className="bg-[#D7DF21] text-black hover:bg-[#D6DF25]/50 px-6 py-2 rounded-full font-semibold shadow-md">
                            CHAT WITH US
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </main>
        )}
      </div>

      {/* ---------------- Project Modal ---------------- */}
      <Dialog open={openProject} onOpenChange={setOpenProject}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl  text-[#D7DF21]">
              {editingProjectId ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-4">
            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium mb-1 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400">
                Project Type
              </label>
              <Select onValueChange={(v) => setProjectType(v || "interior")} value={projectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="exterior">Exterior</SelectItem>
                  <SelectItem value="both">Interior & Exterior</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Info */}
            <Input
              className="focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
              placeholder="Project Name"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />

            <Textarea placeholder="Project Description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />

            {/* Image / Floor plan */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cover Photo  (upload) </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                  <ImageIcon size={24} className="text-[#D7DF21] mb-2" />
                  <span className="text-sm text-gray-600">Drag & Drop or Click to Upload (jpg/png)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setCoverFile(f);
                        setProjectCoverURL(""); // using new file instead of existing URL
                      }
                    }}
                  />
                </label>
                {coverPreview && <img src={coverPreview} alt="cover preview" className="mt-2 w-48 h-32 object-cover rounded-md" />}
                {!coverPreview && projectCoverURL && <img src={projectCoverURL} alt="cover preview" className="mt-2 w-48 h-32 object-cover rounded-md" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Map Photo (upload) </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                  <ImageIcon size={24} className="text-[#D7DF21] mb-2" />
                  <span className="text-sm text-gray-600">Drag & Drop or Click to Upload (jpg/png)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setMapFile(f);
                        setProjectMapURL("");
                      }
                    }}
                  />
                </label>
                {mapPreview && <img src={mapPreview} alt="map preview" className="mt-2 w-48 h-32 object-cover rounded-md" />}
                {!mapPreview && projectMapURL && <img src={projectMapURL} alt="map preview" className="mt-2 w-48 h-32 object-cover rounded-md" />}
              </div>
            </div>

            {/* Layout Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Total Area (m²)" value={totalArea} onChange={(e) => setTotalArea(e.target.value)} />
              <Input placeholder="Floors" value={floors} onChange={(e) => setFloors(e.target.value)} />
              <Input placeholder="Rooms" value={layoutRooms} onChange={(e) => setLayoutRooms(e.target.value)} />
              <Input placeholder="Bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
              <Input placeholder="Ceiling Height (m)" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} />
            </div>

            {/* Dynamic Rooms */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Rooms</h3>
                <Button size="sm" onClick={addRoom} className="flex items-center gap-1">
                  <Plus size={16} /> Add Room
                </Button>
              </div>

              {rooms.map((room, idx) => (
                <div key={idx} className="border rounded-lg p-4 mb-3 bg-gray-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <Input placeholder="Room Name" value={room.name} onChange={(e) => updateRoom(idx, "name", e.target.value)} />
                    <Button variant="destructive" size="icon" onClick={() => removeRoom(idx)}>
                      <Trash size={16} />
                    </Button>
                  </div>

                  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-white">
                    <ImageIcon size={20} className="text-[#D7DF21] mb-1" />
                    <span className="text-sm text-gray-600">Upload Room Images</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        // append newly selected files after existing URLs
                        updateRoom(idx, "images", [...(room.images || []).filter(x => typeof x === "string"), ...files]);
                      }}
                    />
                  </label>

                  {room.images && room.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {room.images.map((file, i) => {
                        const key = `${idx}-${i}`;
                        const preview = typeof file === "string" ? file : roomPreviews[key] || "";
                        const alt = typeof file === "string" ? `room-img-${i}` : (file.name || `img-${i}`);
                        return (
                          <div key={i} className="relative w-full h-20 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center text-xs text-gray-600">
                            {preview ? <img src={preview} alt={alt} className="w-full h-full object-cover" /> : <div className="px-2">Preview unavailable</div>}
                            <button
                              onClick={() => removeRoomImage(idx, i)}
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                              title="Remove image"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Save */}
            <Button
              className="w-full text-black bg-[#D6DF25] hover:bg-[#c8d322]"
              onClick={() => {
                if (editingProjectId) handleUpdateProject();
                else handleSaveProject();
              }}
            >
              {editingProjectId ? "Update Project" : "Save Project"}
            </Button>
          </div>
        </DialogContent>
          </Dialog>


       
    </div>
  );
};

export default AdminDashboard;
