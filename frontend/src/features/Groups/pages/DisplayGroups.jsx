import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { viewGroups } from '../services/groups';
import Header from '../../../components/Header';

const DisplayGroups = () => {
    const [groups, setGroups] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setIsSubmitting(true);
                const response = await viewGroups();
                setGroups(response);
            } catch (error) {
                console.error('Error fetching groups:', error);
                setLoginError('Failed to fetch groups. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        };
        fetchGroups();
    }, []);


    const handleCreateGroup = () => {
        console.log("Create group clicked");
      };
    
    const handleJoinGroup = () => {
        console.log("Join group clicked");
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">   
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your groups and collaborations</p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleCreateGroup}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Group
            </button>
            <button 
              onClick={handleJoinGroup}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Join Group
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
          </div>
          
          <div className="p-6">
            {isSubmitting ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600">Loading groups...</p>
                </div>
              </div>
            ) : groups.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map(group => (
                  <div 
                    key={group.id} 
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-gray-100"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">{group.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{group.description}</p>
                    <div className="mt-4 flex justify-end">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first group or joining an existing one.</p>
                <button 
                  onClick={handleCreateGroup}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Your First Group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
};

export default DisplayGroups;
