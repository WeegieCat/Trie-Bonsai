import type {
    BonsaiData,
    GraphEdge,
    GraphNode,
    TreeStructure,
    TreeType,
} from "@/types/bonsai";
import { Trie } from "@/lib/trees/trie/Trie";
import { PatriciaTrie } from "@/lib/trees/patricia/PatriciaTrie";
import { SuffixTree } from "@/lib/trees/suffix/SuffixTree";
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
} from "d3-force-3d";

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

export function buildSuffixTreeFromInput(input: string): SuffixTree {
    const suffix = new SuffixTree();
    const words = sanitizeInput(input);

    words.forEach((word) => {
        // サフィックス木の場合：単語をそのまま挿入
        // サフィックス木自体がすべてのサフィックスを内部で管理
        suffix.insert(word);
    });

    return suffix;
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
            return buildSuffixTreeFromInput(input);
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

    // 深さ（階層）を計算
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

    // 物理演算用のノードデータを準備
    type SimNode = {
        id: string;
        x?: number;
        y?: number;
        z?: number;
        vx?: number;
        vy?: number;
        vz?: number;
        fx?: number | null;
        fy?: number | null;
        fz?: number | null;
        size: number;
        depth: number;
    };

    const simNodes: SimNode[] = graph.nodes.map((node) => ({
        id: node.id,
        x: Math.random() * 20 - 10,
        y: (depthMap.get(node.id) ?? 0) * -3,
        z: Math.random() * 20 - 10,
        size: node.size,
        depth: depthMap.get(node.id) ?? 0,
    }));

    // ルートノードを固定
    const rootNode = simNodes.find((n) => n.id === rootId);
    if (rootNode) {
        rootNode.x = 0;
        rootNode.y = -10;
        rootNode.z = 0;
        rootNode.fx = 0;
        rootNode.fy = -10;
        rootNode.fz = 0;
    }

    // エッジデータを準備
    type SimLink = {
        source: string;
        target: string;
    };

    const simLinks: SimLink[] = graph.edges.map((edge) => ({
        source: edge.from,
        target: edge.to,
    }));

    // 物理シミュレーションを実行
    const simulation = forceSimulation(simNodes)
        .force(
            "link",
            forceLink(simLinks)
                .id((d: any) => d.id)
                .distance(4)
                .strength(0.8),
        )
        .force("charge", forceManyBody().strength(-80).distanceMax(30))
        .force("center", forceCenter(0, 0, 0).strength(0.05))
        .force("y", forceY())
        .stop();

    // Y軸方向に階層を維持する力
    function forceY() {
        return function (alpha: number) {
            simNodes.forEach((node) => {
                const targetY = node.depth * -3 - 10;
                node.vy = (node.vy ?? 0) + (targetY - (node.y ?? 0)) * alpha * 0.3;
            });
        };
    }

    // シミュレーションを一定回数実行
    const iterations = 300;
    for (let i = 0; i < iterations; i++) {
        simulation.tick();
    }

    // 結果を変換
    const positionedNodes: GraphNode[] = simNodes.map((node) => ({
        id: node.id,
        x: node.x ?? 0,
        y: node.y ?? 0,
        z: node.z ?? 0,
        size: node.size,
    }));

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
