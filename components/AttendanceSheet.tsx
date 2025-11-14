import React, { useState, useEffect } from 'react';
import type { Student, AttendanceRecord } from '../types';

interface AttendanceSheetProps {
  date: Date;
  timeSlot: string;
  students: Student[];
  attendanceData: AttendanceRecord[];
  updateAttendance: (studentId: string, present: boolean) => void;
}

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      <span className={`ml-3 text-sm font-medium ${checked ? 'text-primary' : 'text-gray-500'}`}>
        {checked ? 'Present' : 'Absent'}
      </span>
    </label>
  );
};

export function AttendanceSheet({ date, timeSlot, students, attendanceData, updateAttendance }: AttendanceSheetProps) {
  const formattedDate = date.toISOString().split('T')[0];
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const initialData: Record<string, boolean> = {};
    students.forEach(student => {
        const record = attendanceData.find(
          r => r.studentId === student.id && r.date === formattedDate && r.timeSlot === timeSlot
        );
        initialData[student.id] = record ? record.present : true;
    });
    setCurrentAttendance(initialData);
    setHasChanges(false);
    setShowSuccess(false);
  }, [date, timeSlot, students, attendanceData, formattedDate]);

  const handleToggleChange = (studentId: string, present: boolean) => {
    setCurrentAttendance(prev => ({
        ...prev,
        [studentId]: present
    }));
    if (!hasChanges) {
      setHasChanges(true);
    }
  };

  const handleSubmit = () => {
    // FIX: The `present` value from `Object.entries` was being inferred as `unknown`, causing a type error.
    // Using `Object.keys` provides better type safety.
    Object.keys(currentAttendance).forEach((studentId) => {
        updateAttendance(studentId, currentAttendance[studentId]);
    });

    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };


  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">Attendance for</h2>
      <p className="text-lg text-primary font-semibold mb-6">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="flex items-center text-lg font-bold text-gray-700 mb-4 border-b pb-2">
            <ClockIcon/>
            {timeSlot}
        </h3>
        <div className="space-y-4">
          {students.map(student => {
            const isPresent = currentAttendance[student.id] ?? true;

            return (
              <div key={student.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                   <div className="w-10 h-10 rounded-full mr-4 bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg flex-shrink-0">
                     {student.rollNo}
                   </div>
                   <span className="font-medium">{student.name}</span>
                </div>
                <Toggle 
                  checked={isPresent} 
                  onChange={(present) => handleToggleChange(student.id, present)}
                />
              </div>
            );
          })}
        </div>
      </div>
       <div className="mt-8 flex justify-end items-center space-x-4">
        {showSuccess && (
          <span className="text-green-600 font-medium transition-opacity duration-300">
            Attendance saved!
          </span>
        )}
        <button
          onClick={handleSubmit}
          disabled={!hasChanges}
          className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}