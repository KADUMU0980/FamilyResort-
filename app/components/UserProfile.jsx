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
  Camera
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

    // Validate passwords if changing password
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Name: {userName}</h2>
            <p className="text-gray-600">Email: {userEmail}</p>
            <p className="text-gray-600">Phone: {userPhone}</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
              }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                {message.text}
              </p>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Account Information
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'bg-white' : 'bg-gray-100'
                    }`}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          {isEditing && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Change Password
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Leave password fields empty if you don't want to change your password
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={cancelEdit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
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