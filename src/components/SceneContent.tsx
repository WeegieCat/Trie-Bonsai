"use client";

import { OrbitControls, PerspectiveCamera, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, Color, Float32BufferAttribute, Points } from "three";
import { useStore } from "@/store/store";
import type { BonsaiData, GraphEdge, GraphNode } from "@/types/bonsai";

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

function getRevealOrder(data: BonsaiData): GraphNode[] {
    if (data.nodes.length === 0) {
        return [];
    }

    const nodeMap = new Map(data.nodes.map((node) => [node.id, node]));
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    data.nodes.forEach((node) => {
        inDegree.set(node.id, 0);
        adjacency.set(node.id, []);
    });

    data.edges.forEach((edge) => {
        adjacency.get(edge.from)?.push(edge.to);
        inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
    });

    const roots = data.nodes
        .filter((node) => (inDegree.get(node.id) ?? 0) === 0)
        .sort((a, b) => a.y - b.y || a.id.localeCompare(b.id));

    const visited = new Set<string>();
    const queue = roots.map((root) => root.id);
    const orderedIds: string[] = [];

    while (queue.length > 0) {
        const currentId = queue.shift();

        if (!currentId || visited.has(currentId)) {
            continue;
        }

        visited.add(currentId);
        orderedIds.push(currentId);

        const children = (adjacency.get(currentId) ?? [])
            .map((childId) => nodeMap.get(childId))
            .filter((node): node is GraphNode => Boolean(node))
            .sort((a, b) => a.y - b.y || a.id.localeCompare(b.id));

        children.forEach((child) => {
            if (!visited.has(child.id)) {
                queue.push(child.id);
            }
        });
    }

    data.nodes
        .slice()
        .sort((a, b) => a.y - b.y || a.id.localeCompare(b.id))
        .forEach((node) => {
            if (!visited.has(node.id)) {
                orderedIds.push(node.id);
            }
        });

    return orderedIds
        .map((id) => nodeMap.get(id))
        .filter((node): node is GraphNode => Boolean(node));
}

function getEdgeKey(edge: GraphEdge, index: number): string {
    return `${edge.from}-${edge.to}-${index}`;
}

function DawnBackground() {
    return (
        <mesh position={[0, 0, -50]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[100, 64, 64]} />
            <meshBasicMaterial
                color='#1a1a2e'
                side={1}
                depthWrite={false}
            />
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <shaderMaterial
                    vertexShader={`
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        varying vec2 vUv;
                        void main() {
                            vec3 colorTop = vec3(0.05, 0.05, 0.15);
                            vec3 colorHorizon = vec3(1.0, 0.5, 0.3);
                            vec3 colorBottom = vec3(0.1, 0.2, 0.4);
                            
                            float mixValue = smoothstep(0.3, 0.7, vUv.y);
                            vec3 color = mix(colorBottom, colorHorizon, smoothstep(0.0, 0.5, vUv.y));
                            color = mix(color, colorTop, smoothstep(0.5, 1.0, vUv.y));
                            
                            gl_FragColor = vec4(color, 1.0);
                        }
                    `}
                    side={2}
                    depthWrite={false}
                />
            </mesh>
        </mesh>
    );
}

function MovingStarsBackground() {
    const pointsRef = useRef<Points>(null);
    const velocitiesRef = useRef<Float32Array | null>(null);

    const particleCount = 300;
    const range = 80;

    const geometry = useMemo(() => {
        const geo = new BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // 初期位置をランダムに配置
            positions[i3] = (Math.random() - 0.5) * range;
            positions[i3 + 1] = (Math.random() - 0.5) * range;
            positions[i3 + 2] = (Math.random() - 0.5) * range * 0.5;

            // 各点は平行（X方向）または垂直（Y方向）のどちらかに移動
            const isHorizontal = Math.random() > 0.5;
            const speed = 0.5 + Math.random() * 1.5;

            if (isHorizontal) {
                velocities[i3] = (Math.random() > 0.5 ? 1 : -1) * speed;
                velocities[i3 + 1] = 0;
            } else {
                velocities[i3] = 0;
                velocities[i3 + 1] = (Math.random() > 0.5 ? 1 : -1) * speed;
            }
            velocities[i3 + 2] = 0;
        }

        geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
        velocitiesRef.current = velocities;

        return geo;
    }, []);

    useFrame((state, delta) => {
        if (!pointsRef.current || !velocitiesRef.current) {
            return;
        }

        const positions = pointsRef.current.geometry.attributes.position
            .array as Float32Array;
        const velocities = velocitiesRef.current;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            positions[i3] += velocities[i3] * delta;
            positions[i3 + 1] += velocities[i3 + 1] * delta;

            // 範囲外に出たら反対側にループ
            if (positions[i3] > range / 2) {
                positions[i3] = -range / 2;
            } else if (positions[i3] < -range / 2) {
                positions[i3] = range / 2;
            }

            if (positions[i3 + 1] > range / 2) {
                positions[i3 + 1] = -range / 2;
            } else if (positions[i3 + 1] < -range / 2) {
                positions[i3 + 1] = range / 2;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                color='white'
                size={0.15}
                sizeAttenuation={true}
                transparent={true}
                opacity={0.6}
            />
        </points>
    );
}

export function SceneContent() {
    const config = useStore((state) => state.config);
    const bonsaiData = useStore((state) => state.bonsaiData);
    const [animationTime, setAnimationTime] = useState(0);
    const animationStartTimeRef = useRef<number | null>(null);

    const revealIntervalSec = 0.12;
    const growDurationSec = 0.28;

    const yValues = bonsaiData?.nodes.map((node) => node.y) ?? [];
    const minY = yValues.length > 0 ? Math.min(...yValues) : 0;
    const maxY = yValues.length > 0 ? Math.max(...yValues) : 0;
    const gradientStops = NODE_GRADIENT_PRESETS[config.nodeGradientPreset];

    const revealNodes = useMemo(
        () => (bonsaiData ? getRevealOrder(bonsaiData) : []),
        [bonsaiData],
    );

    const nodeStartTimeMap = useMemo(() => {
        const map = new Map<string, number>();
        revealNodes.forEach((node, index) => {
            map.set(node.id, index * revealIntervalSec);
        });
        return map;
    }, [revealNodes]);

    const animationEndTime =
        revealNodes.length > 0
            ? (revealNodes.length - 1) * revealIntervalSec + growDurationSec
            : 0;

    useEffect(() => {
        animationStartTimeRef.current =
            typeof performance !== "undefined" ? performance.now() : Date.now();
        setAnimationTime(0);
    }, [bonsaiData]);

    useFrame(() => {
        if (!bonsaiData || revealNodes.length === 0 || animationEndTime <= 0) {
            return;
        }

        const startTime = animationStartTimeRef.current;
        if (startTime === null) {
            return;
        }

        const now =
            typeof performance !== "undefined" ? performance.now() : Date.now();
        const elapsed = (now - startTime) / 1000;
        const clamped = Math.min(elapsed, animationEndTime);

        setAnimationTime((previous) =>
            Math.abs(previous - clamped) < 0.001 ? previous : clamped,
        );
    });

    return (
        <>
            {/* 移動する星空背景 */}
            {config.backgroundType === "stars" && <MovingStarsBackground />}
            {/* 夜明け背景 */}
            {config.backgroundType === "dawn" && <DawnBackground />}

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
                        const edgeStartTime =
                            nodeStartTimeMap.get(edge.to) ?? 0;
                        if (animationTime < edgeStartTime) {
                            return null;
                        }

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
                                key={getEdgeKey(edge, idx)}
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
                    {revealNodes.map((node) => {
                        const nodeStartTime =
                            nodeStartTimeMap.get(node.id) ?? 0;
                        const progress = Math.min(
                            1,
                            Math.max(
                                0,
                                (animationTime - nodeStartTime) /
                                    growDurationSec,
                            ),
                        );

                        if (progress <= 0) {
                            return null;
                        }

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
                                scale={[progress, progress, progress]}
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
