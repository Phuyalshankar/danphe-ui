import { EventEmitter } from 'events';
import Chat from './Chat';
import type { ChatSendOptions, GroupConfig, GroupInfo, GroupMember, GroupUpdateChanges, JoinRequest, MemberRole } from './types';
/**
 * 🌊 DolphinIntercom — Group
 *
 * Group management module. Create, manage, and communicate within
 * named groups / channels. Each group has its own Chat room, member
 * roles, permissions, and an optional pinned message board.
 *
 * Usage:
 *   const group = new Group({ name: 'Engineering', createdBy: 'u1' });
 *   group.addMember('u2', 'admin');
 *   group.send('Welcome to the team!');
 */
declare const GROUP_CMD: {
    readonly CREATE: 160;
    readonly DELETE: 161;
    readonly UPDATE: 162;
    readonly ADD_MEMBER: 163;
    readonly REMOVE_MEMBER: 164;
    readonly SET_ROLE: 165;
    readonly PIN_MESSAGE: 166;
    readonly UNPIN_MESSAGE: 167;
    readonly INVITE: 168;
    readonly JOIN_REQUEST: 169;
    readonly APPROVE_JOIN: 170;
    readonly REJECT_JOIN: 171;
    readonly ARCHIVE: 172;
    readonly BROADCAST: 173;
};
declare const MEMBER_ROLE: Record<string, MemberRole>;
declare class Group extends EventEmitter {
    groupId: string;
    name: string;
    description: string;
    avatar: string | null;
    isPrivate: boolean;
    createdBy: string | null;
    createdAt: number;
    archived: boolean;
    chat: Chat;
    private _dispatch;
    private _members;
    private _pending;
    private _pins;
    constructor(config?: GroupConfig);
    create(): this;
    update(changes?: GroupUpdateChanges): this;
    archive(): this;
    delete(): this;
    addMember(userId: string, role?: MemberRole): this;
    removeMember(userId: string): this;
    setRole(userId: string, role: MemberRole): this;
    muteMember(userId: string, muted?: boolean): this;
    invite(userId: string, invitedBy?: string | null): this;
    requestJoin(userId: string): this;
    approveJoin(userId: string, role?: MemberRole): this;
    rejectJoin(userId: string, reason?: string): this;
    /** Send a text message to the group chat */
    send(text: string, opts?: ChatSendOptions): import("./Chat").Message;
    /** Broadcast announcement to all members (high-priority) */
    broadcast(text: string): this;
    pinMessage(msgId: string): this;
    unpinMessage(msgId: string): this;
    getMembers(): GroupMember[];
    getMember(userId: string): GroupMember | null;
    hasMember(userId: string): boolean;
    getMemberCount(): number;
    getPendingRequests(): JoinRequest[];
    getPinnedMessages(): string[];
    getInfo(): GroupInfo;
    private _send;
    static CMD: {
        readonly CREATE: 160;
        readonly DELETE: 161;
        readonly UPDATE: 162;
        readonly ADD_MEMBER: 163;
        readonly REMOVE_MEMBER: 164;
        readonly SET_ROLE: 165;
        readonly PIN_MESSAGE: 166;
        readonly UNPIN_MESSAGE: 167;
        readonly INVITE: 168;
        readonly JOIN_REQUEST: 169;
        readonly APPROVE_JOIN: 170;
        readonly REJECT_JOIN: 171;
        readonly ARCHIVE: 172;
        readonly BROADCAST: 173;
    };
    static ROLE: Record<string, MemberRole>;
}
export default Group;
export { Group, GROUP_CMD, MEMBER_ROLE };
//# sourceMappingURL=Group.d.ts.map