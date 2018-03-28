export class PasswordInfo {
    private passwordFlag: boolean;
    private password: string;
    public constructor(password: string, passwordFlag: boolean) {
        this.password = password;
        this.passwordFlag = passwordFlag;
    }

    //パスワードを入力する必要があるかどうかを返す
    public isNeedPassword() {
        return this.passwordFlag;
    }

    //入力された文字列がパスワードと一致しているかチェックする
    //passwordFlag==falseならなんでもtrue
    public passwordCheck(str: string) {
        return this.passwordFlag ? this.password == str : true;
    }
}