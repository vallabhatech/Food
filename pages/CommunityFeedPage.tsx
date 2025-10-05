
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ReportModal from '../components/ui/ReportModal';
import { CommunityPost } from '../types';

const CommunityFeedPage: React.FC = () => {
  const { communityPosts, users, addCommunityPost, addLikeToPost } = useData();
  const { currentUser } = useAuth();

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [animatedPostId, setAnimatedPostId] = useState<string | null>(null);
  const [activePostMenu, setActivePostMenu] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<CommunityPost | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActivePostMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && newPostTitle && newPostContent) {
      addCommunityPost({
        authorId: currentUser.id,
        title: newPostTitle,
        content: newPostContent,
      });
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  const handleLikeClick = (postId: string) => {
    addLikeToPost(postId);
    setAnimatedPostId(postId);
    setTimeout(() => {
      setAnimatedPostId(null);
    }, 500); // Animation duration
  };

  const handleReportClick = (post: CommunityPost) => {
    setReportingPost(post);
    setIsReportModalOpen(true);
    setActivePostMenu(null); // Close menu
  };

  const handleReportSubmit = (reportDetails: { reason: string; comments: string }) => {
    console.log('Report submitted for post:', reportingPost?.id, reportDetails);
    // In a real app, this would send data to a backend.
  };
  
  const sortedPosts = [...communityPosts].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <style>{`
        @keyframes like-burst {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .like-animate {
          animation: like-burst 0.5s ease-in-out;
          color: #ef4444; /* red-500 */
        }
      `}</style>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800">Community Feed</h1>
        <p className="text-lg text-gray-600 mt-2">See the stories and impact of sharing in our community.</p>
      </div>

      {currentUser && (
        <Card className="mb-8 p-6">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Share Your Story</h2>
            <div>
              <label htmlFor="post-title" className="sr-only">Title</label>
              <input 
                id="post-title" 
                type="text" 
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                placeholder="Post Title" 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none" 
                required 
              />
            </div>
            <div>
              <label htmlFor="post-content" className="sr-only">Content</label>
              <textarea
                id="post-content"
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                rows={3}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              ></textarea>
            </div>
            <div className="text-right">
              <Button type="submit">Post</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-6">
        {sortedPosts.map(post => {
          const author = users.find(u => u.id === post.authorId);
          if (!author) return null;

          return (
            <Card key={post.id}>
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />}
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <Link to={`/profile/${author.id}`}>
                            <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full mr-4"/>
                        </Link>
                        <div>
                            <Link to={`/profile/${author.id}`} className="font-bold text-gray-800 hover:underline">{author.name}</Link>
                            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="ml-auto relative">
                          <button onClick={() => setActivePostMenu(post.id === activePostMenu ? null : post.id)} className="text-gray-400 hover:text-gray-600 p-2 h-8 w-8 rounded-full flex items-center justify-center" aria-label="Post options">
                              <i className="fas fa-ellipsis-h"></i>
                          </button>
                          {activePostMenu === post.id && (
                              <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                                  <div className="py-1" role="menu" aria-orientation="vertical">
                                      <button
                                          onClick={() => handleReportClick(post)}
                                          className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                          role="menuitem"
                                      >
                                          <i className="fas fa-flag fa-fw mr-3 text-gray-500"></i>
                                          Report Post
                                      </button>
                                  </div>
                              </div>
                          )}
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    <div className="mt-4 pt-4 border-t flex items-center">
                        <button onClick={() => handleLikeClick(post.id)} className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                            <i className={`fas fa-heart mr-2 ${animatedPostId === post.id ? 'like-animate' : ''}`}></i>
                            <span>{post.likes}</span>
                        </button>
                    </div>
                </div>
            </Card>
          );
        })}
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        itemType="Post"
      />
    </div>
  );
};

export default CommunityFeedPage;