import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  PlusIcon,
  CameraIcon,
  MicrophoneIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

const FarmLog = ({ cropName, isVisible = true }) => {
  const [logs, setLogs] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddObservation, setShowAddObservation] = useState(false);
  const [observationData, setObservationData] = useState({
    title: '',
    notes: '',
    images: [],
    voiceNote: null
  });

  // Fetch farm logs
  const fetchLogs = async () => {
    if (!isVisible) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/farm-logs?cropName=${cropName}&limit=10`);
      setLogs(response.data.data.logs);
    } catch (error) {
      console.error('Error fetching farm logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's summary
  const fetchTodaySummary = async () => {
    if (!isVisible) return;
    
    try {
      const response = await axios.get(`${API_URL}/farm-logs/today-summary`);
      setTodaySummary(response.data.data.summary);
    } catch (error) {
      console.error('Error fetching today\'s summary:', error);
    }
  };

  useEffect(() => {
    if (isVisible && cropName) {
      fetchLogs();
      fetchTodaySummary();
    }
  }, [cropName, isVisible]);

  // Handle manual observation submission
  const handleAddObservation = async () => {
    if (!observationData.title || !observationData.notes) {
      alert('Please provide a title and notes for your observation.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        cropName,
        logType: 'manual_observation',
        title: observationData.title,
        description: `Manual observation: ${observationData.notes}`,
        observation: {
          notes: observationData.notes,
          images: observationData.images,
          voiceNote: observationData.voiceNote
        }
      };

      await axios.post(`${API_URL}/farm-logs`, payload);
      
      // Reset form
      setObservationData({
        title: '',
        notes: '',
        images: [],
        voiceNote: null
      });
      setShowAddObservation(false);
      
      // Refresh logs
      fetchLogs();
      fetchTodaySummary();
      
      alert('Observation added successfully! 📝');
    } catch (error) {
      console.error('Error adding observation:', error);
      alert('Failed to add observation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload to a cloud service
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
          url: e.target.result,
          filename: file.name,
          uploadedAt: new Date()
        });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setObservationData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  // Format log entry display
  const formatLogEntry = (log) => {
    const date = new Date(log.createdAt);
    const timeString = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return { ...log, timeString };
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-br from-white via-[#f8fffe] to-[#f1f5f4] rounded-3xl shadow-2xl p-6 border border-green-200/60 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <DocumentTextIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
              Digital Farm Log
            </h3>
            <p className="text-green-700 text-sm">Trust and traceability for your farm</p>
          </div>
        </div>

        {/* Add Observation Button */}
        <button
          onClick={() => setShowAddObservation(true)}
          className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Add Manual Observation"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Today's Summary */}
      {todaySummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-green-200/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{todaySummary.totalEntries}</div>
              <div className="text-xs text-green-700">Total Entries</div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-200/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{todaySummary.tasksCompleted}</div>
              <div className="text-xs text-blue-700">Tasks Done</div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-200/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{todaySummary.observations}</div>
              <div className="text-xs text-purple-700">Observations</div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-200/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{todaySummary.pendingSupport}</div>
              <div className="text-xs text-orange-700">Pending Support</div>
            </div>
          </div>
        </div>
      )}

      {/* Log Entries */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <ArrowPathIcon className="h-8 w-8 text-green-500 animate-spin" />
            <span className="ml-2 text-green-600">Loading farm logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No log entries yet. Complete a task or add an observation to get started.</p>
          </div>
        ) : (
          logs.map((log) => {
            const formattedLog = formatLogEntry(log);
            return (
              <div
                key={log._id}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 ${
                  log.logType === 'task_completion' 
                    ? 'border-green-200/60' 
                    : log.logType === 'manual_observation'
                    ? 'border-blue-200/60'
                    : 'border-orange-200/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {log.logType === 'task_completion' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : log.logType === 'manual_observation' ? (
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                      )}
                      <h4 className="font-semibold text-gray-800">{log.title}</h4>
                      {log.supportStatus?.sent && !log.supportStatus?.responded && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                          Sent to Support
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{log.description}</p>
                    
                    {/* Task details */}
                    {log.taskDetails && (
                      <div className="flex items-center gap-4 text-xs text-green-600 mb-2">
                        <span>Stage: {log.taskDetails.stageName}</span>
                        <span>Priority: {log.taskDetails.priority}</span>
                        <span>Time: {log.taskDetails.estimatedTime}</span>
                      </div>
                    )}

                    {/* Observation details */}
                    {log.observation && (
                      <div className="mt-2">
                        {log.observation.images && log.observation.images.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-blue-600 mb-1">
                            <PhotoIcon className="h-4 w-4" />
                            <span>{log.observation.images.length} photo(s) attached</span>
                          </div>
                        )}
                        {log.observation.voiceNote && (
                          <div className="flex items-center gap-2 text-xs text-blue-600 mb-1">
                            <SpeakerWaveIcon className="h-4 w-4" />
                            <span>Voice note attached</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end text-xs text-gray-500">
                    <ClockIcon className="h-4 w-4 mb-1" />
                    <span>{formattedLog.timeString}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Observation Modal */}
      {showAddObservation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-white/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DocumentTextIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Add Observation</h3>
                <p className="text-gray-600 text-sm">Record what you see in your field</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={observationData.title}
                  onChange={(e) => setObservationData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Yellow spots on leaves"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observations & Notes
                </label>
                <textarea
                  value={observationData.notes}
                  onChange={(e) => setObservationData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe what you observed in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Photos (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 cursor-pointer transition-colors"
                >
                  <CameraIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Tap to add photos</span>
                </label>
                {observationData.images.length > 0 && (
                  <div className="mt-2 text-sm text-blue-600">
                    {observationData.images.length} photo(s) selected
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddObservation(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddObservation}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Observation'}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-2">
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  <strong>Auto-Support:</strong> If your observation mentions issues like diseases, pests, or problems, 
                  it will be automatically sent to our Kisan Mel support team for expert analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmLog; 