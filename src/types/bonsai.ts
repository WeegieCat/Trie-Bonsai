export interface TrieNode {
    char: string | null;
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    id: string;
}

export interface GraphNode {
    id: string;
    x: number;
    y: number;
    z: number;
    size: number;
}

export interface GraphEdge {
    from: string;
    to: string;
}

export interface BonsaiData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}
