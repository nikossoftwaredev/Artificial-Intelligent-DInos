class ArcadeButton {

    constructor(buttonOn, buttonOff, posX, posY) {
        this.checked = true;
        this.posX = posX;
        this.posY = posY;
    }

    show() {
        if (this.checked)
            image(buttonOn, this.posX, this.posY);
        else
            image(buttonOff, this.posX, this.posY);
    }


    position(newPosX, newPosY) {
        this.posX = newPosX;
        this.posY = newPosY;
    }

}