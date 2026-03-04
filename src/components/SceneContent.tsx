"use client";

import { OrbitControls, PerspectiveCamera, Line } from "@react-three/drei";
import { useStore } from "@/store/store";

export function SceneContent() {
    const config = useStore((state) => state.config);
    const bonsaiData = useStore((state) => state.bonsaiData);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 5, 8]} />
            <OrbitControls />

            {/* ライティング */}
            <ambientLight intensity={config.lightIntensity * 0.5} />
            <directionalLight
                position={[5, 10, 7]}
                intensity={config.lightIntensity}
                castShadow
            />
            <pointLight
                position={[-5, 5, 5]}
                intensity={config.lightIntensity * 0.3}
            />

            {/* 盆栽ノードのレンダリング */}
            {bonsaiData && bonsaiData.nodes.length > 0 ? (
                <>
                    {/* エッジ（線）をレンダリング */}
                    {bonsaiData.edges.map((edge, idx) => {
                        const fromNode = bonsaiData.nodes.find(
                            (n) => n.id === edge.from,
                        );
                        const toNode = bonsaiData.nodes.find(
                            (n) => n.id === edge.to,
                        );

                        if (!fromNode || !toNode) {
                            return null;
                        }

                        return (
                            <Line
                                key={`edge-${idx}`}
                                points={[
                                    [fromNode.x, fromNode.y, fromNode.z],
                                    [toNode.x, toNode.y, toNode.z],
                                ]}
                                color={config.edgeColor}
                                lineWidth={1}
                            />
                        );
                    })}

                    {/* ノード（球体）をレンダリング */}
                    {bonsaiData.nodes.map((node) => (
                        <mesh
                            key={node.id}
                            position={[node.x, node.y, node.z]}
                            castShadow>
                            <sphereGeometry
                                args={[node.size * config.nodeSize, 16, 16]}
                            />
                            <meshStandardMaterial
                                color={config.nodeColor}
                                emissive={config.nodeColor}
                                emissiveIntensity={0.3}
                            />
                        </mesh>
                    ))}
                </>
            ) : (
                <>
                    {/* デモ用の球体 */}
                    <mesh position={[0, 0, 0]} castShadow>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color={config.nodeColor} />
                    </mesh>
                </>
            )}
        </>
    );
}
