
import { Binder as _Binder } from "./binder";
import { BinderBase as _BinderBase } from "./binderBase";
import { BindManager as _BindManager, Namespace as _Namespace } from "./bindManager";
import { BinderList as _BinderList } from "./binderList";
import { EmitReceiveBinder as _EmitReceiveBinder } from "./emitReceiveBinder"
import { TriggerBinder as _TriggerBinder } from "./triggerBinder";

export module SocketBinder {
    export const Binder = _Binder;
    export const BinderList = _BinderList;
    export const BindManager = _BindManager;
    export const Namespace = _Namespace;
    export const EmitReceiveBinder = _EmitReceiveBinder;
    export const TriggerBinder = _TriggerBinder;
    export type BinderBase = _BinderBase;
    export type Binder<T> = _Binder<T>;
    export type BinderList<T> = _BinderList<T>;
    export type BindManager = _BindManager;
    export type Namespace = _Namespace;
    export type EmitReceiveBinder<T> = _EmitReceiveBinder<T>;
    export type TriggerBinder<R, E> = _TriggerBinder<R, E>;
}