export function CheckUndefined(x: any, errMsg: string) {
    if (x == undefined)
        throw errMsg;
}