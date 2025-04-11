"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { useAuth } from "@/context/AuthContext";
import { FaTrashAlt, FaEdit, FaSearch, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [search, setSearch] = useState("");

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const closeEditModal = () => setIsEditOpen(false);
  const openEditModal = (note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setNote(note.note);
    setDate(note.date);
    setIsEditOpen(true);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        if (user?.email) {
          const res = await axiosPublic.get(`/note-users/${user?.email}`);
          setNotes(res.data);
        }
      } catch (err) {
        console.error("Error fetching notes", err);
        toast.error("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user?.email, axiosPublic]);

  const handleSearch = async () => {
    if (search) {
      try {
        setIsLoading(true);
        const res = await axiosPublic.get(`/search-notes?title=${search}`);
        setNotes(res.data);
        if (res.data.length === 0) {
          toast.info("No notes found matching your search");
        }
      } catch (err) {
        console.error("Error searching notes", err);
        toast.error("Failed to search notes");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axiosPublic.get(`/note-users/${user?.email}`);
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes", err);
        toast.error("Failed to fetch notes");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axiosPublic.post("/note", {
        title,
        note,
        date,
        name: user?.name,
        email: user?.email,
      });

      setNotes((prevNotes) => [
        {
          _id: res.data._id || Date.now().toString(),
          title,
          note,
          date,
          name: user?.name,
          email: user?.email,
          createdAt: new Date().toISOString(),
        },
        ...prevNotes,
      ]);

      setTitle("");
      setNote("");
      setDate("");
      closeModal();
      toast.success("Note created successfully!");
    } catch (err) {
      console.error("Error saving note", err);
      setNotes((prevNotes) =>
        prevNotes.filter((n) => n._id !== Date.now().toString())
      );
      toast.error("Failed to create note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axiosPublic.put(`/note-update/${currentNote._id}`, {
        title,
        note,
        date,
        name: user?.name,
        email: user?.email,
      });

      if (res.status === 404) {
        throw new Error("Note not found");
      }

      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n._id === currentNote._id
            ? {
                ...n,
                title,
                note,
                date,
              }
            : n
        )
      );

      setTitle("");
      setNote("");
      setDate("");
      closeEditModal();
      toast.success("Note updated successfully!");
    } catch (err) {
      console.error("Error updating note", err);
      toast.error(err.message || "Failed to update note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const originalNotes = [...notes];
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      await axiosPublic.delete(`/note-delete/${id}`);
      toast.success("Note deleted successfully!");
    } catch (err) {
      console.error("Error deleting note", err);
      setNotes(originalNotes);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              onClick={openModal}
              disabled={isLoading}
            >
              <FaPlus /> {isLoading ? "Loading..." : "New Note"}
            </button>
          </div>
        </div>

        {isLoading && notes.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <FaEdit className="text-gray-500 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first note to get started
            </p>
            <button
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-emerald-700 transition"
              onClick={openModal}
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800 truncate max-w-[70%]">
                    {note.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(note)}
                      className="text-emerald-600 hover:text-emerald-800 transition"
                      disabled={isLoading}
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      disabled={isLoading}
                      title="Delete"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex-grow mb-4">
                  <p className="text-gray-600 whitespace-pre-wrap break-words">
                    {note.note}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                  <span className="truncate max-w-[50%]">{note.name}</span>
                  <span>{new Date(note.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Note Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Create New Note
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Note title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          placeholder="Write your note here..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[150px]"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          onClick={closeModal}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Note"}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Edit Note Modal */}
        <Transition appear show={isEditOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Edit Note
                    </Dialog.Title>
                    <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Note title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          placeholder="Write your note here..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[150px]"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          onClick={closeEditModal}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? "Updating..." : "Update Note"}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default Page;
