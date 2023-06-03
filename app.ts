import Homey from 'homey';
import vanmoof from './lib/vanmoofweb';

class VanMoof extends Homey.App {
  private vanmoof: vanmoof = new vanmoof(this);
  /**
   * onInit is called when the app is initialized.
   */
  async onInit () {
    this.log('VanMoof has been initialized');
  }
}

module.exports = VanMoof;