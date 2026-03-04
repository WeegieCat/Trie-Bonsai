import { create } from "zustand";
import type { BonsaiData, TreeType } from "@/types/bonsai";
import { buildTreeFromInput, graphToNodes } from "@/lib/utils/trieConverter";

interface BonsaiConfig {
    nodeColor: string;
    edgeColor: string;
    nodeSize: number;
    lightIntensity: number;
    backgroundColor: string;
    backgroundType: "stars" | "solid" | "dawn";
    nodeGradientPreset:
        | "dustyGrass"
        | "newLife"
        | "blessing"
        | "lemonGate"
        | "oldHat"
        | "wideMatrix"
        | "burningSpring"
        | "mochiHoppe";
}

interface AppState {
    inputValue: string;
    setInputValue: (value: string) => void;
    bonsaiData: BonsaiData | null;
    setBonsaiData: (data: BonsaiData) => void;
    trieText: string | null;
    setTrieText: (text: string) => void;
    treeType: TreeType;
    setTreeType: (type: TreeType) => void;
    generateBonsai: (input: string) => void;
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
    bonsaiData: null,
    setBonsaiData: (data) => set({ bonsaiData: data }),
    trieText: null,
    setTrieText: (text) => set({ trieText: text }),
    treeType: "patricia",
    setTreeType: (type) => set({ treeType: type }),
    generateBonsai: (input) => {
        set((state) => {
            try {
                const tree = buildTreeFromInput(state.treeType, input);
                const graph = tree.toGraph();
                const data = graphToNodes(graph);
                const text = tree.toASCII();

                return { bonsaiData: data, trieText: text };
            } catch (error) {
                console.error("盆栽生成エラー:", error);
                return {};
            }
        });
    },
    isSideMenuOpen: false,
    setIsSideMenuOpen: (open) => set({ isSideMenuOpen: open }),
    config: {
        nodeColor: "#4CAF50",
        edgeColor: "#8B7355",
        nodeSize: 1,
        lightIntensity: 1,
        backgroundColor: "#1a1a1a",
        backgroundType: "stars",
        nodeGradientPreset: "dustyGrass",
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
