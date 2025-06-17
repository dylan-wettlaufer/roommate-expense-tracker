import React, { useEffect } from 'react';
import { useState } from 'react';
import { createExpense } from '../services/expenses';
import { useNavigate } from 'react-router-dom';
import { getGroupMembers } from '../../Groups/services/groups';

const CreateExpense = (props) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [expense_type, setExpenseType] = useState('');
    const [split_method, setSplitMethod] = useState('');
    const [participants, setParticipants] = useState([]);
    const [errors, setErrors] = useState({});
    const [isCreating, setIsCreating] = useState(false);
    const [isMembersSubmitting, setIsMembersSubmitting] = useState(false);
    const [groupUsers, setGroupUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const response = await createExpense({ name, amount, expense_type, split_method, participants }, props.group_id);
            props.handleShowCreateExpense();
            props.onExpenseCreated(response);
        } catch (error) {
            console.error('Error creating expense:', error);
            setErrors(error.response.data.errors)
        } finally {            
            setName('');
            setAmount('');
            setExpenseType('');
            setSplitMethod('');
            setParticipants([]);
            setErrors({});
            setSelectedUserId('');
            setIsCreating(false);
        }
    };

    useEffect(() => {
        const fetchMembers = async () => {
            if (!props.group_id) return;
            
            try {
                setIsMembersSubmitting(true);
                const response = await getGroupMembers(props.group_id);
                setGroupUsers(response);
            } catch (error) {
                console.error('Error fetching members:', error);
            } finally {
                setIsMembersSubmitting(false);
            }
        };
        fetchMembers();
    }, [props.group_id]);

    const handleAddParticipant = () => {
        if (
            selectedUserId &&
            selectedUserId !== '' &&
            !participants.includes(selectedUserId)
        ) {
            setParticipants((prev) => [...prev, selectedUserId]);
            setSelectedUserId(''); // Reset selection after adding
        }
    };

    return (

        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl'>
                <h2 className="text-2xl font-bold text-neutral-800 mb-6">Create New Expense</h2>
                <form onSubmit={handleSubmit}>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Expense Name *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Rent, Groceries, Utilities"
                            />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Amount *</label>
                        <input
                            type="number"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 100.00"
                            />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Expense Type *</label>
                        <select
                            required
                            value={expense_type}
                            onChange={(e) => setExpenseType(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                            <option value="">Select Expense Type</option>
                            <option value="fixed">Fixed</option>
                            <option value="variable">Variable</option>
                        </select>
                        {errors.expenseType && <p className="text-red-500 text-sm mt-1">{errors.expenseType}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Split Method *</label>
                        <select
                            required
                            value={split_method}
                            onChange={(e) => setSplitMethod(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder='Select Split Method'
                            >
                            <option value="equal">Equal</option>
                            <option value="unequal">Unequal</option>
                        </select>
                        {errors.splitMethod && <p className="text-red-500 text-sm mt-1">{errors.splitMethod}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Add Participants</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className='block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mt-1'
                            placeholder='Select a User'
                        >
                            <option value="">Select a User</option>
                            {groupUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                   {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </select>
                        <button
                            type='button'
                            onClick={handleAddParticipant}
                            disabled={!selectedUserId || participants.includes(selectedUserId)}
                            className='bg-blue-500 text-gray-50 px-4 py-2 rounded-md mt-2 disabled:bg-gray-500 disabled:cursor-auto'
                        >
                            Add Participant
                        </button>

                        <ul className='list-inside list-decimal mt-4'>
                            {participants.map((id) => {
                                const user = groupUsers.find((u) => String(u.id) === String(id));
                                return (
                                    <li key={id}>
                                        {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                                    </li>
                                );
                            })}
                        </ul>

                        {errors.participants && (
                            <p className='text-red-500 mt-1'>{errors.participants}</p>
                        )}

                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button
                        type="button"
                        onClick={props.handleShowCreateExpense}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-neutral-800"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        disabled={isCreating}
                        className="px-6 py-2 w-48 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        >
                        {isCreating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Creating Expense...
                            </>
                        ) : (
                            'Create Expense'
                        )}
                        </button>
                    </div>

                </form>
            </div>
        </div>

    )
}

export default CreateExpense