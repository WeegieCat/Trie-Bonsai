"use client";

import { useEffect, useState } from "react";

interface Node {
    id: string;
    x: number;
    y: number;
    z: number;
    size: number;
}

interface Edge {
    from: string;
    to: string;
}

export function AnimatedBonsai() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // シンプルなツリー構造をジェネレート
        const generateTree = () => {
            const nodes: Node[] = [];
            const edges: Edge[] = [];
            let id = 0;

            // ルートノード
            nodes.push({ id: `node-${id}`, x: 0, y: 0, z: 0, size: 1.5 });
            let parentId = id;
            id++;

            // レイア1: 5つの子ノード
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const x = Math.cos(angle) * 3;
                const z = Math.sin(angle) * 3;
                nodes.push({
                    id: `node-${id}`,
                    x,
                    y: 2,
                    z,
                    size: 1,
                });
                edges.push({ from: `node-${parentId}`, to: `node-${id}` });
                const currentParent = id;
                id++;

                // レイア2: 各子から2-3つのサブノード
                for (let j = 0; j < 2; j++) {
                    const subAngle = angle + (j - 0.5) * 0.8;
                    const subX = Math.cos(subAngle) * 2 + x;
                    const subZ = Math.sin(subAngle) * 2 + z;
                    nodes.push({
                        id: `node-${id}`,
                        x: subX,
                        y: 4,
                        z: subZ,
                        size: 0.7,
                    });
                    edges.push({
                        from: `node-${currentParent}`,
                        to: `node-${id}`,
                    });
                    id++;
                }
            }

            return { nodes, edges };
        };

        const { nodes: allNodes, edges: allEdges } = generateTree();

        // アニメーション進度に応じてノードを表示
        const visibleCount = Math.ceil((progress / 100) * allNodes.length);
        setNodes(allNodes.slice(0, visibleCount));

        // エッジもノードに合わせて表示
        const visibleIds = new Set(
            allNodes.slice(0, visibleCount).map((n) => n.id),
        );
        setEdges(
            allEdges.filter(
                (e) => visibleIds.has(e.from) && visibleIds.has(e.to),
            ),
        );
    }, [progress]);

    useEffect(() => {
        // 自動アニメーション
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='w-full h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black'>
            <svg
                viewBox='-8 -2 16 10'
                className='w-full h-full max-w-2xl'
                style={{
                    filter: "drop-shadow(0 0 20px rgba(74, 222, 128, 0.3))",
                }}>
                {/* エッジ（線） */}
                {edges.map((edge, idx) => {
                    const fromNode = nodes.find((n) => n.id === edge.from);
                    const toNode = nodes.find((n) => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    return (
                        <line
                            key={`edge-${idx}`}
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke='#8B7355'
                            strokeWidth='0.1'
                            opacity='0.8'
                        />
                    );
                })}

                {/* ノード（球） */}
                {nodes.map((node, idx) => (
                    <circle
                        key={node.id}
                        cx={node.x}
                        cy={node.y}
                        r={node.size * 0.15}
                        fill='#4CAF50'
                        opacity={0.8 + Math.sin(Date.now() / 500 + idx) * 0.2}
                        style={{
                            filter: "drop-shadow(0 0 4px rgba(76, 175, 80, 0.8))",
                            transition: "opacity 0.3s ease",
                        }}
                    />
                ))}
            </svg>

            {/* プログレスバー */}
            <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64'>
                <div className='h-1 bg-gray-700 rounded-full overflow-hidden'>
                    <div
                        className='h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300'
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className='text-gray-400 text-sm text-center mt-2'>
                    盆栽を生成中... {progress}%
                </p>
            </div>
        </div>
    );
}
