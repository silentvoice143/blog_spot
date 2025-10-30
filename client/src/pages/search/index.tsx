import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GlobalSearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState({
    stories: [],
    users: [],
  });

  const [loading, setLoading] = useState(false);

  // Simulated data - replace with actual API calls
  const mockStories = [
    {
      id: 1,
      title: "The Art of Morning Coffee",
      author: "Emma Thompson",
      excerpt: "There's something magical about that first sip...",
      category: "Lifestyle",
      publishedAt: "2025-10-28",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    },
    {
      id: 2,
      title: "Journey Through the Mountains",
      author: "Alex Rivera",
      excerpt: "The peaks touched the clouds as we climbed higher...",
      category: "Travel",
      publishedAt: "2025-10-25",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    },
    {
      id: 3,
      title: "Coding Best Practices in 2025",
      author: "Sarah Chen",
      excerpt: "Modern development requires a balance of...",
      category: "Technology",
      publishedAt: "2025-10-20",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
    },
  ];

  const mockUsers = [
    {
      id: 1,
      name: "Emma Thompson",
      username: "@emmathompson",
      bio: "Writer & Coffee Enthusiast",
      followers: 1243,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
    {
      id: 2,
      name: "Alex Rivera",
      username: "@alexrivera",
      bio: "Adventure Blogger | Mountain Lover",
      followers: 892,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
      id: 3,
      name: "Sarah Chen",
      username: "@sarahchen",
      bio: "Tech Lead | Code & Coffee",
      followers: 2156,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  ];

  useEffect(() => {
    if (query.length > 0) {
      handleSearch();
    } else {
      setResults({ stories: [], users: [] });
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filteredStories = mockStories.filter(
        (story) =>
          story.title.toLowerCase().includes(query.toLowerCase()) ||
          story.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          story.author.toLowerCase().includes(query.toLowerCase())
      );

      const filteredUsers = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.bio.toLowerCase().includes(query.toLowerCase())
      );

      setResults({
        stories: filteredStories,
        users: filteredUsers,
      });
      setLoading(false);
    }, 500);
  };

  const totalResults = results.stories.length + results.users.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Tabs */}
          {query && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab("stories")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "stories"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Stories ({results.stories.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Users ({results.users.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!query ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Discover Amazing Content
            </h2>
            <p className="text-gray-600">
              Search for stories, authors, and topics that inspire you
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stories Section */}
            {(activeTab === "all" || activeTab === "stories") &&
              results.stories.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Stories
                  </h2>
                  <div className="grid gap-4">
                    {results.stories.map((story) => (
                      <div
                        key={story.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                      >
                        <div className="flex gap-4">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-32 h-32 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {story.title}
                              </h3>
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex-shrink-0 ml-4">
                                {story.category}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {story.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                {story.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(
                                  story.publishedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Users Section */}
            {(activeTab === "all" || activeTab === "users") &&
              results.users.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Users
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-16 h-16 rounded-full border-2 border-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {user.username}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {user.bio}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {user.followers.toLocaleString()} followers
                          </span>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                            Follow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
