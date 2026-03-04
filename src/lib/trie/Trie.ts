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

    private createNodeId(): string {
        const id = `node-${this.nextNodeId}`;
        this.nextNodeId += 1;
        return id;
    }
}
