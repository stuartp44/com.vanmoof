import { Device } from 'homey';
import vanmoofbike from '../../lib/vanmoofbike';


class vanMoof extends Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit () {
    this.log('Vanmoof Bike has been initialized')
    const store = this.getStore()
    const bike = new vanmoofbike('x3', store.encryptionKey, store.userKeyId)
    this.log(bike)

    // Check if the deviceid is known (This is not the same as we get from Vanmoof)
    // const knownDeviceId = await this.detirminDeviceId()
    // if (!knownDeviceId) {
    //   this.setUnavailable('Cannot find device ID of the bike, bring closer to Homey and try again')
    // }

    // Get the Device ID
    const deviceId = this.homey.settings.get('deviceId');

    // Attempt a connection
    this.log(`Trying to connect to bike with ID ${deviceId}`)
    const bikeConnection = await this.connectToBike(deviceId)
    if (bikeConnection) {
      await bike.authenticate(bikeConnection)
      this.registerCapabilityListener("locked", async (value) => {
      this.log(value)
      if (!value) {
        await bike.playSound(bikeConnection, 0x1)
      }
      else {
        await bike.playSound(bikeConnection, 0x1)
      }
    });

      // const message = await this.vanMoofLib.readFromBike(bikeConnection, '6acc5500e6314069944db8ca7598ad50', '6acc5505e6314069944db8ca7598ad50')
      // this.log(message)
      const motorBatteryLevel = await bike.getMotorBatteryLevel(bikeConnection)
      this.log(motorBatteryLevel)
      const moduleBatteryLevel = await bike.getModuleBatteryLevel(bikeConnection)
      this.log(moduleBatteryLevel)
      const moduleFirmwareVersion = await bike.getFirmwareVersion(bikeConnection)
      this.log(moduleFirmwareVersion)
    } else {
      this.setUnavailable('Could not connect to bike')
    }
  }

  async connectToBike (deviceID: string) {
    try {
      const advertisement = await this.homey.ble.find(deviceID)
      const bikeConnection = await advertisement.connect()
      if (bikeConnection) {
        this.log('Connected to bike')
        return bikeConnection
      } else {
        this.log('Could not connect to bike')
        throw new Error('Could not connect to bike')
      }
    }
    catch (error) {
      this.log(error);
    }
  }

  async detirminDeviceId () {
    try {
      const data = this.getData()
      const settings = this.getSettings();
      const advertisements = await this.homey.ble.discover();
      const filteredAdvertisements = advertisements.filter(advertisement =>
        advertisement.localName?.endsWith(data.uuid.toUpperCase())
      );
      if (settings.deviceId === undefined) {
        if (filteredAdvertisements.length === 0) {
          this.log('No device ID found')
          return false
        } else {
          this.log(`Found device ID - ${filteredAdvertisements[0].id}`)
          this.homey.settings.set('deviceId', filteredAdvertisements[0].id);
          return true
        }
      } else {
        this.log(`Device ID already known as ${settings.deviceId}`) 
        return true
      }
    }
    catch (error) {
      this.log(error)
    }
  }
  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Vanmoof Bike has been added')
    const knownDeviceId = await this.detirminDeviceId()
    if (!knownDeviceId) {
      this.setUnavailable('Cannot find device ID of the bike, bring closer to Homey and try again')
    }
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings: {}, newSettings: {}, changedKeys: {} }): Promise<string|void> {
    this.log('Vanmoof Bike settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log('Vanmoof Bike was renamed');
  
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Vanmoof Bike has been deleted');
  }
}

module.exports = vanMoof;
