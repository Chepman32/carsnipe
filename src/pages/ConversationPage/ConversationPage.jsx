import React, { useState, useEffect } from 'react';
import { List, Avatar, Spin, Empty } from 'antd';
import { fetchUserConversations } from '../../functions';

export const ConversationPage = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchUserConversations(userId);
        setConversations(fetchedConversations);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setError("Failed to load conversations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [userId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (conversations.length === 0) {
    return <Empty description="No conversations found" />;
  }

  return (
    <div>
      <h1>Conversations</h1>
      <List
        itemLayout="horizontal"
        dataSource={conversations}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.participants[0]?.avatar} />}
              title={item.participants[0]?.nickname || "Unknown User"}
              description={
                item.lastMessage 
                  ? `${item.lastMessage.content.substring(0, 30)}...` 
                  : "No messages yet"
              }
            />
            <div>{item.lastMessageTimestamp ? new Date(item.lastMessageTimestamp).toLocaleString() : 'No timestamp'}</div>
          </List.Item>
        )}
      />
    </div>
  );
};
