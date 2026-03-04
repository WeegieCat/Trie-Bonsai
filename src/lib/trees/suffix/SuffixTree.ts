import type { GraphEdge, GraphNode, TreeStructure } from "@/types/bonsai";
import { SuffixNode } from "./SuffixNode";

type QueueItem = {
    node: SuffixNode;
    depth: number;
    x: number;
    z: number;
};

/**
 * サフィックス木（Suffix Tree）クラス
 * 
 * 実装：ナイーブ版（すべてのサフィックスを順次挿入）
 * - 複雑性：O(n²) - 実装が簡潔だが、大規模な文字列には不向き
 * - Ukkonen's Algorithmへの最適化は将来の拡張
 * 
 * 特徴：
 * - すべてのサフィックスを保持
 * - パターン検索に特化（部分文字列検出）
 * - エッジには元文字列への位置情報を保持
 */
export class SuffixTree implements TreeStructure {
    root: SuffixNode;
    private nextNodeId: number;
    private text: string = "";

    constructor() {
        this.nextNodeId = 0;
        this.root = new SuffixNode(-1, -1, this.createNodeId());
    }

    /**
     * 単語をサフィックス木に挿入
     * すべてのサフィックスを挿入して構築
     */
    insert(word: string): void {
        if (!word) {
            return;
        }

        // テキストの長さ記録
        const startLength = this.text.length;
        this.text += word;

        // すべてのサフィックスを挿入
        for (let i = 0; i < word.length; i++) {
            const suffixStart = startLength + i;
            this.insertSuffix(suffixStart, this.text.length);
        }
    }

    /**
     * 指定されたサフィックスを挿入
     */
    private insertSuffix(suffixStart: number, textEnd: number): void {
        this.insertSuffixRecursive(this.root, suffixStart, textEnd);
    }

    private insertSuffixRecursive(
        node: SuffixNode,
        suffixStart: number,
        textEnd: number
    ): void {
        if (suffixStart >= textEnd) {
            node.isEndOfWord = true;
            return;
        }

        const firstChar = this.text[suffixStart];
        const existingChild = node.children.get(firstChar);

        if (!existingChild) {
            // 新しいノードを作成して追加
            const newNode = new SuffixNode(suffixStart, textEnd, this.createNodeId());
            newNode.isEndOfWord = true;
            node.children.set(firstChar, newNode);
            return;
        }

        // 既存ノードのエッジラベルと比較
        const edgeLabel = this.getEdgeLabel(existingChild);
        const matchLength = this.getMatchLength(suffixStart, existingChild);

        if (matchLength === edgeLabel.length) {
            // エッジラベル全体が一致 → 子ノードで続行
            this.insertSuffixRecursive(
                existingChild,
                suffixStart + matchLength,
                textEnd
            );
        } else {
            // エッジラベルの途中で分岐 → ノードを分割
            this.splitNode(node, existingChild, firstChar, matchLength, suffixStart, textEnd);
        }
    }

    /**
     * エッジラベルの文字列を取得
     */
    private getEdgeLabel(node: SuffixNode): string {
        return this.text.substring(node.edgeStart, node.edgeEnd);
    }

    /**
     * サフィックスとエッジラベルのマッチ長を取得
     */
    private getMatchLength(suffixStart: number, childNode: SuffixNode): number {
        let matchLength = 0;
        const edgeLength = childNode.getEdgeLabelLength();

        while (
            matchLength < edgeLength &&
            suffixStart + matchLength < this.text.length &&
            this.text[suffixStart + matchLength] === this.text[childNode.edgeStart + matchLength]
        ) {
            matchLength++;
        }

        return matchLength;
    }

    /**
     * ノードを分割
     */
    private splitNode(
        parent: SuffixNode,
        child: SuffixNode,
        firstChar: string,
        matchLength: number,
        suffixStart: number,
        textEnd: number
    ): void {
        const splitStart = child.edgeStart;
        const splitEnd = splitStart + matchLength;

        // 分割ノードを作成
        const splitNode = new SuffixNode(splitStart, splitEnd, this.createNodeId());

        // 元の子ノードのエッジを更新
        child.edgeStart = splitEnd;

        // 分割ノードに元の子を追加
        splitNode.children.set(this.text[splitEnd], child);

        // 新しいサフィックスノードを作成して追加
        if (suffixStart + matchLength < textEnd) {
            const newNode = new SuffixNode(
                suffixStart + matchLength,
                textEnd,
                this.createNodeId()
            );
            newNode.isEndOfWord = true;
            splitNode.children.set(this.text[suffixStart + matchLength], newNode);
        } else {
            splitNode.isEndOfWord = true;
        }

        // 親ノードの子を分割ノードに置き換え
        parent.children.set(firstChar, splitNode);
    }

    /**
     * 単語がサフィックス木に存在するかを検索
     */
    search(word: string): boolean {
        if (!word) {
            return false;
        }

        return this.searchRecursive(this.root, word, 0);
    }

    private searchRecursive(node: SuffixNode, word: string, wordIndex: number): boolean {
        if (wordIndex >= word.length) {
            return node.isEndOfWord;
        }

        const firstChar = word[wordIndex];
        const child = node.children.get(firstChar);

        if (!child) {
            return false;
        }

        // エッジラベルをマッチングしながら検索
        const edgeLabel = this.getEdgeLabel(child);
        let edgeIndex = 0;

        while (edgeIndex < edgeLabel.length && wordIndex < word.length) {
            if (edgeLabel[edgeIndex] !== word[wordIndex]) {
                return false;
            }
            edgeIndex++;
            wordIndex++;
        }

        // エッジラベルは一致したが、単語が残っている場合
        if (wordIndex < word.length) {
            return this.searchRecursive(child, word, wordIndex);
        }

        // 単語を完全にマッチ
        return edgeIndex === edgeLabel.length && child.isEndOfWord;
    }

    /**
     * サフィックス木をグラフ構造に変換
     */
    toGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];
        const queue: QueueItem[] = [];

        // ルートノードをキューに追加
        queue.push({ node: this.root, depth: 0, x: 0, z: 0 });

        while (queue.length > 0) {
            const current = queue.shift()!;
            const { node, depth, x, z } = current;

            // ノードサイズ（ルートは大きく、深くなるほど小さく）
            const nodeSize = node.isRoot ? 1.5 : Math.max(1.2 - depth * 0.1, 0.6);

            // グラフノードを追加
            nodes.push({
                id: node.id,
                x,
                y: depth * 2,
                z,
                size: nodeSize,
            });

            // 子ノードを処理
            const children = Array.from(node.children.values());
            const childrenCount = children.length;

            children.forEach((child, index) => {
                // 放射状に配置
                const angle = (index / Math.max(childrenCount, 1)) * Math.PI * 2;
                const radius = 2 + depth * 0.8;
                const childX = x + Math.cos(angle) * radius;
                const childZ = z + Math.sin(angle) * radius;

                // エッジラベルを取得
                const edgeLabel = this.getEdgeLabel(child);

                // エッジを追加
                edges.push({
                    from: node.id,
                    to: child.id,
                    label: edgeLabel,
                });

                // 子ノードをキューに追加
                queue.push({
                    node: child,
                    depth: depth + 1,
                    x: childX,
                    z: childZ,
                });
            });
        }

        return { nodes, edges };
    }

    /**
     * サフィックス木をASCIIテキストで可視化
     */
    toASCII(): string {
        const lines: string[] = [];
        this.toASCIIRecursive(this.root, "", true, lines);
        return lines.join("\n");
    }

    private toASCIIRecursive(
        node: SuffixNode,
        prefix: string,
        isLast: boolean,
        lines: string[]
    ): void {
        const edgeLabel = node.isRoot ? "ROOT" : `"${this.getEdgeLabel(node)}"${node.isEndOfWord ? " ●" : ""}`;
        const connector = node.isRoot ? "" : isLast ? "└─ " : "├─ ";
        lines.push(prefix + connector + edgeLabel);

        const children = Array.from(node.children.values());
        const childCount = children.length;

        children.forEach((child, index) => {
            const isLastChild = index === childCount - 1;
            const childPrefix = node.isRoot ? "" : prefix + (isLast ? "   " : "│  ");
            this.toASCIIRecursive(child, childPrefix, isLastChild, lines);
        });
    }

    /**
     * ノードIDを生成
     */
    private createNodeId(): string {
        const id = `suffix-${this.nextNodeId}`;
        this.nextNodeId += 1;
        return id;
    }
}
