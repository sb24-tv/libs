export type PathMatcher = string | RegExp;
export type SocketCallBack<T = any> = (data: T) => void;