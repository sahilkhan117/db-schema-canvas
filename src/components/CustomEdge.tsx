
import { memo } from 'react';
import { getBezierPath, EdgeText } from '@xyflow/react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <EdgeText
          x={labelX}
          y={labelY}
          label={data.label}
          labelStyle={{ fill: 'white', fontSize: 12, fontWeight: 500 }}
          labelBgStyle={{ fill: 'rgba(0, 0, 0, 0.7)' }}
          labelBgPadding={[2, 4]}
          labelBgBorderRadius={4}
        />
      )}
    </>
  );
};

export default memo(CustomEdge);
