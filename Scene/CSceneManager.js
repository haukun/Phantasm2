class BCSCene {
    act() {
    }

    input() {
    }
}

class CSceneManager {
    constructor() {
        this.mainScene = new CSceneMain();
        this.subScene = undefined;
        this.wasCallback = false;
    }

    act() {
        if (this.wasCallback) {
            this.wasCallback = false;
            this.subScene = undefined;
            this.mainScene.awake();
        }

        if (this.subScene == undefined) {
            this.mainScene.act();
        } else {
            this.subScene.act();
        }
    }

    callback() {
        this.wasCallback = true;
    }

    pause() {
        this.wasCallback = false;
        this.subScene = new CScenePause(this.callback.bind(this));
    }

    glow() {
        this.wasCallback = false;
        this.subScene = new CSceneGlow(this.callback.bind(this));
    }

    debugCommand() {
        this.wasCallback = false;
        this.subScene = new CSceneDebugCommand(this.callback.bind(this));
    }

}