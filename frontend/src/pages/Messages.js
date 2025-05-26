import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { FaEnvelopeOpenText, FaSpinner, FaSearch, FaInbox, FaPaperPlane, FaArchive } from "react-icons/fa";
import { Avatar } from "@mui/material";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch messages");
        }

        setMessages(result.data);
        setFilteredMessages(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredByTab = filteredMessages.filter(msg => {
    if (activeTab === 'inbox') return !msg.archived && !msg.sent;
    if (activeTab === 'sent') return msg.sent;
    if (activeTab === 'archived') return msg.archived;
    return true;
  });

  const filteredBySearch = filteredByTab.filter(msg => 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMessages = filteredBySearch.slice(
    (currentPage - 1) * messagesPerPage, 
    currentPage * messagesPerPage
  );

  const totalPages = Math.ceil(filteredBySearch.length / messagesPerPage);

  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none"
      }}>
        <div className="card fade-in" style={{
          maxWidth: 480,
          width: "100%",
          padding: "2.5rem 2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
          borderRadius: 18,
          background: "#23272f",
          color: "#e0eafc",
          textAlign: "center"
        }}>
          <div style={{ marginBottom: 24 }}>
            <FaEnvelopeOpenText size={36} color="#4ea8de" style={{ marginBottom: 8 }} />
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e0eafc", margin: 0 }}>Messages</h1>
            
            <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
              <button 
                onClick={() => setActiveTab('inbox')} 
                style={{ 
                  background: activeTab === 'inbox' ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === 'inbox' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <FaInbox /> Inbox
              </button>
              <button 
                onClick={() => setActiveTab('sent')} 
                style={{ 
                  background: activeTab === 'sent' ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === 'sent' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <FaPaperPlane /> Sent
              </button>
              <button 
                onClick={() => setActiveTab('archived')} 
                style={{ 
                  background: activeTab === 'archived' ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === 'archived' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <FaArchive /> Archived
              </button>
            </div>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <FaSearch style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  padding: '0.5rem 1rem 0.5rem 2rem', 
                  width: '100%', 
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--background-secondary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {loading ? (
              <div style={{ textAlign: "center" }}>
                <FaSpinner style={{
                  fontSize: "2rem",
                  color: "var(--primary-color)",
                  animation: "spin 1s linear infinite"
                }} />
              </div>
            ) : error ? (
              <div style={{ color: "var(--error-color)", textAlign: "center" }}>
                Error: {error}
              </div>
            ) : messages.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", textAlign: "center" }}>
                No messages found.
              </div>
            ) : (
              <>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "2rem 0 0 0",
                  display: "grid",
                  gap: 16,
                  textAlign: "left"
                }}>
                  {paginatedMessages.map(message => (
                    <li key={message._id} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'auto 1fr',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--background-secondary)',
                      borderRadius: '8px'
                    }}>
                      <Avatar src={message.sender?.avatar} />
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold' }}>{message.sender?.name || 'System'}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>{message.content}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {filteredBySearch.length > messagesPerPage && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px', 
                        border: 'none', 
                        background: currentPage === 1 ? '#ccc' : 'var(--primary-color)', 
                        color: 'white',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Previous
                    </button>
                    <span style={{ padding: '0.5rem 1rem' }}>Page {currentPage}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px', 
                        border: 'none', 
                        background: currentPage === totalPages ? '#ccc' : 'var(--primary-color)', 
                        color: 'white',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}