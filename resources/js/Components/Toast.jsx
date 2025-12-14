import React from 'react';

export default function Toast({ message, type = 'success' }) {
    const bgColor = type === 'success' ? 'bg-green-100' : 
                    type === 'error' ? 'bg-red-100' : 
                    type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100';
    
    const textColor = type === 'success' ? 'text-green-800' : 
                      type === 'error' ? 'text-red-800' : 
                      type === 'warning' ? 'text-yellow-800' : 'text-blue-800';

    return (
        <div className={`fixed top-4 right-4 z-50 ${bgColor} ${textColor} px-4 py-3 rounded-md shadow-lg`}>
            {message}
        </div>
    );
}