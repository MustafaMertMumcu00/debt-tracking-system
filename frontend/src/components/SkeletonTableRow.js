import React from 'react';

function SkeletonTableRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-4 w-16">
        <div className="h-4 w-4 bg-gray-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-40"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-28"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-4 bg-gray-700 rounded w-20 ml-auto"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-6 w-24 bg-gray-700 rounded-full mx-auto"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-4 bg-gray-700 rounded w-24 ml-auto"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-4 bg-gray-700 rounded w-24 ml-auto"></div>
      </td>
    </tr>
  );
}

export default SkeletonTableRow;