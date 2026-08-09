var _MEDIA = {
	MediaDevices: [],
	isHTTPs: (location.protocol === 'https:'),
	canEnumerate: false,
	hasMicrophone: false,
	hasSpeakers: false,
	hasWebcam: false,
	isMicrophoneAlreadyCaptured: false,
	isWebcamAlreadyCaptured: false,
	permissionMicrophone: "",
	permissionWebcam: "",
	checkDeviceSupport: function (callback) {
		navigator.permissions.query({ name: 'camera' }).then(permissionStatus => { _MEDIA.permissionWebcam = permissionStatus.state; });
		navigator.permissions.query({ name: 'microphone' }).then(permissionStatus => { _MEDIA.permissionMicrophone = permissionStatus.state; });
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) { navigator.enumerateDevices = function (callback) { navigator.mediaDevices.enumerateDevices().then(callback); }; }
		if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) { _MEDIA.canEnumerate = true; } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) { _MEDIA.canEnumerate = true; }
		if (!_MEDIA.canEnumerate) { return; }
		if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) { navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack); }
		if (!navigator.enumerateDevices && navigator.enumerateDevices) { navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator); }
		if (!navigator.enumerateDevices) { if (callback) { callback(); }; return; }
		_MEDIA.MediaDevices = [];
		navigator.enumerateDevices(function (devices) {
			devices.forEach(function (_device) {
				var device = {};
				for (var d in _device) { device[d] = _device[d]; }
				if (device.kind === 'audio') { device.kind = 'audioinput'; }
				if (device.kind === 'video') { device.kind = 'videoinput'; }
				var skip;
				_MEDIA.MediaDevices.forEach(function (d) { if (d.id === device.id && d.kind === device.kind) { skip = true; } });
				if (skip) { return; }
				if (!device.deviceId) { device.deviceId = device.id; }
				if (!device.id) { device.id = device.deviceId; }
				if (!device.label) {
					device.label = 'Please invoke getUserMedia once.';
					if (!_MEDIA.isHTTPs) { device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.'; }
				} else {
					if (device.kind === 'videoinput' && !_MEDIA.isWebcamAlreadyCaptured) { _MEDIA.isWebcamAlreadyCaptured = true; }
					if (device.kind === 'audioinput' && !_MEDIA.isMicrophoneAlreadyCaptured) { _MEDIA.isMicrophoneAlreadyCaptured = true; }
				}
				if (device.kind === 'audioinput') { _MEDIA.hasMicrophone = true; }
				if (device.kind === 'audiooutput') { _MEDIA.hasSpeakers = true; }
				if (device.kind === 'videoinput') { _MEDIA.hasWebcam = true; }
				_MEDIA.MediaDevices.push(device);
			});
			if (callback) { callback(); }
		});
	}
}

