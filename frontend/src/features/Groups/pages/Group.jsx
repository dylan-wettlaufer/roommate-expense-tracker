import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { viewGroup, getGroupMembers } from '../services/groups';
import { Users, TrendingUp, TrendingDown, DollarSign, Calendar, UserRoundPlus } from 'lucide-react';
import { useParams } from 'react-router-dom';

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
        <div>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8 flex flex-col sm:flex-row justify-between gap-10 bg-neutral-100 rounded-xl p-4 shadow-md">
                    <div className='flex flex-col gap-2'>
                        <h1 className="text-3xl font-semibold text-black">{group.name}</h1>
                        <p className='text-zinc-600 text-sm'>{group.description}</p>
                        <div className='flex flex-row items-center gap-2'>
                            <Calendar className="w-4 h-4 text-zinc-600" />
                            <p className='text-zinc-800 text-md'>Created on {new Date(group.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</p>
                        </div>
                        
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        
                        <div className='flex flex-row items-center gap-2 bg-neutral-200 p-4 rounded-xl'>
                            <div className='rounded-lg bg-sky-200 p-2'>
                                <DollarSign className="w-6 h-6 text-sky-600" />
                            </div>
                            <div>
                                <p className='text-zinc-600 text-sm'>Total Expenses</p>
                                <p className='text-zinc-800 font-semibold text-md'>$0</p>
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-2 bg-neutral-200 p-4 rounded-xl'>
                            {trendingUp ? (
                                <div className='rounded-lg bg-emerald-200 p-2'>
                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                </div>
                            ) : (
                                <div className='rounded-lg bg-red-200 p-2'>
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            )}
                            {trendingUp ? (
                                <div>
                                    <p className='text-zinc-600 text-sm'>Your Balance</p>
                                    <p className='text-green-600 font-semibold text-md'>+$0</p>
                                </div>
                            ) : (
                                <div>
                                    <p className='text-zinc-600 text-sm'>Your Balance</p>
                                    <p className='text-red-600 font-semibold text-md'>-$0</p>
                                </div>
                            )}
                        </div>

                        <div className='flex flex-row items-center gap-2 bg-neutral-200 p-4 rounded-xl'>
                            <div className='rounded-lg bg-orange-200 p-2'>
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className='text-zinc-600 text-sm'>Members</p>
                                <p className='text-zinc-800 font-semibold text-md'>{members.length}</p>
                            </div>
                        </div>

                    </div>
                    
                </div>

                <div className="mb-8 flex flex-col sm:flex-row justify-between gap-10">
                    {isSubmitting ? (
                        <div className="flex items-center justify-center py-12 w-full h-full bg-neutral-100">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <p className="text-black">Loading group...</p>
                            </div>
                        </div>
                    ) : (
                    <div className='flex flex-col bg-neutral-100 rounded-xl p-4 shadow-md gap-4 w-full h-full'>
                        <h1 className="text-3xl font-semibold text-black">{group.name}</h1>
                        <p className='text-zinc-600 text-sm pb-6'>{group.description}</p>
                        <div className='flex flex-row items-center gap-2'>
                            <div className='rounded-lg bg-cyan-200 p-2'>
                                <DollarSign className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div>
                                <p className='text-zinc-600 text-sm'>Total Expenses</p>
                                <p className='text-zinc-800 font-semibold text-md'>$0</p>
                            </div>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            {trendingUp ? (
                                <div className='rounded-lg bg-emerald-200 p-2'>
                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                </div>
                            ) : (
                                <div className='rounded-lg bg-red-200 p-2'>
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            )}
                            {trendingUp ? (
                                <div>
                                    <p className='text-zinc-600 text-sm'>Your Balance</p>
                                    <p className='text-green-600 font-semibold text-md'>+$0</p>
                                </div>
                            ) : (
                                <div>
                                    <p className='text-zinc-600 text-sm'>Your Balance</p>
                                    <p className='text-red-600 font-semibold text-md'>-$0</p>
                                </div>
                            )}
                        </div> 
                        <div className='flex flex-row items-center gap-2'>
                            <div className='rounded-lg bg-stone-200 p-2'>
                                <Calendar className="w-6 h-6 text-stone-600" />
                            </div>
                            <div>
                                <p className='text-zinc-600 text-sm'>Created</p>
                                <p className='text-zinc-800 font-semibold text-md'>{new Date(group.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</p>
                            </div>
                        </div>
                    </div> 
                )}

                    {/* Members */}

                    {isSubmitting ? (
                        <div className="flex items-center justify-center py-12 w-full h-full bg-neutral-100">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <p className="text-black">Loading members...</p>
                            </div>
                        </div>
                    ) : (
                    <div className='flex flex-col bg-neutral-100 rounded-xl p-4 shadow-md gap-2 w-full h-full'>
                        <div className="flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                            <h1 className="text-lg font-semibold text-zinc-800">Members</h1>
                            <button onClick={() => {}}>
                                <UserRoundPlus className="w-6 h-6 text-zinc-600" />
                            </button>
                        </div>
                    
                        <div className='flex flex-col gap-2'>
                            {members.map((member) => (
                                <div className='flex flex-row items-center gap-2 border-b border-zinc-200 pb-2'>
                                    <div className='rounded-full bg-cyan-600 p-2 w-12 h-12 flex items-center justify-center'>
                                        <p className='text-white font-semibold text-md'>{member.first_name[0]}{member.last_name[0]}</p>
                                    </div>
                                    <div key={member.id} className='flex flex-col'>
                                        <p className='text-zinc-800 font-semibold text-md'>{member.first_name} {member.last_name}</p>
                                        <p className='text-zinc-600 text-sm'>{member.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>

                {/* Transactions */}
                <div className='flex flex-col bg-neutral-100 rounded-xl p-4 shadow-md gap-2 w-full h-full'>
                    <h1 className='text-lg font-semibold text-zinc-800'>Recent Expenses</h1>
                    <div className='flex flex-col gap-2'>
                        
                    </div>
                </div>            

            </div>
        </div>
    );
};

export default Group;