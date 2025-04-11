import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-zinc-200 bg-white flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-zinc-200 w-full px-5 py-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-zinc-400" />
          <span className="font-medium text-zinc-600 hidden lg:block">
            Contacts
          </span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-4 px-3 space-y-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-100 transition"
          >
            {/* Avatar skeleton */}
            <div className="relative flex-shrink-0">
              <div className="skeleton w-12 h-12 rounded-full bg-zinc-200" />
            </div>

            {/* User info skeleton - lg only */}
            <div className="hidden lg:flex flex-col gap-2 min-w-0 flex-1">
              <div className="skeleton h-4 w-3/4 bg-zinc-200 rounded" />
              <div className="skeleton h-3 w-1/2 bg-zinc-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
