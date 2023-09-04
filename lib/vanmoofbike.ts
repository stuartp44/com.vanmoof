import vanmoofcrypto from './vanmoofcrypto';

export default class vanmoofbike {
    bikeProfile
    cryptService
    userKeyId
    encryptionKey
    logger

    constructor(bikeProfile: string, encryptionKey: string, userKeyId: number, SimpleClass: any) {
        this.bikeProfile = bikeProfile
        this.cryptService = new vanmoofcrypto(
            encryptionKey
        )
        this.userKeyId = userKeyId
        this.encryptionKey = encryptionKey
        this.logger = SimpleClass
    }

    async authenticate (bluetoothConnection: any) {
        const passcode = this.cryptService.getPasscode()
        //const nonce = await this.getSecurityChallenge(bluetoothConnection)
        //const dataToEncrypt = new Uint8Array(16)
        //const encryptedData = this.cryptService.encrypt(dataToEncrypt)
        const data = new Uint8Array([...passcode, 0, 0, 0, this.userKeyId])
        await this.writeToBike(bluetoothConnection, data, '6acc5500e6314069944db8ca7598ad50', '6acc5502e6314069944db8ca7598ad50', true)
        await this.playSound(bluetoothConnection, 0xA)
    }

    async makeEncryptedPayload(bluetoothConnection: any, data: Uint8Array): Promise<Uint8Array> {
        const nonce = await this.getSecurityChallenge(bluetoothConnection)
        const paddLength = 16 - ((nonce.length + data.length) % 16)
        const dataToEncrypt = new Uint8Array([
            ...nonce,
            ...data,
            ...new Uint8Array(paddLength),
        ])
        return this.cryptService.encrypt(dataToEncrypt)
    }
    
    async readFromBike (bluetoothConnection: any, service: string, characteristic: string): Promise<Uint8Array> {
        const genericAccessService = await bluetoothConnection.getService(service);
        const data = await genericAccessService.read(characteristic);
        const uint8Array = new Uint8Array(data);
        console.log(`Read ${uint8Array} from ${service} - ${characteristic}`)
        return uint8Array;
    }

    async writeToBike (bluetoothConnection: any, payload: any, service: string, characteristic: string, writeWithoutEncryption: boolean = false) {
        const genericAccessService = await bluetoothConnection.getService(service);
        if (!writeWithoutEncryption) {
            const data = await this.makeEncryptedPayload(bluetoothConnection, payload)
            await genericAccessService.write(characteristic, data);
            console.log(`Wrote ${data} to ${service} - ${characteristic}`)
        } else {
            await genericAccessService.write(characteristic, payload);
            console.log(`Wrote ${payload} to ${service} - ${characteristic}`)
        }
    }

    async playSound (bluetoothConnection: any, id: number) {
        console.log(`Playing sound ${id}`)
        await this.writeToBike(bluetoothConnection, new Uint8Array([id, 0x1]), '6acc5570e6314069944db8ca7598ad50', '6acc5571e6314069944db8ca7598ad50')
    }

    async getSecurityChallenge (bluetoothConnection: any): Promise<Uint8Array> {
        const nonce = await this.readFromBike(bluetoothConnection, '6acc5500e6314069944db8ca7598ad50', '6acc5501e6314069944db8ca7598ad50');
        return nonce;
    }

    async getMotorBatteryLevel (bluetoothConnection: any) {
        const motorBattery = await this.readFromBike(bluetoothConnection, '6acc5540e6314069944db8ca7598ad50', '6acc5541e6314069944db8ca7598ad50');
        return motorBattery;
    }

    async getModuleBatteryLevel (bluetoothConnection: any) {
        const moduleBattery = await this.readFromBike(bluetoothConnection, '6acc5540e6314069944db8ca7598ad50', '6acc5543e6314069944db8ca7598ad50');
        return moduleBattery;
    }

    async getFirmwareVersion (bluetoothConnection: any) {
        const firmwareVersion = await this.readFromBike(bluetoothConnection, '6acc5540e6314069944db8ca7598ad50', '6acc554ae6314069944db8ca7598ad50');
        return firmwareVersion;
    }
}