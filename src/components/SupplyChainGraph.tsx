import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Node, Edge, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { companies, relationships } from '../data';
import type { EntityType, Country } from '../data/types';

const TYPE_COLORS: Record<EntityType, string> = {
  oem: '#00d4ff',
  tier1_supplier: '#ff6b35',
  component_maker: '#a855f7',
  raw_material: '#22c55e',
  ai_compute: '#f59e0b',
};

const COUNTRY_COLORS: Record<string, string> = {
  US: '#3b82f6',
  CN: '#ef4444',
};

function CompanyNode({ data }: NodeProps) {
  const d = data as {
    label: string;
    type: EntityType;
    country: Country;
    isOem: boolean;
    marketShare?: string;
    shipments?: number;
  };
  const borderColor = TYPE_COLORS[d.type] || '#555';
  const countryDot = COUNTRY_COLORS[d.country] || '#888';

  return (
    <div
      className={`graph-node ${d.isOem ? 'graph-node--oem' : ''}`}
      style={{ borderColor }}
    >
      <Handle type="target" position={Position.Left} style={{ background: borderColor }} />
      <div className="graph-node__country-dot" style={{ background: countryDot }} />
      <div className="graph-node__label">{d.label}</div>
      {d.marketShare && <div className="graph-node__meta">{d.marketShare}</div>}
      {d.shipments && <div className="graph-node__meta">{d.shipments.toLocaleString()} units</div>}
      <Handle type="source" position={Position.Right} style={{ background: borderColor }} />
    </div>
  );
}

const nodeTypes = { company: CompanyNode };

interface SupplyChainGraphProps {
  onNodeSelect: (id: string) => void;
  selectedId: string | null;
  filter: { country: string; type: string };
}

export default function SupplyChainGraph({ onNodeSelect, selectedId, filter }: SupplyChainGraphProps) {
  const { initialNodes, initialEdges } = useMemo(() => {
    // Layout: arrange by type in columns
    const typeColumns: Record<EntityType, number> = {
      raw_material: 0,
      component_maker: 1,
      ai_compute: 1.5,
      tier1_supplier: 2,
      oem: 3,
    };

    // Filter companies
    let filtered = companies;
    if (filter.country !== 'all') {
      filtered = filtered.filter((c) => c.country === filter.country);
    }
    if (filter.type !== 'all') {
      filtered = filtered.filter((c) => c.type === filter.type);
    }

    const filteredIds = new Set(filtered.map((c) => c.id));

    // Group by column for y-positioning
    const columnCounts: Record<number, number> = {};
    const columnIndices: Record<string, number> = {};

    filtered.forEach((c) => {
      const col = typeColumns[c.type];
      if (!columnCounts[col]) columnCounts[col] = 0;
      columnIndices[c.id] = columnCounts[col];
      columnCounts[col]++;
    });

    const colSpacing = 380;
    const rowSpacing = 120;

    const nodes: Node[] = filtered.map((c) => {
      const col = typeColumns[c.type];
      const idx = columnIndices[c.id];
      const totalInCol = columnCounts[col];
      const yOffset = -(totalInCol * rowSpacing) / 2;

      return {
        id: c.id,
        type: 'company',
        position: {
          x: col * colSpacing + 50,
          y: yOffset + idx * rowSpacing + 50,
        },
        data: {
          label: c.name,
          type: c.type,
          country: c.country,
          isOem: c.type === 'oem',
          marketShare: c.marketShare,
          shipments: c.robotSpecs?.shipments2025,
        },
        selected: c.id === selectedId,
      };
    });

    const edges: Edge[] = relationships
      .filter((r) => filteredIds.has(r.from) && filteredIds.has(r.to))
      .map((r) => ({
        id: r.id,
        source: r.from,
        target: r.to,
        label: r.component,
        animated: (r.from === selectedId || r.to === selectedId),
        style: {
          stroke:
            r.from === selectedId || r.to === selectedId
              ? '#00d4ff'
              : 'rgba(255,255,255,0.15)',
          strokeWidth: r.bomPercent ? Math.max(1.5, r.bomPercent / 15) : 1.5,
        },
        labelStyle: {
          fill: 'rgba(255,255,255,0.5)',
          fontSize: 9,
          fontFamily: 'Share Tech Mono, monospace',
        },
        labelBgStyle: {
          fill: 'rgba(10,12,18,0.8)',
        },
      }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [selectedId, filter]);

  const [, , onNodesChange] = useNodesState(initialNodes);
  const [, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  return (
    <div className="graph-container">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(0,212,255,0.08)"
        />
      </ReactFlow>
    </div>
  );
}
