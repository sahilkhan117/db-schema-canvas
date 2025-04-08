
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export interface TableNodeData {
  label: string;
  fields: Array<{
    name: string;
    type: string;
    isPrimary?: boolean;
    isUnique?: boolean;
    isNotNull?: boolean;
    isForeignKey?: boolean;
  }>;
}

const TableNode = ({ data }: { data: TableNodeData }) => {
  return (
    <div className="react-flow__node-table">
      <Handle type="target" position={Position.Top} />
      <div className="title">{data.label}</div>
      <div className="content">
        {data.fields.map((field, index) => (
          <div key={index} className="field">
            <span>
              {field.isPrimary && <span className="primary-key">🔑</span>}
              {field.isForeignKey && <span className="foreign-key">🔗</span>}
              {field.isUnique && <span className="unique">★</span>}
              {field.isNotNull && <span className="not-null">•</span>}
              <span className="field-name">{field.name}</span>
              <span className="field-type">{field.type}</span>
            </span>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(TableNode);
