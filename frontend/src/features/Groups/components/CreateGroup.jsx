import React from 'react';
import { useState } from 'react';
import { createGroup } from '../services/groups';

const CreateGroup = (props) => {

    const [members, setMembers] = useState([{ email: '', name: '' }]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('CAD');
    const [errors, setErrors] = useState({});
    const [isCreating, setIsCreating] = useState(false);

    const validationRules = {
        name: (value) => {
          if (!value) return 'Group name is required';
          return '';
        }
      };

    
    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index][field] = value;
        setMembers(updatedMembers);
      };
    
      const addMember = () => {
        setMembers(prev => [...prev, { email: '', name: '' }]);
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (name) {
            setIsCreating(true);
                try {
                const response = await createGroup(name, description)
                console.log(response)

                setName('');
                setDescription('');
                setCurrency('CAD');
                setMembers([{ email: '', name: '' }]);
                props.onGroupCreated(response);
                props.handleCreateGroup();

            } catch (error) {
                console.error(error)
            } finally {
                setIsCreating(false);
            }   
        } else {
            setErrors(prev => ({ ...prev, general: 'Please fill in all required fields' }));
        }

       
      };


    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl'>
                <h2 className="text-2xl font-bold text-neutral-800 mb-6">Create New Group</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Group Name *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Apartment 4B, College Dorm, Vacation House"
                            />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Brief description of this group..."
                        />                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Currency</label>
                        <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                        <option value="USD">$ US Dollar (USD)</option>
                        <option value="CAD">$ Canadian Dollar (CAD)</option>
                        <option value="EUR">€ Euro (EUR)</option>
                        <option value="GBP">£ British Pound (GBP)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Add Members</label>
                        {members.map((member, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3">
                                <input
                                    type="email"
                                    value={member.email}
                                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="email@example.com"
                                />
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Name (optional)"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addMember}
                            className="text-blue-600 hover:underline text-sm font-medium"
                        >
                            + Add Member
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                            Add roommates by email. They’ll receive an invitation to join the group.
                        </p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button
                        type="button"
                        onClick={props.handleCreateGroup}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-neutral-800"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        disabled={isCreating}
                        className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
                        >
                        {isCreating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Creating Group...
                            </>
                        ) : (
                            'Create Group'
                        )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateGroup;
