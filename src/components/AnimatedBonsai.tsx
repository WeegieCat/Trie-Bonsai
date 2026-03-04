"use client";

import { useEffect, useMemo, useState } from "react";

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
    const [elapsedSec, setElapsedSec] = useState(0);

    const { allNodes, allEdges } = useMemo(() => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];
        let id = 0;

        nodes.push({ id: `node-${id}`, x: 0, y: 0, z: 0, size: 1.5 });
        const rootId = id;
        id++;

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

            edges.push({ from: `node-${rootId}`, to: `node-${id}` });
            const currentParentId = id;
            id++;

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
                    from: `node-${currentParentId}`,
                    to: `node-${id}`,
                });

                id++;
            }
        }

        return { allNodes: nodes, allEdges: edges };
    }, []);

    const revealIntervalSec = 0.12;
    const growDurationSec = 0.28;
    const pauseSec = 0.8;

    const nodeStartTimeMap = useMemo(() => {
        const map = new Map<string, number>();
        allNodes.forEach((node, index) => {
            map.set(node.id, index * revealIntervalSec);
        });
        return map;
    }, [allNodes]);

    const animationEndSec =
        allNodes.length > 0
            ? (allNodes.length - 1) * revealIntervalSec + growDurationSec
            : 0;
    const loopDurationSec = animationEndSec + pauseSec;

    useEffect(() => {
        let frameId = 0;
        const startTime = performance.now();

        const animate = () => {
            const now = performance.now();
            const elapsed = (now - startTime) / 1000;
            const loopedElapsed =
                loopDurationSec > 0 ? elapsed % loopDurationSec : 0;

            setElapsedSec(loopedElapsed);
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [loopDurationSec]);

    const progress =
        loopDurationSec > 0
            ? Math.round(
                  (Math.min(elapsedSec, animationEndSec) / animationEndSec) *
                      100,
              )
            : 0;

    const visibleEdges = useMemo(() => {
        return allEdges.filter((edge) => {
            const childStartTime = nodeStartTimeMap.get(edge.to) ?? 0;
            return elapsedSec >= childStartTime;
        });
    }, [allEdges, elapsedSec, nodeStartTimeMap]);

    return (
        <div className='w-full h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black'>
            <svg
                viewBox='-8 -2 16 10'
                className='w-full h-full max-w-2xl'
                style={{
                    filter: "drop-shadow(0 0 20px rgba(74, 222, 128, 0.3))",
                }}>
                {/* エッジ（線） */}
                {visibleEdges.map((edge, idx) => {
                    const fromNode = allNodes.find((n) => n.id === edge.from);
                    const toNode = allNodes.find((n) => n.id === edge.to);
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
                {allNodes.map((node) => {
                    const startTime = nodeStartTimeMap.get(node.id) ?? 0;
                    const scale = Math.min(
                        1,
                        Math.max(0, (elapsedSec - startTime) / growDurationSec),
                    );

                    if (scale <= 0) {
                        return null;
                    }

                    return (
                        <circle
                            key={node.id}
                            cx={node.x}
                            cy={node.y}
                            r={node.size * 0.15 * scale}
                            fill='#4CAF50'
                            opacity={0.55 + scale * 0.35}
                            style={{
                                filter: "drop-shadow(0 0 4px rgba(76, 175, 80, 0.8))",
                            }}
                        />
                    );
                })}
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
