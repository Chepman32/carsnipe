import React, { useState, useEffect } from 'react';
import { List, Avatar, Spin, Empty, Input, Button, Popconfirm } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { fetchUserConversations, fetchUserInfoById, sendMessage, removeConversation } from '../../functions';

export const ConversationPage = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { recipientId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchUserConversations(userId);
        setConversations(fetchedConversations);
        
        if (recipientId) {
          const existingConversation = fetchedConversations.find(conv => 
            conv.participants.some(p => p.id === recipientId)
          );
          
          if (existingConversation) {
            setCurrentConversation(existingConversation);
            setMessages(existingConversation.messages || []);
          } else {
            const recipientInfo = await fetchUserInfoById(recipientId);
            setCurrentConversation({
              id: null,
              participants: [{ id: recipientId, nickname: recipientInfo.nickname, avatar: recipientInfo.avatar }],
            });
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [userId, recipientId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = await sendMessage(userId, recipientId, message);
      // Update the UI with the new message
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleRemoveConversation = async (conversationId) => {
    try {
      await removeConversation(conversationId);
      setConversations(prevConversations => 
        prevConversations.filter(conv => conv.id !== conversationId)
      );
    } catch (error) {
      console.error("Error removing conversation:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (conversations.length === 0) {
    return (
      <div>
        <h1>No conversations found</h1>
        <Input.TextArea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message..."
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    );
  }

  if (currentConversation) {
    return (
      <div>
        <h1>Conversation with {currentConversation.participants[0].nickname}</h1>
        {/* Display messages here */}
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.content}
          </div>
        ))}
        <Input.TextArea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message..."
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Conversations</h1>
      <List
        itemLayout="horizontal"
        dataSource={conversations}
        renderItem={item => (
          <List.Item 
            onClick={() => navigate(`/conversations/${item.participants[0].id}`)}
            actions={[
              <Popconfirm
                title="Are you sure you want to remove this conversation?"
                onConfirm={(e) => {
                  e.stopPropagation();
                  handleRemoveConversation(item.id);
                }}
                onCancel={(e) => e.stopPropagation()}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: '16px', color: '#ff4d4f' }}
                />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.participants[0]?.avatar} />}
              title={item.participants[0]?.nickname || "Unknown User"}
              description={
                item.messages?.items[0]
                  ? `${item.messages.items[0].content.substring(0, 30)}...` 
                  : "No messages yet"
              }
            />
            <div>{item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleString() : 'No timestamp'}</div>
          </List.Item>
        )}
      />
    </div>
  );
};
