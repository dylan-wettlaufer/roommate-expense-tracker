import React from 'react';
import { useState } from 'react';
import { joinGroup } from '../services/groups';

const JoinGroup = (props) => {
    const [invite_code, setInviteCode] = useState('');
    const [errors, setErrors] = useState({});
    const [isJoining, setIsJoining] = useState(false);

    const handleInviteCodeChange = (e) => { // handle invite code change
        setInviteCode(e.target.value);
      };

    const handleSubmit = async (e) => { // handle form submission
        e.preventDefault();
        if (invite_code) { // if invite code is not empty
          setIsJoining(true);
          try {
            const response = await joinGroup(invite_code);
            console.log(response);
            setInviteCode('');
            setErrors({});
            setIsJoining(false); // stop loading
            props.onGroupJoined(response); // add the group to the groups list
            props.handleShowJoinGroup(); // close the join group modal
          } catch (error) {
            setErrors(prev => ({ ...prev, invite_code: 'Group code is invalid' }));
          } finally {
            setIsJoining(false); // stop loading
          }
        } else {
          setErrors(prev => ({ ...prev, invite_code: 'Please fill in all required fields' }));
        }
      };

      return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">Join Group</h2>
                <p className="text-sm text-neutral-600 mb-4">Enter a group code to join an existing group.</p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Group Code *</label>
                        <input
                            type="text"
                            required
                            value={invite_code}
                            onChange={handleInviteCodeChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.invite_code && (
                            <p className="mt-1 text-sm text-red-600">{errors.invite_code}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 mt-6">
                        <button
                        type="button"
                        onClick={props.handleShowJoinGroup}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-neutral-800"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        disabled={isJoining}
                        className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
                        >
                        {isJoining ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Joining...
                            </>
                        ) : (
                            'Join Group'
                        )}
                        </button>
                    </div>
                </form>

            </div>

        </div>

      )

}

export default JoinGroup;
