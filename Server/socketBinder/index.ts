
import { Binder as _Binder } from "./binder";
import { BinderBase as _BinderBase } from "./binderBase";
import { BindManager as _BindManager, Namespace as _Namespace } from "./bindManager";
import { BinderList as _BinderList } from "./binderList";

export module SocketBinder {
    export const Binder = _Binder;
    export const BinderList = _BinderList;
    export const BindManager = _BindManager;
    export const Namespace = _Namespace;
    export type BinderBase = _BinderBase;
    export type Binder<T> = _Binder<T>;
    export type BinderList<T> = _BinderList<T>;
    export type BindManager = _BindManager;
    export type Namespace = _Namespace;

}