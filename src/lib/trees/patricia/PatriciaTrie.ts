import type { GraphEdge, GraphNode, TreeStructure } from "@/types/bonsai";
import { PatriciaNode } from "./PatriciaNode";

type QueueItem = {
    node: PatriciaNode;
    depth: number;
    x: number;
    z: number;
};

/**
 * パトリシア木（PATRICIA Trie / Radix Tree）クラス
 *
 * 通常のトライ木との違い：
 * - エッジに文字列ラベルを持つ
 * - 分岐のないパスを圧縮してメモリ効率を向上
 * - ノード数が少ないため、大規模な辞書に適している
 */
export class PatriciaTrie implements TreeStructure {
    root: PatriciaNode;
    private nextNodeId: number;

    constructor() {
        this.nextNodeId = 0;
        this.root = new PatriciaNode("", this.createNodeId());
    }

    /**
     * 単語をパトリシア木に挿入
     * 最長共通接頭辞を見つけ、必要に応じてノードを分割
     */
    insert(word: string): void {
        if (!word) {
            return;
        }

        this.insertRecursive(this.root, word);
    }

    private insertRecursive(node: PatriciaNode, word: string): void {
        // 挿入する文字列が空の場合は、現在のノードを終端とする
        if (word.length === 0) {
            node.isEndOfWord = true;
            return;
        }

        const firstChar = word[0];
        const existingChild = node.children.get(firstChar);

        // 該当する子ノードが存在しない場合、新しいノードを作成
        if (!existingChild) {
            const newNode = new PatriciaNode(word, this.createNodeId());
            newNode.isEndOfWord = true;
            node.children.set(firstChar, newNode);
            return;
        }

        // 既存の子ノードのエッジラベルと、挿入する単語の最長共通接頭辞を計算
        const edgeLabel = existingChild.edgeLabel;
        const commonPrefixLength = this.getCommonPrefixLength(edgeLabel, word);

        // 完全一致の場合
        if (
            commonPrefixLength === edgeLabel.length &&
            commonPrefixLength === word.length
        ) {
            existingChild.isEndOfWord = true;
            return;
        }

        // エッジラベルの一部が一致する場合
        if (commonPrefixLength === edgeLabel.length) {
            // エッジラベルが完全に一致、残りの単語で再帰的に挿入
            this.insertRecursive(
                existingChild,
                word.substring(commonPrefixLength),
            );
            return;
        }

        // エッジラベルと単語が部分的に一致 → ノードを分割する必要がある
        this.splitNode(
            node,
            existingChild,
            firstChar,
            commonPrefixLength,
            word,
        );
    }

    /**
     * ノードを分割して共通接頭辞を持つ新しい中間ノードを作成
     */
    private splitNode(
        parent: PatriciaNode,
        child: PatriciaNode,
        firstChar: string,
        commonPrefixLength: number,
        newWord: string,
    ): void {
        const commonPrefix = child.edgeLabel.substring(0, commonPrefixLength);
        const childRemainder = child.edgeLabel.substring(commonPrefixLength);
        const newWordRemainder = newWord.substring(commonPrefixLength);

        // 共通接頭辞を持つ新しい中間ノードを作成
        const splitNode = new PatriciaNode(commonPrefix, this.createNodeId());

        // 元の子ノードのエッジラベルを残りの部分に更新
        child.edgeLabel = childRemainder;

        // 中間ノードの子として元のノードを追加
        splitNode.children.set(childRemainder[0], child);

        // 新しい単語の残りの部分を追加
        if (newWordRemainder.length === 0) {
            // 新しい単語が共通接頭辞で終わる場合
            splitNode.isEndOfWord = true;
        } else {
            // 新しい単語の残りの部分で新しいノードを作成
            const newNode = new PatriciaNode(
                newWordRemainder,
                this.createNodeId(),
            );
            newNode.isEndOfWord = true;
            splitNode.children.set(newWordRemainder[0], newNode);
        }

        // 親ノードの子を中間ノードに置き換え
        parent.children.set(firstChar, splitNode);
    }

    /**
     * 2つの文字列の最長共通接頭辞の長さを計算
     */
    private getCommonPrefixLength(str1: string, str2: string): number {
        let i = 0;
        const minLength = Math.min(str1.length, str2.length);

        while (i < minLength && str1[i] === str2[i]) {
            i++;
        }

        return i;
    }

    /**
     * 単語がパトリシア木に存在するかを検索
     */
    search(word: string): boolean {
        if (!word) {
            return false;
        }

        return this.searchRecursive(this.root, word);
    }

    private searchRecursive(node: PatriciaNode, word: string): boolean {
        // 検索する文字列が空の場合
        if (word.length === 0) {
            return node.isEndOfWord;
        }

        const firstChar = word[0];
        const child = node.children.get(firstChar);

        if (!child) {
            return false;
        }

        const edgeLabel = child.edgeLabel;

        // エッジラベルが検索文字列より長い場合
        if (edgeLabel.length > word.length) {
            return false;
        }

        // エッジラベルと検索文字列の先頭が一致するか確認
        if (!word.startsWith(edgeLabel)) {
            return false;
        }

        // エッジラベルが完全に一致した場合
        if (edgeLabel === word) {
            return child.isEndOfWord;
        }

        // 残りの文字列で再帰的に検索
        return this.searchRecursive(child, word.substring(edgeLabel.length));
    }

    /**
     * パトリシア木をグラフ構造（ノードとエッジ）に変換
     * BFS（幅優先探索）でトラバース
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

            // ノードサイズを深さに応じて変化（ルートは大きく、深くなるほど小さく）
            const nodeSize = node.isRoot
                ? 1.5
                : Math.max(1.2 - depth * 0.1, 0.6);

            // グラフノードを追加
            nodes.push({
                id: node.id,
                x,
                y: depth * 2, // 深さに応じてy座標を設定
                z,
                size: nodeSize,
            });

            // 子ノードを処理
            const children = Array.from(node.children.values());
            const childrenCount = children.length;

            children.forEach((child, index) => {
                // 放射状に配置
                const angle =
                    (index / Math.max(childrenCount, 1)) * Math.PI * 2;
                const radius = 2 + depth * 0.8;
                const childX = x + Math.cos(angle) * radius;
                const childZ = z + Math.sin(angle) * radius;

                // エッジを追加（パトリシア木ではエッジにラベルを含める）
                edges.push({
                    from: node.id,
                    to: child.id,
                    label: child.edgeLabel, // エッジラベルを含める
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
     * パトリシア木をASCIIテキストで可視化（デバッグ用）
     */
    toASCII(): string {
        const lines: string[] = [];
        this.toASCIIRecursive(this.root, "", true, lines);
        return lines.join("\n");
    }

    private toASCIIRecursive(
        node: PatriciaNode,
        prefix: string,
        isLast: boolean,
        lines: string[],
    ): void {
        // ノード表示
        const marker = node.isRoot
            ? "ROOT"
            : `"${node.edgeLabel}"${node.isEndOfWord ? " ●" : ""}`;
        const connector = node.isRoot ? "" : isLast ? "└─ " : "├─ ";
        lines.push(prefix + connector + marker);

        // 子ノードの表示
        const children = Array.from(node.children.values());
        const childCount = children.length;

        children.forEach((child, index) => {
            const isLastChild = index === childCount - 1;
            const childPrefix = node.isRoot
                ? ""
                : prefix + (isLast ? "   " : "│  ");
            this.toASCIIRecursive(child, childPrefix, isLastChild, lines);
        });
    }

    /**
     * ノードIDを生成（パトリシア木用のプレフィックス付き）
     */
    private createNodeId(): string {
        const id = `patricia-${this.nextNodeId}`;
        this.nextNodeId += 1;
        return id;
    }
}
