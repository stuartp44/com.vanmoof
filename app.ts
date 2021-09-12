import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import Homey from 'homey';

class VanMoof extends Homey.App {
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('VanMoof has been initialized');
  }
}

module.exports = VanMoof;