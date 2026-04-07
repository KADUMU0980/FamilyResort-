"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  ArrowBigLeft
} from "lucide-react";

const UserProfile = ({ userEmail, userName, userPhone }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: userName || '',
    email: userEmail || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to change password' });
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Profile updated successfully!' });
        setIsEditing(false);
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: userName || '',
      email: userEmail || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="luxury-page py-8 px-4">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 flex items-center gap-2 font-medium text-luxury-gold-dark transition hover:text-luxury-black"
      >
        <ArrowBigLeft className="h-5 w-5" />
        Back to Home
      </button>
      <div className="luxury-container max-w-4xl">
        <div className="luxury-surface mb-6 p-8">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-luxury-black shadow-luxury">
              <User className="h-8 w-8 text-luxury-gold-light" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-semibold text-luxury-black">My Profile</h1>
              <p className="mt-1 text-luxury-charcoal/70">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="luxury-surface p-8">
          <div className="mb-8 flex flex-col items-center border-b border-luxury-stone/60 pb-8">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-luxury-black text-5xl font-bold text-luxury-gold-light shadow-luxury">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-luxury-gold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold text-luxury-black">Name: {userName}</h2>
            <p className="text-luxury-charcoal/75">Email: {userEmail}</p>
            <p className="text-luxury-charcoal/75">Phone: {userPhone}</p>
          </div>

          {message.text && (
            <div className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${
              message.type === 'success'
                ? 'border-luxury-gold/40 bg-luxury-gold/10'
                : 'border-red-200 bg-red-50'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-luxury-gold-dark" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p className={`font-medium ${
                message.type === 'success' ? 'text-luxury-black' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          )}

          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-luxury-black">
              <User className="h-5 w-5 text-luxury-gold-dark" />
              Account Information
            </h3>

            <div className="mb-4">
              <label className="luxury-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/40" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`luxury-input pl-10 ${isEditing ? '' : 'cursor-not-allowed bg-luxury-sand/60'}`}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="luxury-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/40" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="luxury-input cursor-not-allowed bg-luxury-sand/60 pl-10 text-luxury-charcoal/70"
                />
              </div>
              <p className="mt-1 text-xs text-luxury-charcoal/55">Email cannot be changed</p>
            </div>
          </div>

          {isEditing && (
            <div className="mb-8 rounded-2xl border border-luxury-stone/80 bg-luxury-sand/40 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-luxury-black">
                <Lock className="h-5 w-5 text-luxury-gold-dark" />
                Change Password
              </h3>

              <div className="mb-4">
                <label className="luxury-label">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="luxury-input pl-10 pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-charcoal/50 hover:text-luxury-black"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="luxury-label">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/40" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="luxury-input pl-10 pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-charcoal/50 hover:text-luxury-black"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="luxury-label">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/40" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="luxury-input pl-10"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <p className="text-xs text-luxury-charcoal/65">
                Leave password fields empty if you don&apos;t want to change your password
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 rounded-2xl bg-luxury-gold py-3 px-6 font-medium text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={loading}
                  className="flex-1 rounded-2xl border border-luxury-stone bg-luxury-sand/80 py-3 px-6 font-medium text-luxury-black transition hover:bg-luxury-stone/80 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-luxury-black py-3 px-6 font-medium text-white shadow-luxury transition hover:bg-luxury-charcoal disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
