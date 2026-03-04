import type { GraphEdge, GraphNode } from "@/types/bonsai";
import { TrieNode } from "./TrieNode";

type QueueItem = {
    node: TrieNode;
    depth: number;
    x: number;
    z: number;
};

export class Trie {
    root: TrieNode;
    private nextNodeId: number;

    constructor() {
        this.nextNodeId = 0;
        this.root = new TrieNode(null, this.createNodeId());
    }

    insert(word: string): void {
        if (!word) {
            return;
        }

        let currentNode = this.root;

        for (const char of word) {
            const existingChild = currentNode.children.get(char);

            if (existingChild) {
                currentNode = existingChild;
                continue;
            }

            const newNode = new TrieNode(char, this.createNodeId());
            currentNode.children.set(char, newNode);
            currentNode = newNode;
        }

        currentNode.isEndOfWord = true;
    }

    search(word: string): boolean {
        if (!word) {
            return false;
        }

        let currentNode = this.root;

        for (const char of word) {
            const nextNode = currentNode.children.get(char);

            if (!nextNode) {
                return false;
            }

            currentNode = nextNode;
        }

        return currentNode.isEndOfWord;
    }

    toGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];

        const queue: QueueItem[] = [
            {
                node: this.root,
                depth: 0,
                x: 0,
                z: 0,
            },
        ];

        while (queue.length > 0) {
            const current = queue.shift();

            if (!current) {
                continue;
            }

            const { node, depth, x, z } = current;

            nodes.push({
                id: node.id,
                x,
                y: depth * 2,
                z,
                size: depth === 0 ? 1.5 : Math.max(0.6, 1.2 - depth * 0.1),
            });

            const children = Array.from(node.children.values());
            const radius = 2 + depth * 0.8;

            children.forEach((childNode, index) => {
                const angle =
                    (index / Math.max(children.length, 1)) * Math.PI * 2;
                const childX = x + Math.cos(angle) * radius;
                const childZ = z + Math.sin(angle) * radius;

                edges.push({
                    from: node.id,
                    to: childNode.id,
                });

                queue.push({
                    node: childNode,
                    depth: depth + 1,
                    x: childX,
                    z: childZ,
                });
            });
        }

        return { nodes, edges };
    }

    toASCII(): string {
        const lines: string[] = ["[Root]"];
        const visited = new Set<TrieNode>();

        const dfs = (node: TrieNode, prefix: string, isLast: boolean) => {
            visited.add(node);

            const children = Array.from(node.children.values());

            children.forEach((child, index) => {
                const isLastChild = index === children.length - 1;
                const connector = isLastChild ? "└─" : "├─";
                const nextPrefix = isLastChild ? "   " : "|  ";

                const endMarker = child.isEndOfWord
                    ? ` [End: ${this.extractWord(child)}]`
                    : "";
                lines.push(`${prefix}${connector} "${child.char}"${endMarker}`);

                if (!visited.has(child)) {
                    dfs(child, prefix + nextPrefix, isLastChild);
                }
            });
        };

        dfs(this.root, "", true);
        return lines.join("\n");
    }

    private extractWord(node: TrieNode): string {
        const chars: string[] = [];
        let current: TrieNode | null = node;

        while (current && current.char !== null) {
            chars.unshift(current.char);
            // 親を見つけるためにルートから探索する必要があるので、
            // ここは node.char を使って文字列を表現
            break; // シンプルな実装: 現在のノード文字のみ
        }

        // より正確な実装: ノードチェーンを辿る
        // ただし、TrieNode に親への参照がないため、別途実装が必要
        // ここは簡易版として、子から親への逆走査ができないため、名前付けを工夫
        return this.getWordFromNode(node);
    }

    private getWordFromNode(targetNode: TrieNode): string {
        const word: string[] = [];

        const findPath = (node: TrieNode): boolean => {
            if (node === targetNode) {
                if (node.char !== null) {
                    word.push(node.char);
                }
                return true;
            }

            for (const [char, child] of node.children) {
                if (findPath(child)) {
                    if (node.char !== null) {
                        word.unshift(node.char);
                    }
                    return true;
                }
            }

            return false;
        };

        findPath(this.root);
        return word.join("");
    }

    private createNodeId(): string {
        const id = `node-${this.nextNodeId}`;
        this.nextNodeId += 1;
        return id;
    }
}
