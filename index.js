var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');

var instance_api   = require('./internalAPI');
var actions        = require('./actions');
var feedback       = require('./feedback');
var variables      = require('./variables');

var debug;
var log;

/**
 * Companion instance class for the Shure Wireless Microphones.
 *
 * @extends instance_skel
 * @version 1.0.0
 * @since 1.0.0
 * @author Joseph Adams <josephdadams@gmail.com>
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class instance extends instance_skel {

	/**
	 * Create an instance of a shure WX module.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config);

		this.model       = {};
		this.deviceName  = '';
		this.initDone    = false;

		Object.assign(this, {
			...actions,
			...feedback,
			...variables
		});

		this.api   = new instance_api(this);

		this.CONFIG_MODEL = {
			mxa310: {
				id: 'mxa310',
				family: 'mxa',
				type: 'mixer',
				label: 'MXA310 Table Array Microphone',
				channels: {
					1: { id: '1', label: 'Microphone 1',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: false, comp: false, delay: false },
					2: { id: '2', label: 'Microphone 2',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: false, comp: false, delay: false },
					3: { id: '3', label: 'Microphone 3',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: false, comp: false, delay: false },
					4: { id: '4', label: 'Microphone 4',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: false, comp: false, delay: false },
					5: { id: '5', label: 'Automixer Output', type: 'automix', port: 'automix', peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false }
				}
			},
			mxa910: {
				id: 'mxa910',
				family: 'mxa',
				type: 'mixer',
				label: 'MXA910 Ceiling Array Microphone',
				channels: {
					1: { id: '1', label: 'Microphone 1',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					2: { id: '2', label: 'Microphone 2',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					3: { id: '3', label: 'Microphone 3',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					4: { id: '4', label: 'Microphone 4',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					5: { id: '5', label: 'Microphone 5',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					6: { id: '6', label: 'Microphone 6',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					7: { id: '7', label: 'Microphone 7',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					8: { id: '8', label: 'Microphone 8',     type: 'input',   port: 'mic',     peq: 4, automix: true,  aec: false, nr: false, agc: true,  comp: false, delay: false },
					9: { id: '9', label: 'Automixer Output', type: 'automix', port: 'automix', peq: 4, automix: false, aec: true,  nr: false, agc: false, comp: true,  delay: true  }
				}
			},
			p300: {
				id:     'p300',
				family: 'imx',
				label:  'IntelliMix P300 Processor',
				type:   'matrix',
				channels: {
					1:  { id: '1',  label: 'Dante Input 1',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					2:  { id: '2',  label: 'Dante Input 2',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					3:  { id: '3',  label: 'Dante Input 3',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					4:  { id: '4',  label: 'Dante Input 4',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					5:  { id: '5',  label: 'Dante Input 5',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					6:  { id: '6',  label: 'Dante Input 6',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					7:  { id: '7',  label: 'Dante Input 7',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					8:  { id: '8',  label: 'Dante Input 8',    type: 'input',   port: 'dante',   peq: 4, automix: true,  aec: true,  nr: true,  agc: true,  comp: false, delay: false },
					9:  { id: '9',  label: 'Dante Input 9',    type: 'input',   port: 'dante',   peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					10: { id: '10', label: 'Dante Input 10',   type: 'input',   port: 'dante',   peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					11: { id: '11', label: 'Analog Input 1',   type: 'input',   port: 'analog',  peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					12: { id: '12', label: 'Analog Input 2',   type: 'input',   port: 'analog',  peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					13: { id: '13', label: 'USB Input',        type: 'input',   port: 'usb',     peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					14: { id: '14', label: 'Mobile Input',     type: 'input',   port: 'mobile',  peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					15: { id: '15', label: 'Dante Output 1',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					16: { id: '16', label: 'Dante Output 2',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					17: { id: '17', label: 'Analog Output 1',  type: 'output',  port: 'analog',  peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: true  },
					18: { id: '18', label: 'Analog Output 2',  type: 'output',  port: 'analog',  peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: true  },
					19: { id: '19', label: 'USB Output',       type: 'output',  port: 'usb',     peq: 2, automix: false, aec: false, nr: false, agc: false, comp: false, delay: true  },
					20: { id: '20', label: 'Mobile Output',    type: 'output',  port: 'mobile',  peq: 0, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					21: { id: '21', label: 'Automixer Output', type: 'automix', port: 'automix', peq: 0, automix: false, aec: false, nr: false, agc: false, comp: true,  delay: false },
					23: { id: '23', label: 'Dante Output 3',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					24: { id: '24', label: 'Dante Output 4',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					25: { id: '25', label: 'Dante Output 5',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					26: { id: '26', label: 'Dante Output 6',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					27: { id: '27', label: 'Dante Output 7',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false },
					28: { id: '28', label: 'Dante Output 8',   type: 'output',  port: 'dante',   peq: 4, automix: false, aec: false, nr: false, agc: false, comp: false, delay: false }
				}
			}
		};

		this.CHOICES_CHANNELS = [];

		this.CHOICES_MODEL = Object.values(this.CONFIG_MODEL);
		// Sort alphabetical
		this.CHOICES_MODEL.sort(function(a, b){
			var x = a.label.toLowerCase();
			var y = b.label.toLowerCase();
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;
		});

		this.CHOICES_MUTE = [
			{id: 'ON', label: 'Mute'},
			{id: 'OFF', label: 'Unmute'},
			{id: 'TOGGLE', label: 'Toggle Mute/Unmute'}
		];

		this.CHOICES_ONOFF = [
			{id: 'OFF', label: 'Off'},
			{id: 'ON', label: 'On'}
		];

		this.CHOICES_ONOFFTOGGLE = [
			{id: 'OFF', label: 'Off'},
			{id: 'ON', label: 'On'},
			{id: 'TOGGLE', label: 'Toggle'}
		];

		this.CHOICES_LEDCOLORS = [
			{id: 'RED',         label: 'Red'},
			{id: 'PINK',        label: 'Pink'},
			{id: 'ORANGE',      label: 'Orange'},
			{id: 'YELLOW',      label: 'Yellow'},
			{id: 'YELLOWGREEN', label: 'Yellow-Green'},
			{id: 'GREEN',       label: 'Green'},
			{id: 'TURQUOISE',   label: 'Turquoise'},
			{id: 'POWDERBLUE',  label: 'Powder Blue'},
			{id: 'CYAN',        label: 'Cyan'},
			{id: 'SKYBLUE',     label: 'Sky Blue'},
			{id: 'BLUE',        label: 'Blue'},
			{id: 'LIGHTPURPLE', label: 'LIGHTPURPLE'},
			{id: 'PURPLE',      label: 'PURPLE'},
			{id: 'VIOLET',      label: 'VIOLET'},
			{id: 'ORCHID',      label: 'ORCHID'},
			{id: 'WHITE',       label: 'WHITE'},
			{id: 'GOLD',        label: 'GOLD'}
		];

		if (this.config.modelID !== undefined){
			this.model = this.CONFIG_MODEL[this.config.modelID];
		}
		else {
			this.config.modelID = 'p300';
			this.model = this.CONFIG_MODEL['p300'];
		}

		this.defineConst('REGEX_CHAR_8',  '/^\\d+{1,8}$/');
		this.defineConst('REGEX_CHAR_31', '/^\\d+{1,31}$/');

		this.actions(); // export actions
	}

	/**
	 * Setup the actions.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @access public
	 * @since 1.0.0
	 */
	actions(system) {

		this.setupChannelChoices();
		this.setActions(this.getActions());
	}

	/**
	 * Executes the provided action.
	 *
	 * @param {Object} action - the action to be executed
	 * @access public
	 * @since 1.0.0
	 */
	action(action) {
		var options = action.options;
		var cmd;

		switch (action.action) {
			case 'set_channel_name':
				cmd = 'SET ' + options.channel + ' CHAN_NAME {' + options.name.substr(0,8) + '}';
				break;
			case 'channel_mute':
				cmd = 'SET ' + options.channel + ' AUDIO_MUTE ' + options.choice;
				break;
			case 'channel_setaudiogain':
				let value = options.gain;
				if (this.model.family == 'mxw') {
					value += 25;
				}
				else {
					value += 18;
				}
				cmd = 'SET ' + options.channel + ' AUDIO_GAIN ' + value;
				break;
			case 'channel_increasegain':
				cmd = 'SET ' + options.channel + ' AUDIO_GAIN INC ' + options.gain;
				break;
			case 'channel_decreasegain':
				cmd = 'SET ' + options.channel + ' AUDIO_GAIN DEC ' + options.gain;
				break;
			case 'flash_lights':
				cmd = 'SET FLASH ' + options.onoff;
				break;
			case 'flash_channel':
				cmd = 'SET ' + options.channel + ' FLASH ON';
				break;
			case 'slot_rf_output':
				let slot = options.slot.split(':');
				cmd = 'SET ' + slot[0] + ' SLOT_RF_OUTPUT ' + slot[1] + ' ' + options.onoff;
				break;
		}

		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.connected) {
				this.socket.send('< ' + cmd + ' >');
			} else {
				debug('Socket not connected :(');
			}
		}
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	config_fields() {

		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				default: 2202,
				width: 2,
				regex: this.REGEX_PORT
			},
			{
				type: 'dropdown',
				id: 'modelID',
				label: 'Model Type',
				choices: this.CHOICES_MODEL,
				width: 6,
				default: 'p300'
			},
			{
				type: 'checkbox',
				id: 'meteringOn',
				label: 'Enable Metering?',
				width: 2,
				default: false
			},
			{
				type: 'number',
				id: 'meteringInterval',
				label: 'Metering Interval (in ms)',
				width: 4,
				min: 1000,
				max: 99999,
				default: 5000,
				required: true
			}
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy();
		}

		this.debug("destroy", this.id);
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	init() {
		debug = this.debug;
		log = this.log;

		this.status(this.STATUS_OK);

		this.initVariables();
		this.initFeedbacks();

		this.initTCP();
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initTCP() {
		var receivebuffer = '';

		if (this.socket !== undefined) {
			this.socket.destroy();
			delete this.socket;
		}

		if (this.config.port === undefined) {
			this.config.port = 2202;
		}

		if (this.config.host) {
			this.socket = new tcp(this.config.host, this.config.port);

			this.socket.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.socket.on('error', (err) => {
				this.debug("Network error", err);
				this.log('error',"Network error: " + err.message);
			});

			this.socket.on('connect', () => {
				this.debug("Connected");
				let cmd = '< GET 0 ALL >';
				this.socket.send(cmd);

				if (this.config.meteringOn === true) {
					cmd = '< SET METER_RATE ' + this.config.meteringInterval + ' >';
					this.socket.send(cmd);
				}

				this.actions(); // export actions
			});

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				var i = 0, line = '', offset = 0;
				receivebuffer += chunk;

				while ( (i = receivebuffer.indexOf('>', offset)) !== -1) {
					line = receivebuffer.substr(offset, i - offset);
					offset = i + 1;
					this.socket.emit('receiveline', line.toString());
				}

				receivebuffer = receivebuffer.substr(offset);
			});

			this.socket.on('receiveline', (line) => {
				this.processShureCommand(line.replace('< ','').trim());
			});
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 *
	 * @param {string} command - the command/data type being passed
	 * @access protected
	 * @since 1.0.0
	 */
	processShureCommand(command) {

		if ( ( typeof command === 'string' || command instanceof String ) && command.length > 0 ) {

			let commandArr = command.split(' ');
			let commandType = commandArr.shift();
			let commandNum = parseInt( commandArr[0] );

			if (commandType == 'REP') {
				//this is a report command

				if ( isNaN(commandNum) ) {
					//this command isn't about a specific channel
					this.api.updateDevice(commandArr[0], commandArr[1]);
				}
				else {
					//this command is about a specific channel
					this.api.updateChannel(commandNum, commandArr[1], commandArr[2]);
				}
			}
			else if (commandType == 'SAMPLE') {
				//this is a sample command

				switch(this.model.family) {
					case 'ulx':
					case 'qlx':
						this.api.parseULXSample(commandNum, command);
						break;
					case 'ad':
						this.api.parseADSample(commandNum, command);
						break;
					case 'mxw':
						this.api.parseMXWSample(commandNum, command);
						break;
				}
			}
		}
	}

	/**
	 * INTERNAL: use model data to define the channel and slot choicess.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	setupChannelChoices() {

		this.CHOICES_CHANNELS = [];

		for (var i = 1; i <= this.model.channels; i++) {
			this.CHOICES_CHANNELS.push({ id: i, label: this.api.getChannel(i).name });
		}
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	updateConfig(config) {
		var resetConnection = false;
		var cmd;

		if (this.config.host != config.host)
		{
			resetConnection = true;
		}

		if (this.config.meteringOn !== config.meteringOn) {

			if (config.meteringOn === true) {
				cmd = '< SET 0 METER_RATE ' + this.config.meteringInterval + ' >';
			}
			else {
				cmd = '< SET 0 METER_RATE 0 >';
			}
		}
		else if (this.config.meteringRate != config.meteringRate && this.config.meteringOn === true) {
			cmd = '< SET 0 METER_RATE ' + config.meteringInterval + ' >';
		}

		this.config = config;

		if (this.CONFIG_MODEL[this.config.modelID] !== undefined) {
			this.model = this.CONFIG_MODEL[this.config.modelID];
		}
		else {
			this.debug('Shure Model: ' + this.config.modelID + 'NOT FOUND');
		}

		this.actions();
		this.initFeedbacks();
		this.initVariables();

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP();
		}
		else if (cmd !== undefined) {
			this.socket.send(cmd);
		}
	}
}

exports = module.exports = instance;