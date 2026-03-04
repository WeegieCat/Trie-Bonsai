"use client";

import { Canvas } from "@react-three/fiber";
import { useStore } from "@/store/store";
import { SceneContent } from "./SceneContent";

export function BonsaiCanvas() {
    const config = useStore((state) => state.config);

    return (
        <div className='w-full h-full'>
            <Canvas
                camera={{ position: [0, 7, 18], fov: 50 }}
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
