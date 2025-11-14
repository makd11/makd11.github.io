
import React from 'react';

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);


export function Header() {
  return (
    <header className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-4">
        <CalendarIcon />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          BCA Batch B Attendance
        </h1>
      </div>
    </header>
  );
}