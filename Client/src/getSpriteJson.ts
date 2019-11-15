import * as $ from "jquery";

export async function getSpriteJson(): Promise<any> {
    const json = await new Promise<any>((resolve) =>
        $.get("/Json/boardSprite.json", data => resolve(
            JSON.parse(data)
        ))
    );
    return json;
}