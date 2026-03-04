import type { TrieNode as TrieNodeShape } from "@/types/bonsai";

export class TrieNode implements TrieNodeShape {
    char: string | null;
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    id: string;

    constructor(char: string | null, id: string) {
        this.char = char;
        this.children = new Map<string, TrieNode>();
        this.isEndOfWord = false;
        this.id = id;
    }

    get isRoot(): boolean {
        return this.char === null;
    }
}
