import type { BonsaiData, GraphEdge, GraphNode } from "@/types/bonsai";
import { Trie } from "@/lib/trie/Trie";

type GraphInput = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};

export function buildTrieFromInput(input: string): Trie {
    const trie = new Trie();
    const words = sanitizeInput(input);

    words.forEach((word) => {
        // 単一文字列でも分岐が生まれるよう、すべての接尾辞を登録
        const suffixes = collectSuffixes(word);
        suffixes.forEach((suffix) => {
            trie.insert(suffix);
        });
    });

    return trie;
}

export function graphToNodes(graph: GraphInput): BonsaiData {
    if (graph.nodes.length === 0) {
        return { nodes: [], edges: graph.edges };
    }

    const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    graph.nodes.forEach((node) => {
        inDegree.set(node.id, 0);
        adjacency.set(node.id, []);
    });

    graph.edges.forEach((edge) => {
        adjacency.get(edge.from)?.push(edge.to);
        inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
    });

    const rootId =
        graph.nodes.find((node) => (inDegree.get(node.id) ?? 0) === 0)?.id ??
        graph.nodes[0].id;

    const depthMap = new Map<string, number>([[rootId, 0]]);
    const queue: string[] = [rootId];

    while (queue.length > 0) {
        const currentId = queue.shift();

        if (!currentId) {
            continue;
        }

        const currentDepth = depthMap.get(currentId) ?? 0;
        const children = adjacency.get(currentId) ?? [];

        children.forEach((childId) => {
            if (!depthMap.has(childId)) {
                depthMap.set(childId, currentDepth + 1);
                queue.push(childId);
            }
        });
    }

    const nodesByDepth = new Map<number, GraphNode[]>();

    graph.nodes.forEach((node) => {
        const depth = depthMap.get(node.id) ?? 0;
        const list = nodesByDepth.get(depth) ?? [];
        list.push(node);
        nodesByDepth.set(depth, list);
    });

    const positionedNodes: GraphNode[] = [];
    const sortedDepths = Array.from(nodesByDepth.keys()).sort((a, b) => a - b);

    sortedDepths.forEach((depth) => {
        const depthNodes = nodesByDepth.get(depth) ?? [];
        const baseRadius = depth === 0 ? 0 : depth * 2.2;

        depthNodes.forEach((node, index) => {
            if (depth === 0) {
                positionedNodes.push({
                    id: node.id,
                    x: 0,
                    y: 0,
                    z: 0,
                    size: node.size,
                });
                return;
            }

            const randomOffset = (Math.random() - 0.5) * 0.9;
            const angle =
                (index / Math.max(depthNodes.length, 1)) * Math.PI * 2 +
                randomOffset;
            const radius = baseRadius + Math.random() * 1.2;

            positionedNodes.push({
                id: node.id,
                x: Math.cos(angle) * radius,
                y: depth * 2,
                z: Math.sin(angle) * radius,
                size: node.size,
            });
        });
    });

    return {
        nodes: positionedNodes,
        edges: graph.edges.filter(
            (edge) => nodeMap.has(edge.from) && nodeMap.has(edge.to),
        ),
    };
}

function sanitizeInput(input: string): string[] {
    return input
        .trim()
        .split(/\s+/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
}

function collectSuffixes(word: string): string[] {
    const suffixSet = new Set<string>();

    for (let i = 0; i < word.length; i++) {
        suffixSet.add(word.substring(i));
    }

    return Array.from(suffixSet);
}
