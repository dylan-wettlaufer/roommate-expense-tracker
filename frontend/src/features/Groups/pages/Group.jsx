import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { viewGroup, getGroupMembers } from '../services/groups';
import { Users, TrendingUp, TrendingDown, DollarSign, Calendar, UserRoundPlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import MemberList from '../components/MemberList';

const Group = () => {

    const [trendingUp, setTrendingUp] = useState(true);
    const [group, setGroup] = useState({});
    const [members, setMembers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMembersSubmitting, setIsMembersSubmitting] = useState(false);

    const params = useParams();
    const id = params.id;
    const [transactions, setTransactions] = useState([]);

    const dummyExpenses = [
        {
            name: "Groceries",
            amount: 100,
            date: "2025-06-11",
            category: "Food",
            group_id: id,
            user_id: 1,
            paid_by: 1,
            description: "Groceries for the week",
            is_settled: false,
            split: 2
        }
    ]

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                setIsSubmitting(true);
                const response = await viewGroup(id);
                setGroup(response);
            } catch (error) {
                console.error('Error fetching group:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
        fetchGroup();
    }, []);

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
        fetchMembers();
    }, []);

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
                                <p className='text-zinc-800 font-semibold text-md font-display'>$0</p>
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
                                    <p className='text-green-600 font-semibold text-md font-display'>+$0</p>
                                </div>
                            ) : (
                                <div>
                                    <p className='text-zinc-600 text-sm font-sans1'>Your Balance</p>
                                    <p className='text-red-600 font-semibold text-md font-display'>-$0</p>
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
                    <button className='w-full h-12 bg-emerald-600 hover:bg-emerald-700 border border-zinc-800 rounded-xl text-white font-medium py-2 px-4'>
                        + Add Expense
                    </button>
                    <button className='w-full h-12 bg-neutral-500 hover:bg-neutral-600 border border-zinc-800 rounded-xl text-white font-medium py-2 px-4'>
                        $ Settle Up
                    </button>
                    <button className='w-full h-12 bg-white hover:bg-gray-200 border border-zinc-400 rounded-xl text-zinc-800 font-medium py-2 px-4'>
                        Expense History
                    </button>
                </div>


                {/* Recent Expenses */}
                <div className='flex flex-col bg-neutral-100 rounded-xl p-4 border border-zinc-300 gap-2 w-full h-full mb-6'>
                    <h1 className='text-lg font-semibold text-zinc-800 font-display'>Recent Expenses</h1>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-2'>
                            <div className='flex flex-row items-center gap-2'>
                                <div className='rounded-full bg-neutral-500 p-2 w-12 h-12 flex items-center justify-center'>
                                    <p className='text-white font-semibold text-md'>DW</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-800 text-md font-semibold font-sans1'>Expense Name</p>
                                    <div className='flex flex-row items-center gap-6'>
                                        <p className='text-zinc-600 text-sm font-sans1'>Paid By</p>

                                        <div className='flex flex-row items-center gap-1'>
                                            <Users className="w-3 h-3 text-zinc-600" />
                                            <p className='text-zinc-600 text-sm font-sans1'>Split 4 Ways</p>
                                        </div>

                                        <div className='flex flex-row items-center gap-1'>
                                            <Calendar className="w-3 h-3 text-zinc-600" />
                                            <p className='text-zinc-600 text-sm font-sans1'>Date</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            
                            <div className='flex flex-col items-end gap-1'>
                                <p className='text-zinc-800 text-lg font-display font-semibold'>$100</p>
                                <p className='text-zinc-600 text-sm font-sans1'>$25 per person</p>
                            </div>
                        </div>
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
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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