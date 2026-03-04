/**
 * 木構造の共通型定義とユーティリティ
 */

import type { TreeStructure, TreeType } from "@/types/bonsai";

/**
 * 木構造のファクトリー関数の型
 */
export type TreeBuilder = (input: string) => TreeStructure;

/**
 * 木タイプの表示名
 */
export const TREE_TYPE_LABELS: Record<TreeType, string> = {
    trie: "トライ木 (Trie)",
    patricia: "パトリシア木 (Patricia/Radix)",
    suffix: "サフィックス木 (Suffix Tree)",
};

/**
 * ノードIDのプレフィックス（木タイプごとに一意にするため）
 */
export const NODE_ID_PREFIXES: Record<TreeType, string> = {
    trie: "trie",
    patricia: "patricia",
    suffix: "suffix",
};
