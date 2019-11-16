import * as $ from "jquery";

export async function getSpriteJson(): Promise<any> {
    const json = await new Promise<any>((resolve) =>
        $.get("./Resource/Sprite/boardSprite.json", (data: string) => resolve(
            JSON.parse(data)
        ))
    );
    return json;
}