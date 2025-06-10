import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { viewGroups } from '../services/groups';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import CreateGroup from '../components/CreateGroup';
import JoinGroup from '../components/JoinGroup';    
import { Users } from 'lucide-react';

const DisplayGroups = () => {
    const [groups, setGroups] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showJoinGroup, setShowJoinGroup] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setIsSubmitting(true);
                const response = await viewGroups();
                setGroups(response);
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
        fetchGroups();
    }, []);

    const handleGroupCreated = (newGroup) => {
        setGroups(prev => [...prev, newGroup]);
      };


    const handleCreateGroup = () => {
        setShowCreateGroup(prev => !prev);
      };

    const handleShowJoinGroup = () => {
        setShowJoinGroup(prev => !prev);
    };
    
    const handleJoinGroup = () => {
        console.log("Join group clicked");
    };
    
    const handleLogout = () => {
        console.log("Logout clicked");
    };
    
    return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">   
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Home</h1>
          <p className="text-zinc-700">Manage your groups and collaborations</p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
            <button 
              className="bg-zinc-400 hover:bg-zinc-500 border-0 shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             text-white font-medium py-2 px-4 rounded-lg"
              onClick={handleShowJoinGroup}
            >
              Join Group
            </button>
          </div>

          {showCreateGroup && <CreateGroup handleCreateGroup={handleCreateGroup} onGroupCreated={handleGroupCreated}/>}
          {showJoinGroup && <JoinGroup handleShowJoinGroup={handleShowJoinGroup}/>}
        </div>
        
        <div className="bg-neutral-50 rounded-xl shadow-sm border border-zinc-300">
          <div className="px-6 py-4 border-b border-zinc-300">
            <h2 className="text-xl font-semibold text-black">Your Groups</h2>
          </div>
          
          <div className="p-4">
            {isSubmitting ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-black">Loading groups...</p>
                </div>
              </div>
            ) : groups.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map(group => (
                  <div 
                    key={group.id} 
                    className="bg-gradient-to-r from-white to-neutral-100 rounded-lg p-6 border border-gray-200 hover:bg-neutral-300 transition-shadow duration-200 cursor-pointer hover:bg-neutral-700"
                  >
                    <div className='flex items-center gap-3 mb-4'>
                        <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-black text-lg">{group.name}</h3>
                            <p className='text-zinc-600 text-sm'>Members</p>
                        </div>
                    </div>   
                    
                    <p className="text-black text-sm leading-relaxed">{group.description}</p>
                    <div className="mt-4 flex justify-end">
                      <button className="text-black hover:text-black text-sm font-medium transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">No groups found</h3>
                <p className="text-black mb-6">Get started by creating your first group or joining an existing one.</p>
                <Button 
                  onClick={handleCreateGroup}
                >
                  Create Your First Group
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
};

export default DisplayGroups;
