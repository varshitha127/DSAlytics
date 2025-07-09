import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faReply, faFlag, faEllipsisV, faUser, faClock, faCode } from '@fortawesome/free-solid-svg-icons';

const DiscussionSection = ({ problemId }) => {
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'oldest'
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // This would typically come from a backend
  const discussions = [
    {
      id: 1,
      author: {
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe',
        reputation: 1250
      },
      content: 'I solved this problem using a two-pointer approach. Here\'s my solution:',
      code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      timestamp: '2 hours ago',
      likes: 15,
      dislikes: 2,
      replies: [
        {
          id: 101,
          author: {
            name: 'Jane Smith',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
            reputation: 980
          },
          content: 'Great solution! I used a similar approach but with a different data structure.',
          timestamp: '1 hour ago',
          likes: 5,
          dislikes: 0
        }
      ]
    },
    {
      id: 2,
      author: {
        name: 'Alex Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson',
        reputation: 850
      },
      content: 'I\'m having trouble understanding the time complexity of this problem. Can someone explain?',
      timestamp: '5 hours ago',
      likes: 8,
      dislikes: 1,
      replies: []
    }
  ];

  const handleReply = (e) => {
    e.preventDefault();
    // This would typically send the reply to a backend
    console.log('Reply submitted:', replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };

  const handleLike = (discussionId) => {
    // This would typically send the like to a backend
    console.log('Liked discussion:', discussionId);
  };

  const handleDislike = (discussionId) => {
    // This would typically send the dislike to a backend
    console.log('Disliked discussion:', discussionId);
  };

  const handleReport = (discussionId) => {
    // This would typically send the report to a backend
    console.log('Reported discussion:', discussionId);
  };

  return (
    <div className="space-y-6">
      {/* Discussion Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Discussions</h2>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="oldest">Oldest First</option>
          </select>
          <button
            onClick={() => setShowReplyForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Discussion
          </button>
        </div>
      </div>

      {/* New Discussion Form */}
      {showReplyForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <form onSubmit={handleReply}>
            <div className="mb-4">
              <label htmlFor="reply" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Discussion
              </label>
              <textarea
                id="reply"
                rows="4"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Share your thoughts, solution, or ask a question..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post Discussion
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discussions List */}
      <div className="space-y-6">
        {discussions.map(discussion => (
          <div key={discussion.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {/* Discussion Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={discussion.author.avatar}
                  alt={discussion.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {discussion.author.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      • {discussion.author.reputation} reputation
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {discussion.timestamp}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleReport(discussion.id)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </div>

            {/* Discussion Content */}
            <div className="prose dark:prose-invert max-w-none mb-4">
              <p className="text-gray-700 dark:text-gray-300">{discussion.content}</p>
              {discussion.code && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FontAwesomeIcon icon={faCode} className="mr-2" />
                      Solution
                    </div>
                    <button className="text-sm text-blue-500 hover:text-blue-600">
                      Copy
                    </button>
                  </div>
                  <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                    <code>{discussion.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Discussion Actions */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={() => handleLike(discussion.id)}
                className="flex items-center space-x-1 hover:text-blue-500"
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>{discussion.likes}</span>
              </button>
              <button
                onClick={() => handleDislike(discussion.id)}
                className="flex items-center space-x-1 hover:text-red-500"
              >
                <FontAwesomeIcon icon={faThumbsDown} />
                <span>{discussion.dislikes}</span>
              </button>
              <button
                onClick={() => setShowReplyForm(true)}
                className="flex items-center space-x-1 hover:text-green-500"
              >
                <FontAwesomeIcon icon={faReply} />
                <span>Reply</span>
              </button>
            </div>

            {/* Replies */}
            {discussion.replies.length > 0 && (
              <div className="mt-6 space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                {discussion.replies.map(reply => (
                  <div key={reply.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={reply.author.avatar}
                        alt={reply.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reply.author.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            • {reply.author.reputation} reputation
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          {reply.timestamp}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleLike(reply.id)}
                        className="flex items-center space-x-1 hover:text-blue-500"
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{reply.likes}</span>
                      </button>
                      <button
                        onClick={() => handleDislike(reply.id)}
                        className="flex items-center space-x-1 hover:text-red-500"
                      >
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span>{reply.dislikes}</span>
                      </button>
                      <button
                        onClick={() => handleReport(reply.id)}
                        className="flex items-center space-x-1 hover:text-gray-600"
                      >
                        <FontAwesomeIcon icon={faFlag} />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionSection; 