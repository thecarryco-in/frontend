import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Eye, Trash2, Clock, User, Mail, Phone, Send, Loader } from 'lucide-react';
import axios from 'axios';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  queryType: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
}

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [adminReply, setAdminReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/contact/admin/submissions', {
        params: {
          search: searchTerm || undefined,
          status: statusFilter || undefined,
          limit: 100
        }
      });
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchContacts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter]);

  const updateContactStatus = async (contactId: string, status: string) => {
    try {
      const response = await axios.put(`/contact/admin/submissions/${contactId}`, {
        status
      });
      
      // If status is resolved, remove from list (delete)
      if (status === 'resolved') {
        setContacts(contacts.filter(c => c._id !== contactId));
        if (selectedContact?._id === contactId) {
          setSelectedContact(null);
        }
      } else {
        setContacts(contacts.map(c => 
          c._id === contactId ? response.data.contact : c
        ));
        if (selectedContact?._id === contactId) {
          setSelectedContact(response.data.contact);
        }
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact status');
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await axios.delete(`/contact/admin/submissions/${contactId}`);
      setContacts(contacts.filter(c => c._id !== contactId));
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    }
  };

  const sendReply = async () => {
    if (!selectedContact || !adminReply.trim()) return;

    setSendingReply(true);
    try {
      await axios.post('/contact/admin/reply', {
        contactId: selectedContact._id,
        reply: adminReply,
        userEmail: selectedContact.email,
        userName: selectedContact.name,
        originalSubject: selectedContact.subject
      });
      
      alert('Reply sent successfully!');
      setAdminReply('');
      
      // Update status to in-progress
      await updateContactStatus(selectedContact._id, 'in-progress');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-500/20 text-yellow-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Contact Messages
        </h1>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Messages</p>
          <p className="text-white font-bold text-2xl">{contacts.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-3 pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="new" className="bg-gray-800">New</option>
          <option value="in-progress" className="bg-gray-800">In Progress</option>
          <option value="closed" className="bg-gray-800">Closed</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div 
            key={contact._id} 
            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedContact(contact)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-white font-semibold text-lg">{contact.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(contact.status)}`}>
                    {contact.status.replace('-', ' ')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-purple-500/20 text-purple-400">
                    {contact.queryType.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-gray-400 text-sm mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{contact.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 line-clamp-2">{contact.message}</p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedContact(contact);
                  }}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteContact(contact._id);
                  }}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Messages Found</h3>
          <p className="text-gray-400">No contact messages match your current filters.</p>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Message Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateContactStatus(selectedContact._id, e.target.value)}
                    className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="new" className="bg-gray-800">New</option>
                    <option value="in-progress" className="bg-gray-800">In Progress</option>
                    <option value="resolved" className="bg-gray-800">Resolved (Will Delete)</option>
                    <option value="closed" className="bg-gray-800">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Query Type</label>
                  <span className="inline-block px-4 py-3 rounded-xl text-sm font-bold capitalize bg-purple-500/20 text-purple-400">
                    {selectedContact.queryType.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{selectedContact.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{selectedContact.email}</span>
                  </div>
                  {selectedContact.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{selectedContact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{new Date(selectedContact.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Message</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">{selectedContact.subject}</h4>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin Reply</label>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  rows={4}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 resize-none"
                  placeholder="Type your reply to the customer..."
                />
                <button
                  onClick={sendReply}
                  disabled={!adminReply.trim() || sendingReply}
                  className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {sendingReply ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;