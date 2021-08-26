'use strict';

const Gpio = require("onoff").Gpio;

class GPIO {
  constructor() {
    this._btn = {
      "room-1": new Gpio(11, "in", "rising", { debounceTimeout: 10 }),
      "room-2": new Gpio(9, "in", "rising", { debounceTimeout: 10 }),
      "room-3": new Gpio(17, "in", "rising", { debounceTimeout: 10 }),
      "room-4": new Gpio(27, "in", "rising", { debounceTimeout: 10 }),
      "room-5": new Gpio(18, "in", "rising", { debounceTimeout: 10 }),
      "room-6": new Gpio(10, "in", "rising", { debounceTimeout: 10 }),
    }

    this._sens = new Gpio(2, "in", "both");

    this.accessible = Gpio.accessible;
  }

  button(room) {
    const btn = this._btn[room];
    return btn;
  }
}

module.exports = {
  GPIO
}