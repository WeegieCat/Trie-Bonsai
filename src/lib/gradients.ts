export type GradientPreset =
    | "dustyGrass"
    | "newLife"
    | "blessing"
    | "lemonGate"
    | "oldHat"
    | "wideMatrix"
    | "burningSpring";

export const GRADIENT_COLORS: Record<GradientPreset, string[]> = {
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
};

// グラデーション選択ボタンの色に使う（開始色）
export function getGradientStartColor(preset: GradientPreset): string {
    return GRADIENT_COLORS[preset][0];
}
