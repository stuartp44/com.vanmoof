export = ZwaveNode;
/**
 * This class is a representation of a Z-Wave Device in Homey.
 * This class must not be initiated by the developer, but retrieved by calling {@link ManagerZwave#getNode}.
 * @property {boolean} online - If the node is online
 * @property {object} CommandClass - An object with {@link ZwaveCommandClass} instances
 */
declare class ZwaveNode extends SimpleClass {
    online: any;
    /** @type {Object<string, ZwaveCommandClass>} */
    CommandClass: {
        [x: string]: ZwaveCommandClass;
    };
    /** @type {Object<string, ZwaveNode>} */
    MultiChannelNodes: {
        [x: string]: ZwaveNode;
    };
    /**
     * This method can be used to send a raw command to a node.
     * @param {object} command
     * @param {number} command.commandClassId The command class identified
     * @param {number} command.commandId The command identified
     * @param {Buffer=} command.params The command data as a buffer
     * @returns {Promise<void>}
     */
    sendCommand({ commandClassId, commandId, params }: {
        commandClassId: number;
        commandId: number;
        params?: Buffer | undefined;
    }): Promise<void>;
    /**
     * This event is fired when a battery node changed it's online or offline status.
     * @property {boolean} online - If the node is online
     * @event ZwaveNode#online
     */
    /**
     * This event is fired when a Node Information Frame (NIF) has been sent.
     * @property {Buffer} nif
     * @event ZwaveNode#nif
     */
    /**
     * This event is fired when a a Node has received an unknown command, usually due to a missing Command Class.
     * @property {Buffer} data
     * @event ZwaveNode#unknownReport
     */
}
import SimpleClass = require("./SimpleClass.js");
import ZwaveCommandClass = require("./ZwaveCommandClass.js");
