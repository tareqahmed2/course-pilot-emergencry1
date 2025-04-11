const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 ${
            idx % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          {/* Avatar */}
          {idx % 2 === 0 && (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          )}

          {/* Message bubble */}
          <div className="flex flex-col space-y-2">
            {/* Username */}
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            {/* Message */}
            <div className="h-16 w-[200px] bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Avatar (for sender on right) */}
          {idx % 2 !== 0 && (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
