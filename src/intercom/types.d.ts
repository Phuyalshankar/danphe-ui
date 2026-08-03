/**
 * 🌊 DolphinIntercom — Shared Types
 */
export type DispatchFn = (buf: Buffer) => void;
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface HttpCallConfig {
    baseURL?: string;
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
}
export interface RequestConfig {
    method: HttpMethod;
    url: string;
    body?: unknown;
    headers?: Record<string, string>;
}
export interface RequestOptions {
    body?: unknown;
    headers?: Record<string, string>;
}
export interface HttpResponse {
    status: number;
    headers: Record<string, unknown>;
    data: unknown;
}
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | void | Promise<RequestConfig | void>;
export type ResponseInterceptor = (response: HttpResponse) => HttpResponse | void | Promise<HttpResponse | void>;
export interface PendingRequest {
    resolve: (value: HttpResponse) => void;
    reject: (reason?: unknown) => void;
    timer: ReturnType<typeof setTimeout>;
}
export type CallState = 'IDLE' | 'CALLING' | 'RINGING' | 'CONNECTED' | 'ON_HOLD' | 'ENDED' | 'FAILED';
export interface VideoCallConfig {
    callId?: string;
    peerId?: string;
    audio?: boolean;
    video?: boolean;
    iceServers?: unknown;
    dispatch?: DispatchFn;
}
export interface CallStats {
    startedAt: number | null;
    endedAt: number | null;
    duration: number;
}
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
export interface MessageConfig {
    id?: string;
    roomId: string;
    senderId: string;
    type?: MessageType;
    content?: unknown;
    timestamp?: number;
    metadata?: Record<string, unknown>;
}
export interface MessageJSON {
    id: string;
    roomId: string;
    senderId: string;
    type: MessageType;
    content: unknown;
    timestamp: number;
    status: MessageStatus;
    reactions: Record<string, number>;
    metadata: Record<string, unknown>;
}
export interface ChatConfig {
    userId?: string;
    roomId?: string;
    maxHistory?: number;
    dispatch?: DispatchFn;
}
export interface ChatSendOptions {
    type?: MessageType;
    metadata?: Record<string, unknown>;
}
export interface QueuedCommand {
    cmd: number;
    payload: unknown;
}
export type ParticipantRole = 'host' | 'cohost' | 'attendee' | 'presenter';
export type MeetingState = 'scheduled' | 'active' | 'ended' | 'waiting';
export interface MeetingConfig {
    meetingId?: string;
    hostId?: string;
    title?: string;
    scheduledAt?: number | null;
    maxParticipants?: number;
    waitingRoom?: boolean;
    audio?: boolean;
    video?: boolean;
    dispatch?: DispatchFn;
}
export interface JoinOptions {
    role?: ParticipantRole;
    audio?: boolean;
    video?: boolean;
    iceServers?: unknown;
}
export interface ParticipantPublicInfo {
    userId: string;
    role: ParticipantRole;
    joinedAt: number;
    handRaised: boolean;
}
export interface MeetingInfo {
    meetingId: string;
    title: string;
    state: MeetingState;
    participants: number;
    recording: boolean;
    screenShare: string | null;
    startedAt: number | null;
}
export type MemberRole = 'owner' | 'admin' | 'member' | 'readonly';
export interface GroupConfig {
    groupId?: string;
    name?: string;
    description?: string;
    avatar?: string | null;
    isPrivate?: boolean;
    createdBy?: string;
    createdAt?: number;
    dispatch?: DispatchFn;
}
export interface GroupMember {
    userId: string;
    role: MemberRole;
    joinedAt: number;
    muted: boolean;
}
export interface JoinRequest {
    userId: string;
    requestedAt: number;
}
export interface GroupUpdateChanges {
    name?: string;
    description?: string;
    avatar?: string;
    isPrivate?: boolean;
}
export interface GroupInfo {
    groupId: string;
    name: string;
    description: string;
    avatar: string | null;
    isPrivate: boolean;
    archived: boolean;
    memberCount: number;
    createdBy: string | null;
    createdAt: number;
    pinnedMessages: string[];
}
//# sourceMappingURL=types.d.ts.map