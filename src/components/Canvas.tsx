"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useStore } from "@/store/store";

// シーンコンテンツ
function SceneContent() {
    const config = useStore((state) => state.config);

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

            {/* デモ用の球体 */}
            <mesh position={[0, 0, 0]} castShadow>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color={config.nodeColor} />
            </mesh>

            {/* 地面 */}
            <mesh position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color='#222222' />
            </mesh>
        </>
    );
}

export function BonsaiCanvas() {
    const config = useStore((state) => state.config);

    return (
        <div className='w-full h-full'>
            <Canvas
                camera={{ position: [0, 5, 8], fov: 50 }}
                style={{
                    background: config.backgroundColor,
                    width: "100%",
                    height: "100%",
                }}>
                <SceneContent />
            </Canvas>
        </div>
    );
}
