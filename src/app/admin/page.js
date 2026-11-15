'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './admin.css';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' or 'gallery'
  const [stories, setStories] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Form states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  
  const [formName, setFormName] = useState('');
  const [formVisa, setFormVisa] = useState('');
  const [formQuote, setFormQuote] = useState('');
  
  const [selectedMediaFile, setSelectedMediaFile] = useState(null);
  const [selectedPosterFile, setSelectedPosterFile] = useState(null);
  const [mediaFileName, setMediaFileName] = useState('');
  const [posterFileName, setPosterFileName] = useState('');

  // Refs for file inputs
  const mediaInputRef = useRef(null);
  const posterInputRef = useRef(null);

  // Delete states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Check auth session
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (session) {
          setUser(session.user);
          fetchStories();
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        setStories([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch stories
  const fetchStories = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setStories(data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch success stories', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when tab switches (optional but keeps data fresh)
  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [activeTab, user]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) throw loginError;
      setUser(data.user);
      showToast('Logged in successfully!');
      fetchStories();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
      setUser(null);
      showToast('Logged out successfully.');
    } catch (err) {
      showToast(err.message || 'Logout failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // File Upload Helper
  const uploadFile = async (file, pathPrefix) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}_${Math.random().toString(36).substring(2, 11)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('success-stories')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('success-stories')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Delete File Helper
  const deleteStorageFile = async (url) => {
    if (!url) return;
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      if (filename) {
        await supabase.storage
          .from('success-stories')
          .remove([filename]);
      }
    } catch (err) {
      console.warn('Failed to delete storage file:', url, err);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalType('add');
    setEditingItem(null);
    setFormName('');
    setFormVisa('');
    setFormQuote('');
    setSelectedMediaFile(null);
    setSelectedPosterFile(null);
    setMediaFileName('');
    setPosterFileName('');
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditingItem(item);
    setFormName(item.name);
    setFormVisa(item.visa || '');
    setFormQuote(item.quote || '');
    setSelectedMediaFile(null);
    setSelectedPosterFile(null);
    setMediaFileName('Keep current file');
    setPosterFileName(item.poster_url ? 'Keep current thumbnail' : 'No thumbnail');
    setShowModal(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let mediaUrl = editingItem?.media_url || '';
      let posterUrl = editingItem?.poster_url || null;

      // Validate uploads for add
      if (modalType === 'add' && !selectedMediaFile) {
        throw new Error(`Please select a ${activeTab === 'videos' ? 'video' : 'photo'} file.`);
      }
      if (modalType === 'add' && activeTab === 'videos' && !selectedPosterFile) {
        throw new Error('Please select a poster thumbnail image for the video.');
      }

      // Upload files if selected
      if (selectedMediaFile) {
        // If editing, clean up the old file first
        if (modalType === 'edit' && editingItem.media_url) {
          await deleteStorageFile(editingItem.media_url);
        }
        mediaUrl = await uploadFile(selectedMediaFile, activeTab);
      }

      if (selectedPosterFile) {
        // If editing, clean up the old poster first
        if (modalType === 'edit' && editingItem.poster_url) {
          await deleteStorageFile(editingItem.poster_url);
        }
        posterUrl = await uploadFile(selectedPosterFile, 'poster');
      }

      const payload = {
        type: activeTab === 'videos' ? 'video' : 'gallery',
        name: formName,
        visa: activeTab === 'videos' ? formVisa : null,
        quote: activeTab === 'gallery' ? formQuote : null,
        media_url: mediaUrl,
        poster_url: posterUrl
      };

      if (modalType === 'add') {
        const { error: insertError } = await supabase
          .from('success_stories')
          .insert(payload);
        if (insertError) throw insertError;
        showToast('Success story added successfully!');
      } else {
        const { error: updateError } = await supabase
          .from('success_stories')
          .update(payload)
          .eq('id', editingItem.id);
        if (updateError) throw updateError;
        showToast('Success story updated successfully!');
      }

      setShowModal(false);
      fetchStories();
    } catch (err) {
      showToast(err.message || 'An error occurred while saving.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      // 1. Delete database record
      const { error: deleteError } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', deletingItem.id);

      if (deleteError) throw deleteError;

      // 2. Clean up files in storage
      if (deletingItem.media_url) {
        await deleteStorageFile(deletingItem.media_url);
      }
      if (deletingItem.poster_url) {
        await deleteStorageFile(deletingItem.poster_url);
      }

      showToast('Story removed successfully.');
      setShowDeleteModal(false);
      setDeletingItem(null);
      fetchStories();
    } catch (err) {
      showToast(err.message || 'Failed to delete story.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // File change handlers
  const handleMediaFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMediaFile(file);
      setMediaFileName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
  };

  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPosterFile(file);
      setPosterFileName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
  };

  // Filter list by active tab
  const filteredStories = stories.filter(story => {
    if (activeTab === 'videos') return story.type === 'video';
    return story.type === 'gallery';
  });

  if (authLoading) {
    return (
      <div className="admin-wrapper" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: '#fab00d', fontSize: '2rem' }}>
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN IF NOT LOGGED IN ---
  if (!user) {
    return (
      <div className="admin-wrapper">
        <section className="login-screen">
          <div className="login-card">
            <div className="login-logo">
              <img src="/logowhite.png" alt="Punjab Immigration Logo" />
            </div>
            <h2>Admin Portal</h2>
            <p>Access Success Stories Manager</p>
            
            {error && (
              <div className="error-alert">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="admin-form-group">
                <label htmlFor="adminEmail">Email Address</label>
                <div className="input-icon-wrapper">
                  <i className="fa-solid fa-envelope"></i>
                  <input 
                    type="email" 
                    id="adminEmail" 
                    className="admin-input" 
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    autoFocus
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="adminPassword">Password</label>
                <div className="input-icon-wrapper">
                  <i className="fa-solid fa-lock"></i>
                  <input 
                    type="password" 
                    id="adminPassword" 
                    className="admin-input" 
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="admin-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Logging in...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket"></i> Login
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  // --- RENDER DASHBOARD IF LOGGED IN ---
  return (
    <div className="admin-wrapper">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-inner">
          <div className="header-brand">
            <img src="/logowhite.png" alt="Punjab Immigration" />
            <h1>Dashboard</h1>
          </div>
          <div className="header-user">
            <span className="user-email">
              <i className="fa-solid fa-user-shield"></i> {user.email}
            </span>
            <button className="logout-btn" onClick={handleLogout} disabled={loading}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="admin-main">
        {/* TABS */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-trigger ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <i className="fa-solid fa-video"></i> Video Testimonials
          </button>
          <button 
            className={`tab-trigger ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <i className="fa-solid fa-images"></i> Approvals Gallery
          </button>
        </div>

        {/* SECTION HEADER */}
        <div className="section-header">
          <h2>
            {activeTab === 'videos' ? 'Video Testimonials' : 'Visa Approvals Gallery'} 
            <span style={{ fontSize: '1rem', opacity: 0.6, marginLeft: '10px' }}>
              ({filteredStories.length} items)
            </span>
          </h2>
          <button className="add-story-btn" onClick={handleOpenAdd}>
            <i className="fa-solid fa-plus"></i> Add {activeTab === 'videos' ? 'Video' : 'Card'}
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading && !showModal && !showDeleteModal && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: '#fab00d' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2xl"></i>
          </div>
        )}

        {/* GRID OF STORIES */}
        {(!loading || showModal || showDeleteModal) && (
          <div className="admin-grid">
            {filteredStories.length === 0 ? (
              <div className="empty-state">
                <i className={`fa-solid ${activeTab === 'videos' ? 'fa-video-slash' : 'fa-image'}`}></i>
                <h3>No items found</h3>
                <p>Click "Add {activeTab === 'videos' ? 'Video' : 'Card'}" above to upload your first success story.</p>
              </div>
            ) : (
              filteredStories.map((story) => (
                <div className={`admin-card ${story.type === 'video' ? 'video-type' : 'gallery-type'}`} key={story.id}>
                  <div className="card-media">
                    {story.type === 'video' ? (
                      <video key={story.media_url} src={story.media_url} poster={story.poster_url} controls preload="none" />
                    ) : (
                      <img src={story.media_url} alt={story.name} />
                    )}
                    {story.visa && <span className="badge-visa">{story.visa}</span>}
                  </div>
                  <div className="card-content">
                    <h3>{story.name}</h3>
                    {story.type === 'video' ? (
                      <div className="card-visa-text">{story.visa}</div>
                    ) : (
                      <p className="card-quote-text">"{story.quote}"</p>
                    )}
                    <div className="card-footer">
                      <button className="card-btn btn-edit btn-card-edit" onClick={() => handleOpenEdit(story)}>
                        <i className="fa-solid fa-pen"></i> Edit
                      </button>
                      <button className="card-btn btn-delete btn-card-delete" onClick={() => handleOpenDelete(story)}>
                        <i className="fa-solid fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* --- ADD / EDIT STORY MODAL --- */}
      {showModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-content">
            <div className="modal-title-row">
              <h3>
                {modalType === 'add' ? 'Add' : 'Edit'}{' '}
                {activeTab === 'videos' ? 'Video Testimonial' : 'Gallery Approval'}
              </h3>
              <button className="btn-modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="admin-form-group">
                <label htmlFor="clientName">Client Name</label>
                <input 
                  type="text" 
                  id="clientName" 
                  className="admin-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Harpal Singh"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required 
                />
              </div>

              {activeTab === 'videos' ? (
                <>
                  <div className="admin-form-group">
                    <label htmlFor="visaType">Visa Category</label>
                    <input 
                      type="text" 
                      id="visaType" 
                      className="admin-input" 
                      style={{ paddingLeft: '16px' }}
                      placeholder="e.g. UK Study Visa"
                      value={formVisa}
                      onChange={(e) => setFormVisa(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Video File (.mp4, .webm)</label>
                    <div className="file-upload-zone" onClick={() => mediaInputRef.current?.click()}>
                      <i className="fa-solid fa-video"></i>
                      <p>Click to select video file</p>
                      <span>Supports MP4 / WebM (max 100MB)</span>
                      <input 
                        type="file" 
                        ref={mediaInputRef}
                        accept="video/mp4,video/webm"
                        onChange={handleMediaFileChange}
                        style={{ display: 'none' }}
                        required={modalType === 'add'}
                      />
                      {mediaFileName && (
                        <div className="selected-filename">
                          <i className="fa-solid fa-circle-check"></i> {mediaFileName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Poster Thumbnail Image</label>
                    <div className="file-upload-zone" onClick={() => posterInputRef.current?.click()}>
                      <i className="fa-solid fa-image"></i>
                      <p>Click to select thumbnail image</p>
                      <span>Supports PNG / JPG / WebP</span>
                      <input 
                        type="file" 
                        ref={posterInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handlePosterFileChange}
                        style={{ display: 'none' }}
                        required={modalType === 'add'}
                      />
                      {posterFileName && (
                        <div className="selected-filename">
                          <i className="fa-solid fa-circle-check"></i> {posterFileName}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-form-group">
                    <label>Visa Approval Photo</label>
                    <div className="file-upload-zone" onClick={() => mediaInputRef.current?.click()}>
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <p>Click to select approval photo</p>
                      <span>Supports PNG / JPG / WebP</span>
                      <input 
                        type="file" 
                        ref={mediaInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleMediaFileChange}
                        style={{ display: 'none' }}
                        required={modalType === 'add'}
                      />
                      {mediaFileName && (
                        <div className="selected-filename">
                          <i className="fa-solid fa-circle-check"></i> {mediaFileName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="quoteText">Quote / Testimonial Text</label>
                    <textarea 
                      id="quoteText" 
                      rows="4" 
                      className="admin-input" 
                      style={{ paddingLeft: '16px', resize: 'vertical' }}
                      placeholder="e.g. I got my Canada Study Visa in 5 days! Highly recommended..."
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      required 
                    ></textarea>
                  </div>
                </>
              )}

              <div className="modal-actions-row">
                <button type="button" className="modal-btn btn-modal-cancel" onClick={() => setShowModal(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn btn-modal-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && deletingItem && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-title-row" style={{ justifyContent: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Delete Entry
              </h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '25px' }}>
              Are you sure you want to remove the success story for <b>"{deletingItem.name}"</b>?<br />
              <span style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '5px', display: 'block' }}>
                This will delete the database record and clean up associated files in storage.
              </span>
            </p>
            <div className="modal-actions-row">
              <button className="modal-btn btn-modal-cancel" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                No, Cancel
              </button>
              <button 
                className="modal-btn" 
                style={{ background: '#ff4d4d', color: '#ffffff' }} 
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast.show && (
        <div className={`admin-toast ${toast.type}`}>
          <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
