import { create } from "zustand";

interface BonsaiConfig {
    nodeColor: string;
    edgeColor: string;
    nodeSize: number;
    lightIntensity: number;
    backgroundColor: string;
}

interface AppState {
    inputValue: string;
    setInputValue: (value: string) => void;
    isSideMenuOpen: boolean;
    setIsSideMenuOpen: (open: boolean) => void;
    config: BonsaiConfig;
    setConfig: (config: Partial<BonsaiConfig>) => void;
    generatedBonsais: string[]; // 生成された盆栽のID
    addGeneratedBonsai: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
    inputValue: "",
    setInputValue: (value) => set({ inputValue: value }),
    isSideMenuOpen: false,
    setIsSideMenuOpen: (open) => set({ isSideMenuOpen: open }),
    config: {
        nodeColor: "#4CAF50",
        edgeColor: "#8B7355",
        nodeSize: 1,
        lightIntensity: 1,
        backgroundColor: "#1a1a1a",
    },
    setConfig: (newConfig) =>
        set((state) => ({
            config: { ...state.config, ...newConfig },
        })),
    generatedBonsais: [],
    addGeneratedBonsai: (id) =>
        set((state) => ({
            generatedBonsais: [id, ...state.generatedBonsais],
        })),
}));
