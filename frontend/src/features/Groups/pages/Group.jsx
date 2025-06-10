import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { viewGroup } from '../services/groups';
import { Users, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Group = () => {

    const [trendingUp, setTrendingUp] = useState(true);
    const [group, setGroup] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const params = useParams();
    const id = params.id;

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

    return (
        <div>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">   
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-10">
                    <div className='flex flex-col bg-neutral-100 rounded-xl p-4 shadow-md gap-4 w-full'>
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

                    <div className='flex flex-col bg-neutral-100 rounded-xl p-4 shadow-md gap-2 w-full'>
                        <div className="flex flex-row items-center gap-2">
                            <Users className="w-6 h-6 text-black" />
                            <h1 className="text-3xl font-semibold text-black">Members</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Group;