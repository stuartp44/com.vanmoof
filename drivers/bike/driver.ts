import { Driver } from 'homey';
import vanmoofweb from '../../lib/vanmoofweb';

class vanMoof extends Driver {
  private vanmoofweb: vanmoofweb = new vanmoofweb(this);

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('Vanmoof Driver has been initialized');
    await this.getVanmoofApiAuth();
  }

  async getVanmoofApiAuth () {
    const apiKey = 'fcb38d47-f14b-30cf-843b-26283f6a5819'
    const username = this.homey.settings.get('username');
    const password = this.homey.settings.get('password');
    const authToken = await this.vanmoofweb.getAuthToken(apiKey, username, password)
    this.homey.settings.set('authToken', authToken);
    this.homey.settings.set('apiKey', apiKey);
  }
  /**
   * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices () {
    const apiKey = this.homey.settings.get('apiKey');
    const authToken = this.homey.settings.get('authToken');
    const bikes = await this.vanmoofweb.getBikesDetails(authToken, apiKey);
    const devicesToPresent = [];

    for (const bike of bikes.data.bikeDetails) {
      devicesToPresent.push({
        name: bike.name,
        data: {
          id: bike.id,
          name: bike.name,
          frameNumber: bike.frameNumber,
          uuid: bike.macAddress.replaceAll(":", "").toLowerCase(),
        },
        store: {
          encryptionKey: bike.key.encryptionKey,
          passcode: bike.key.passcode,
          userKeyId: bike.key.userKeyId,
          bikeType: bike.modelDetails.Edition,
        }
      })
    }

    return devicesToPresent;
  }
}

module.exports = vanMoof;