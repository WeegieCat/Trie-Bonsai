// ========================================
// 木のタイプ定義
// ========================================

export type TreeType = 'trie' | 'patricia' | 'suffix';

// ========================================
// ノード型定義
// ========================================

export interface TrieNode {
    char: string | null;
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    id: string;
}

// ========================================
// グラフ変換用の型定義
// ========================================

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
    label?: string; // パトリシア木・サフィックス木用のエッジラベル
}

export interface BonsaiData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

// ========================================
// 木構造の共通インターフェース
// ========================================

export interface TreeStructure {
    /**
     * 単語を木に挿入する
     */
    insert(word: string): void;

    /**
     * 単語が木に存在するかを検索する
     */
    search(word: string): boolean;

    /**
     * 木をグラフ構造（ノードとエッジ）に変換する
     */
    toGraph(): { nodes: GraphNode[]; edges: GraphEdge[] };

    /**
     * 木をASCIIテキストで可視化する（デバッグ用）
     */
    toASCII(): string;
}
