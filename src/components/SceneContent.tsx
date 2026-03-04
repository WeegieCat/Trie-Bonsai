"use client";

import { OrbitControls, PerspectiveCamera, Line } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Color } from "three";
import { useStore } from "@/store/store";

const NODE_GRADIENT_PRESETS = {
    dustyGrass: ["#d4fc79", "#96e6a1"],
    newLife: ["#43e97b", "#38f9d7"],
    blessing: ["#fddb92", "#d1fdff"],
    lemonGate: ["#96fbc4", "#f9f586"],
    oldHat: ["#e4afcb", "#b8cbb8", "#e2c58b", "#c2ce9c", "#7edbdc"],
    wideMatrix: [
        "#fcc5e4",
        "#fda34b",
        "#ff7882",
        "#c8699e",
        "#7046aa",
        "#0c1db8",
        "#020f75",
    ],
    burningSpring: [
        "#4fb576",
        "#44c489",
        "#28a9ae",
        "#28a2b7",
        "#4c7788",
        "#6c4f63",
        "#432c39",
    ],
    mochiHoppe: ["#fff446", "#00f3ff", "#ff70a7"],
} as const;

function getColorFromStops(stops: readonly string[], ratio: number): string {
    if (stops.length === 0) {
        return "#4CAF50";
    }

    if (stops.length === 1) {
        return stops[0];
    }

    const clamped = Math.min(1, Math.max(0, ratio));
    const scaled = clamped * (stops.length - 1);
    const index = Math.floor(scaled);
    const t = scaled - index;

    const start = new Color(stops[index]);
    const end = new Color(stops[Math.min(index + 1, stops.length - 1)]);

    return start.lerp(end, t).getStyle();
}

export function SceneContent() {
    const config = useStore((state) => state.config);
    const bonsaiData = useStore((state) => state.bonsaiData);

    const yValues = bonsaiData?.nodes.map((node) => node.y) ?? [];
    const minY = yValues.length > 0 ? Math.min(...yValues) : 0;
    const maxY = yValues.length > 0 ? Math.max(...yValues) : 0;
    const gradientStops = NODE_GRADIENT_PRESETS[config.nodeGradientPreset];

    return (
        <>
            <PerspectiveCamera makeDefault position={[-20, 20, 30]} />
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
                    {bonsaiData.nodes.map((node) => {
                        const ratio =
                            maxY === minY ? 0 : (node.y - minY) / (maxY - minY);
                        const depthColor = getColorFromStops(
                            gradientStops,
                            ratio,
                        );

                        return (
                            <mesh
                                key={node.id}
                                position={[node.x, node.y, node.z]}
                                castShadow>
                                <sphereGeometry
                                    args={[node.size * config.nodeSize, 16, 16]}
                                />
                                <meshStandardMaterial
                                    color={depthColor}
                                    emissive={depthColor}
                                    emissiveIntensity={0.3}
                                />
                            </mesh>
                        );
                    })}
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

            <EffectComposer>
                <Bloom
                    mipmapBlur
                    intensity={0.7}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.6}
                />
            </EffectComposer>
        </>
    );
}
