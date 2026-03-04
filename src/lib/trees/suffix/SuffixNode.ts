/**
 * サフィックス木（Suffix Tree）のノードクラス
 * 
 * サフィックス木の特徴：
 * - 文字列のすべてのサフィックスを効率的に格納
 * - エッジにラベル（元文字列への参照）を持つ
 * - 文字列検索や部分文字列の検出に特化
 */
export class SuffixNode {
    /**
     * このノードに至るエッジのラベル
     * 元文字列でのインデックス [start, end) を保持
     */
    edgeStart: number;
    edgeEnd: number;

    /**
     * 子ノード（エッジラベルの最初の文字でインデックス）
     */
    children: Map<string, SuffixNode>;

    /**
     * 単語の終端を示すフラグ
     */
    isEndOfWord: boolean;

    /**
     * 3D可視化用の一意なID
     */
    id: string;

    constructor(edgeStart: number, edgeEnd: number, id: string) {
        this.edgeStart = edgeStart;
        this.edgeEnd = edgeEnd;
        this.children = new Map();
        this.isEndOfWord = false;
        this.id = id;
    }

    /**
     * ルートノードかどうかを判定
     */
    get isRoot(): boolean {
        return this.edgeStart === -1 && this.edgeEnd === -1;
    }

    /**
     * エッジラベルの長さを取得
     */
    getEdgeLabelLength(): number {
        return this.edgeEnd - this.edgeStart;
    }
}
