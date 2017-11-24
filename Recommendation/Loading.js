class Loading {

    constructor(slideshow) {
        this._angle = 0;
        this._opacity = 0;
        this.slideshow = slideshow;
        this.canvas = this.createDiv();
        this.context = this.canvas.getContext('2d');
        this.wheel1 = 0;
        this.wheel2 = 0;
        this.scale = 0;
        this.draw();
    }

    createDiv() {
        const canvas = document.createElement('canvas');
        canvas.width = '150';
        canvas.height = '150';
        canvas.style.opacity = '0';
        canvas.hidden = true;
        const parent = document.getElementById("contentSub");
        parent.appendChild(canvas);
        return canvas;
    }

    draw() {

        this.wheel1 -= Constants.ROTATION_SPEED;
        if (this.wheel1 < 0)
            this.wheel1 = Math.PI * 2 - this.wheel1;

        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.strokeStyle = 'rgba(30, 30, 30, 0.2)';
        this.context.lineWidth = 10;
        this.context.beginPath();
        this.context.arc(this.canvas.width/2 + 2, this.canvas.width/2 + 2, this.canvas.width/3*this.scale, 0, 2 * Math.PI);
        this.context.stroke();

        this.context.translate(this.canvas.width/2, this.canvas.width/2);

        this.context.rotate(this.wheel1);

        this.context.translate(-this.canvas.width/2, -this.canvas.width/2);

        this.context.strokeStyle = '#AAAABB';
        this.context.lineWidth = 10;
        this.context.beginPath();
        this.context.arc(this.canvas.width/2, this.canvas.width/2, this.canvas.width/3*this.scale, 0, 2 * Math.PI);
        this.context.stroke();

        this.context.strokeStyle = 'rgba(166, 190, 249, 0.8)';
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.arc(this.canvas.width/2, this.canvas.width/2, this.canvas.width/3*this.scale, 0, Math.PI);
        this.context.stroke();

        this.wheel2 += Constants.ROTATION_SPEED;
        if (this.wheel2 > Math.PI * 2)
            this.wheel2 -= Math.PI * 2;

        this.context.translate(this.canvas.width/2, this.canvas.width/2);

        this.context.rotate(-this.wheel1 + this.wheel2);

        this.context.translate(-this.canvas.width/2, -this.canvas.width/2);

        this.context.strokeStyle = 'rgba(167, 234, 248, 0.8)';
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.arc(this.canvas.width/2, this.canvas.width/2, this.canvas.width/3*this.scale, 0, Math.PI);
        this.context.stroke();

        this.context.translate(this.canvas.width/2, this.canvas.width/2);

        this.context.rotate(- this.wheel2);

        this.context.translate(-this.canvas.width/2, -this.canvas.width/2);

        const that = this;
        setTimeout( () => { that.draw(); }, Constants.FREQUENCY );
    }

    setOpacity(x) {
        this._opacity = Math.min(1, Math.max(0, x));
        this.canvas.style.opacity = this._opacity;
    }

    disappear() {
        this.scale -= 0.025;
        if (this.scale < 0)
            this.scale = 0;
        this.setOpacity(this._opacity - Constants.FADE_SPEED);
        let that = this;
        if (this._opacity > 0) {
            setTimeout( () => { that.disappear(); }, Constants.FREQUENCY );
        } else {
            this.canvas.hidden = true;
            slideshow.draw();
            slideshow.appear();
        }
    }

    appear() {
        this.canvas.hidden = false;
        this.scale += 0.025;
        if (this.scale > 1)
            this.scale = 1;
        this.setOpacity(this._opacity + Constants.FADE_SPEED);
        let that = this;
        if (this._opacity < 1) {
            setTimeout( () => { that.appear(); }, Constants.FREQUENCY );
        }
    }
}
