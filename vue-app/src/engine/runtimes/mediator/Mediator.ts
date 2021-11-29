
import buildLogger from '@/engine/Logger';

let Logger = buildLogger("M ", "purple");

let genID = () => Math.abs(((1 + Math.random() * 0xFFFFFFFF) | 0)).toString(16);

export interface IOptions {
    calls?: number;
    predicate?: (options: IOptions) => boolean;
    context?: any;
}

export class Subscriber {
    id: string;

    constructor(public channel: string, public fn: Function) {
        this.id = genID();
    }

    call(message: any) {
        this.fn([message]);
    }

    debug() {
        Logger.trace(this.fn.toString());
    }
}

class Channel {
    _subscribers: Map<string, Subscriber> = new Map();;

    constructor(public name: string) { }

    remove(subscriber: Subscriber) {
        this._subscribers.delete(subscriber.id);
    }

    subscribe(fn: Function) {
        let subscriber = new Subscriber(this.name, fn);
        this._subscribers.set(subscriber.id, subscriber);
        return subscriber;
    }

    publish(message: any) {
        let subs = Array.from(this._subscribers.values());
        this
        for (var s of subs) {
            try {
                s.call(message);
            } catch (ex) {
                Logger.error(`${this.name} Error Execute`, ex, message);
            }
        }
    }
}

export class Mediator {
    Channels: Map<string, Channel> = new Map();

    removeChannel(channelName: string) {
        let channel = this.Channels.get(channelName);
        if (channel) {
            this.Channels.delete(channelName);
        }
    }

    subscribe(channelName: string, fn: Function): Subscriber {
        let channel = this.Channels.get(channelName);
        if (!channel) {
            channel = new Channel(channelName);
            this.Channels.set(channelName, channel);
        }

        let subscriber = channel.subscribe(fn);
        return subscriber;
    }

    unsubscribe(subscriber: Subscriber) {
        let channel = this.Channels.get(subscriber.channel);
        if (channel) {
            channel.remove(subscriber);
            if (channel._subscribers.size == 0) {
                this.Channels.delete(channel.name);
            }
        }
        else {
            Logger.warn(`mediator sub not found for unsubscribe`, subscriber);
        }
    }

    publish(channelName: string, message?: any) {
        let channel = this.Channels.get(channelName);
        if (!channel) {
            // Logger.warn(`channel "${channelName}" not found`, message);
            // throw `channel "${channelName}" not found`;
            Logger.warn("mediator:publish", { info: "channel not found", data: channelName });
        }
        else {
            let newChannelName = channelName;
            let last = newChannelName.length;
            do {
                newChannelName = newChannelName.substring(0, last);
                last = newChannelName.lastIndexOf(":");
                let channel = this.Channels.get(newChannelName);
                if (channel) {
                    channel.publish(message);
                    if (channel._subscribers.size == 0) {
                        this.removeChannel(channel.name);
                    }
                }
            } while (last != -1)
        }
    }

    debug_subscription() {
        for (let [n, channel] of this.Channels) {
            Logger.trace(`> ${n}`);
            channel._subscribers.forEach((s) => {
                s.debug();
            })
        }
    }
}
