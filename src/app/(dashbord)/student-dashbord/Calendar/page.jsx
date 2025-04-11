"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiX,
  FiClock,
  FiCalendar,
} from "react-icons/fi";

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    type: "event",
    description: "",
  });
  const [activeView, setActiveView] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendars, setSelectedCalendars] = useState({
    myCalendar: true,
    holidays: true,
  });

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleSave = () => {
    const newEvent = {
      ...formData,
      date: value,
      id: Date.now(),
    };
    setEvents([...events, newEvent]);
    setFormData({
      title: "",
      time: "",
      type: "event",
      description: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const filteredEvents = events.filter(
    (e) => new Date(e.date).toDateString() === value.toDateString()
  );

  const filteredBySearch = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const eventTypes = {
    event: {
      color: "bg-emerald-100",
      border: "border-emerald-500",
      text: "text-emerald-800",
    },
    task: {
      color: "bg-emerald-100",
      border: "border-emerald-500",
      text: "text-green-800",
    },
    appointment: {
      color: "bg-emerald-100",
      border: "border-emerald-500",
      text: "text-emerald-800",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="mb-8">
          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg shadow transition-colors"
          >
            <FiPlus /> Create
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search for people"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            My calendars
          </h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="myCalendar"
              checked={selectedCalendars.myCalendar}
              onChange={() =>
                setSelectedCalendars({
                  ...selectedCalendars,
                  myCalendar: !selectedCalendars.myCalendar,
                })
              }
              className="mr-2 h-4 w-4 text-emerald-600 rounded"
            />
            <label htmlFor="myCalendar" className="text-gray-700">
              My Calendar
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="holidays"
              checked={selectedCalendars.holidays}
              onChange={() =>
                setSelectedCalendars({
                  ...selectedCalendars,
                  holidays: !selectedCalendars.holidays,
                })
              }
              className="mr-2 h-4 w-4 text-red-600 rounded"
            />
            <label htmlFor="holidays" className="text-gray-700">
              Holidays in Bangladesh
            </label>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Other calendars
          </h3>
          <p className="text-gray-500 text-sm">No other calendars</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
            <p className="text-gray-500">
              {value.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveView("day")}
                className={`px-4 py-2 text-sm ${
                  activeView === "day"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setActiveView("week")}
                className={`px-4 py-2 text-sm ${
                  activeView === "week"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setActiveView("month")}
                className={`px-4 py-2 text-sm ${
                  activeView === "month"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700"
                }`}
              >
                Month
              </button>
            </div>

            <button
              onClick={handleCreate}
              className="md:hidden flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
            >
              <FiPlus /> Create
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <Calendar
            onChange={setValue}
            value={value}
            view={activeView}
            onViewChange={({ view }) => setActiveView(view)}
            className="border-none"
          />
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeView === "day" ? "Today's Schedule" : "Upcoming Events"}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"}
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    eventTypes[event.type].color
                  } ${eventTypes[event.type].border}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className={`font-medium ${eventTypes[event.type].text}`}
                      >
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                        <FiCalendar className="inline" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        {event.time && (
                          <>
                            <FiClock className="inline" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-gray-600 mt-2 text-sm">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No events scheduled for this day</p>
              <button
                onClick={handleCreate}
                className="mt-2 text-emerald-600 hover:text-emerald-800 font-medium"
              >
                + Add an event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create New
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, type: "event" })}
                    className={`py-2 px-3 rounded-lg border ${
                      formData.type === "event"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-300"
                    }`}
                  >
                    Event
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: "task" })}
                    className={`py-2 px-3 rounded-lg border ${
                      formData.type === "task"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-300"
                    }`}
                  >
                    Task
                  </button>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, type: "appointment" })
                    }
                    className={`py-2 px-3 rounded-lg border ${
                      formData.type === "appointment"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-300"
                    }`}
                  >
                    Appointment
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Add title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={value.toISOString().split("T")[0]}
                    onChange={(e) => setValue(new Date(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Add description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
