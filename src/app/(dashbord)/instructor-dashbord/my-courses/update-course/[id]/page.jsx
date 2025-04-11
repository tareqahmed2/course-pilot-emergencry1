'use client'
import useAxiosPublic from '@/app/axios/hooks/useAxiosPublic';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const updateCourse = () => {
    const axiosPublic = useAxiosPublic();
    const { id } = useParams();
    const [courses, setCourses] = useState({});
    console.log(id);
    useEffect(() => {
        axiosPublic.get(`/student-course/${id}`)
            .then(result => {
                console.log(result);
            })
    }, [])
    return (
        <div>
            hi
        </div>
    );
};

export default updateCourse;