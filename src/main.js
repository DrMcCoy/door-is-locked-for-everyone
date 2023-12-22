/* Door is Locked for Everyone - Broadcast locked door sounds to every connected client
 *
 * Copyright (c) 2023, Sven Hesse (DrMcCoy) <drmccoy@drmccoy.de>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

import {libWrapper} from "../lib/libwrapper_shim.js";

Hooks.once("init", () => {
	libWrapper.register(
		"door-is-locked-for-everyone",
		"DoorControl.prototype._onMouseDown",
		function (wrapped, event) {
			if (onDoorMouseDown.call(this, event))
				return true;

			return wrapped(event);
		},
		"MIXED",
	);
});

function onDoorMouseDown(event) {
	if (!game.user.can("WALL_DOORS"))
		return false;
	if (game.paused && !game.user.isGM)
		return false;

	if (this.wall.document.ds !== CONST.WALL_DOOR_STATES.LOCKED)
		return false;

	const testSound = CONFIG.Wall.doorSounds[this.wall.document.doorSound]?.test;
	if (!testSound)
		return false;

	AudioHelper.play({src: testSound, volume: 1.0, autoplay: true, loop: false}, true);
	return true;
}
