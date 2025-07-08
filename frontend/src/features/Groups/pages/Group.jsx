import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { viewGroup, getGroupMembers } from '../services/groups';
import { getAllExpenses } from '../../Expenses/services/expenses';
import { Users, TrendingUp, TrendingDown, DollarSign, Calendar, UserRoundPlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import MemberList from '../components/MemberList';
import CreateExpense from '../../Expenses/components/CreateExpense';

const Group = () => {

    const [trendingUp, setTrendingUp] = useState(true);
    const [group, setGroup] = useState({});
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMembersSubmitting, setIsMembersSubmitting] = useState(false);
    const [isExpensesSubmitting, setIsExpensesSubmitting] = useState(false);
    const [showCreateExpense, setShowCreateExpense] = useState(false);

    const params = useParams();
    const id = params.id;
    
    const handleShowCreateExpense = () => {
        setShowCreateExpense(prev => !prev);
    };

    const handleExpenseCreated = (newExpense) => {
        setExpenses(prev => [...prev, newExpense]);
    };

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                setIsSubmitting(true);
                const response = await viewGroup(id);
                setGroup(response);
                setTrendingUp(response.balance >= 0);
                // if number is negative remove minus sign
                if (response.balance < 0) {
                    setGroup({
                        ...response,
                        balance: response.balance * -1
                    });
                }
            } catch (error) {
                console.error('Error fetching group:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
        if (id) fetchGroup();
    }, [id]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setIsMembersSubmitting(true);
                const response = await getGroupMembers(id);
                setMembers(response);
            } catch (error) {
                console.error('Error fetching members:', error);
            } finally {
                setIsMembersSubmitting(false);
            }
        };
        if (id) fetchMembers();
    }, [id]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                setIsExpensesSubmitting(true);
                const response = await getAllExpenses(id);
                setExpenses(response);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            } finally {
                setIsExpensesSubmitting(false);
            }
        };
        if (id) fetchExpenses();
    }, [id]);

    return (
        <div className='bg-gray-100 h-screen w-screen'>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-4 flex flex-col sm:flex-row justify-between gap-10 bg-neutral-100 rounded-xl p-4 border border-zinc-300">
                    <div className='flex flex-col gap-2'>
                        <h1 className="text-3xl font-semibold text-black font-display">{group.name}</h1>
                        <p className='text-zinc-600 text-sm font-sans1'>{group.description}</p>
                        <div className='flex flex-row items-center gap-2 font-sans1'>
                            <Calendar className="w-4 h-4 text-zinc-600" />
                            <p className='text-zinc-800 text-md'>Created on {new Date(group.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</p>
                        </div>
                        
                    </div>
                    <div className='flex flex-row items-center gap-4'>
                        
                        <div className='flex flex-row items-center gap-2 bg-neutral-200 p-2 rounded-xl border border-zinc-300'>
                            <div className='rounded-lg p-2'>
                                <DollarSign className="w-6 h-6 text-neutral-600" />
                            </div>
                            <div>
                                <p className='text-zinc-600 text-sm font-sans1'>Total Expenses</p>
                                <p className='text-zinc-800 font-semibold text-md font-display'>${group.grand_total}</p>
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-2 bg-neutral-200 p-2 rounded-xl border border-zinc-300'>
                            {trendingUp ? (
                                <div className='rounded-lg p-2'>
                                    <TrendingUp className="w-6 h-6 text-neutral-600" />
                                </div>
                            ) : (
                                <div className='rounded-lg p-2'>
                                    <TrendingDown className="w-6 h-6 text-neutral-600" />
                                </div>
                            )}
                            {trendingUp ? (
                                <div>
                                    <p className='text-zinc-600 text-sm font-sans1'>Your Balance</p>
                                    <p className='text-green-600 font-semibold text-md font-display'>+${group.balance}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className='text-zinc-600 text-sm font-sans1'>Your Balance</p>
                                    <p className='text-red-600 font-semibold text-md font-display'>-${group.balance}</p>
                                </div>
                            )}
                        </div>

                        <div className='flex flex-row items-center gap-2 bg-neutral-200 p-2 rounded-xl border border-zinc-300'>
                            <div className='rounded-lg p-2'>
                                <Users className="w-6 h-6 text-neutral-600" />
                            </div>
                            <div>
                                <p className='text-zinc-600 text-sm font-sans1'>Members</p>
                                <p className='text-zinc-800 font-semibold text-md font-display'>{members.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className='mb-4 flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 bg-neutral-100 rounded-xl p-4 border border-zinc-300'>
                    <button 
                        onClick={handleShowCreateExpense}
                        className='w-full h-12 bg-emerald-600 hover:bg-emerald-700 border border-zinc-800 rounded-xl text-white font-medium py-2 px-4'>
                        + Add Expense
                    </button>
                    <button className='w-full h-12 bg-neutral-500 hover:bg-neutral-600 border border-zinc-800 rounded-xl text-white font-medium py-2 px-4'>
                        $ Settle Up
                    </button>
                    <button 
                        className='w-full h-12 bg-white hover:bg-gray-200 border border-zinc-400 rounded-xl text-zinc-800 font-medium py-2 px-4'>
                        Expense History
                    </button>
                    <button 
                        className='w-full h-12 bg-white hover:bg-gray-200 border border-zinc-400 rounded-xl text-zinc-800 font-medium py-2 px-4'>
                        Settle History
                    </button>
                </div>

                {/* modals */}
                {showCreateExpense && <CreateExpense members={members} handleShowCreateExpense={handleShowCreateExpense} onExpenseCreated={handleExpenseCreated} group_id={id}/>}

                {/* Recent Expenses */}
                <div className='flex flex-col bg-neutral-100 rounded-xl p-4 border border-zinc-300 gap-2 w-full h-full mb-6'>
                    <div className='flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-2'>
                        <h1 className='text-lg font-semibold text-zinc-800 font-display'>Pending Expenses</h1>
                    </div>
                    
                    <div className='flex flex-col gap-2'>
                        {isExpensesSubmitting ? (
                            <div className="flex items-center justify-center py-12 w-full h-full bg-neutral-100">
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                                    <p className="text-black">Loading expenses...</p>
                                </div>
                            </div>
                        ) : expenses.length > 0 ? (
                            expenses.map(expense => (
                                <div key={expense.id} className='flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-2'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <div className='rounded-full bg-neutral-500 p-2 w-12 h-12 flex items-center justify-center'>
                                            <p className='text-white font-semibold text-md'>DW</p>
                                        </div>
                                        
                                        <div className='flex flex-col'>
                                            <p className='text-zinc-800 text-md font-semibold font-sans1'>{expense.name}</p>

                                            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1'>
                                                <p className='text-zinc-600 text-sm font-sans1'>Paid by {expense.paid_by}</p>

                                                <div className='flex flex-row items-center gap-1'>
                                                    <Users className="w-3 h-3 text-zinc-600" />
                                                    <p className='text-zinc-600 text-sm font-sans1'> Split {expense.split_count} ways</p>
                                                </div>

                                                <div className='flex flex-row items-center gap-1'>
                                                    <Calendar className="w-3 h-3 text-zinc-600" />
                                                    <p className='text-zinc-600 text-sm font-sans1'>{new Date(expense.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                            })}</p>
                                                </div>

                                        </div>
                                    </div>
                                </div>
                            
                            <div className='flex flex-col items-end gap-1'>
                                <p className='text-zinc-800 text-lg font-display font-semibold'>${expense.amount}</p>
                                <p className='text-zinc-600 text-sm font-sans1'>{expense.amount_per_person} per person</p>
                            </div>
                        </div>
                            ))
                        ) : (
                            <p className='text-zinc-600 text-sm font-sans1'>No expenses found.</p>
                        )}
                    
                    </div>
                </div> 


                {/* Members */}
                <div className='mb-8'>
                    <div className='flex flex-col bg-neutral-100 rounded-xl p-4 border border-zinc-300 gap-2 w-full h-full'>
                        <div className="flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                            <h1 className="text-lg font-semibold text-zinc-800">Members</h1>
                            <button onClick={() => {}}>
                                <UserRoundPlus className="w-6 h-6 text-zinc-600" />
                            </button>
                        </div>
                    
                        <div className='flex flex-col gap-2'>

                            {isMembersSubmitting ? (
                                <div className="flex items-center justify-center py-12 w-full h-full bg-neutral-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                                        <p className="text-black">Loading members...</p>
                                    </div>
                                </div>
                            ) :

                            members.map((member) => (
                                <MemberList member={member}/>
                            ))
                            }
                        </div>
                    </div>
                </div>
                

        
            </div>
        </div>
    );
};

export default Group;