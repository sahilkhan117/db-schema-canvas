
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const TableNode = ({ data }) => {
  const { label, fields, color = 'purple' } = data;

  // Color mapping for the table header
  const colorMap = {
    purple: 'bg-purple-600',
    teal: 'bg-teal-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    pink: 'bg-pink-600'
  };

  const headerColor = colorMap[color] || 'bg-purple-600';

  return (
    <div className="border border-gray-700 rounded-md shadow-lg overflow-hidden bg-gray-900 min-w-[220px]">
      <div className={`py-2 px-3 font-bold ${headerColor}`}>
        {label}
      </div>
      <div className="p-0">
        {fields && fields.map((field, index) => (
          <div 
            key={field.name} 
            className={`py-1.5 px-3 flex items-center text-sm ${index < fields.length - 1 ? 'border-b border-gray-800' : ''}`}
          >
            {/* Field indicators */}
            <div className="flex space-x-1 mr-2">
              {field.isPrimary && (
                <span className="text-yellow-500" title="Primary Key">PK</span>
              )}
              {field.isForeignKey && (
                <span className="text-blue-500" title="Foreign Key">FK</span>
              )}
              {field.isUnique && !field.isPrimary && (
                <span className="text-green-500" title="Unique">U</span>
              )}
              {field.isNotNull && !field.isPrimary && (
                <span className="text-orange-500" title="Not Null">!</span>
              )}
            </div>

            {/* Field name and type */}
            <div className="flex-1 flex items-center justify-between">
              <span className="text-white">{field.name}</span>
              <span className="text-gray-400 text-xs">{field.type}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-1 rounded-sm bg-gray-400 border-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-1 rounded-sm bg-gray-400 border-none"
      />
    </div>
  );
};

export default memo(TableNode);
