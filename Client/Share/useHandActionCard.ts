export interface UseHandActionCard {
    index: number,
    useKind: UseKind
}

//カードの使用方法
export const enum UseKind {
    Destruction,
    Use,
}