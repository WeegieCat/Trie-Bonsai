import type {
    BonsaiData,
    GraphEdge,
    GraphNode,
    TreeStructure,
    TreeType,
} from "@/types/bonsai";
import { Trie } from "@/lib/trees/trie/Trie";
import { PatriciaTrie } from "@/lib/trees/patricia/PatriciaTrie";

type GraphInput = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};

export function buildTrieFromInput(input: string): Trie {
    const trie = new Trie();
    const words = sanitizeInput(input);

    words.forEach((word) => {
        // オプションA：すべての接頭辞を登録
        for (let i = 1; i <= word.length; i++) {
            trie.insert(word.substring(0, i));
        }
    });

    return trie;
}

export function buildPatriciaFromInput(input: string): PatriciaTrie {
    const patricia = new PatriciaTrie();
    const words = sanitizeInput(input);

    words.forEach((word) => {
        // パトリシア木の場合：すべての接頭辞を登録
        // （トライ木と同様、段階的な成長を3D可視化で表現するため）
        for (let i = 1; i <= word.length; i++) {
            patricia.insert(word.substring(0, i));
        }
    });

    return patricia;
}

/**
 * 指定された木タイプで、入力文字列から木を構築する
 * @param type 木のタイプ ('trie' | 'patricia' | 'suffix')
 * @param input 入力文字列
 * @returns 構築された木構造
 */
export function buildTreeFromInput(
    type: TreeType,
    input: string,
): TreeStructure {
    switch (type) {
        case "trie":
            return buildTrieFromInput(input);
        case "patricia":
            return buildPatriciaFromInput(input);
        case "suffix":
            // サフィックス木はPhase 2で実装予定
            throw new Error("サフィックス木はまだ実装されていません");
        default:
            const _exhaustive: never = type;
            return _exhaustive;
    }
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
