import React, { useEffect, useState } from 'react';
import { UserRoundPlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getGroupMembers } from '../services/groups';

const MemberList = (props) => {

    return (
        <div className='flex flex-row items-center gap-2 border-b border-zinc-200 pb-2'>
            <div className='rounded-full bg-neutral-500 p-2 w-12 h-12 flex items-center justify-center'>
                <p className='text-white font-semibold text-md'>{props.member.first_name[0]}{props.member.last_name[0]}</p>
            </div>
            <div key={props.member.id} className='flex flex-col'>
                <p className='text-zinc-800 font-semibold text-md'>{props.member.first_name} {props.member.last_name}</p>
                <p className='text-zinc-600 text-sm'>{props.member.email}</p>
            </div>
        </div>  
            );
        }

export default MemberList;
