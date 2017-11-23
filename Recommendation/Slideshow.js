class Slideshow {

    constructor() {
        this._imagesCount = 0;
        this._maxSlides = 0;
        this._imgWidth = 0;
        this._HTMLelement = this.createDiv();
        this._images = []; // {img: ..., href: ...}
        this._opacity = 0;
    }

    draw() {
        let offset = 0;
        for (let img of this._images) {
            const divDOM = document.createElement('div');

            divDOM.style.backgroundImage = "url('" + img.img + "')";
            divDOM.style.height = "100px";
            divDOM.style.width = this._imgWidth + "px";
            divDOM.style.backgroundPosition = "center 30%";
            divDOM.style.backgroundRepeat = "no-repeat";
            divDOM.style.cursor = "pointer";
            divDOM.style.display = "inline-block";
            divDOM.onclick = () => { location.href = img.href; }

            const bottom_lane = document.createElement('div');
            divDOM.appendChild(bottom_lane);

            bottom_lane.innerHTML = img.title;
            bottom_lane.style.textAlign = "center";
            bottom_lane.style.padding = "1px";
            bottom_lane.style.color = "white";
            bottom_lane.style.fontWeight = "bold";
            bottom_lane.style.background = "rgba(0, 0, 0, 0.6)";
            bottom_lane.style.position = "relative";
            bottom_lane.style.marginLeft = "-1px";
            bottom_lane.style.marginTop = "85px";
            bottom_lane.style.zIndex = 2;

            this._HTMLelement.appendChild(divDOM);
        }


        const upper_lane = document.createElement('div');
        this._HTMLelement.appendChild(upper_lane);

        upper_lane.innerHTML = "Pages you may be interested in..."
        upper_lane.style.textAlign = "center";
        upper_lane.style.padding = "1px";
        upper_lane.style.color = "white";
        upper_lane.style.fontWeight = "bold";
        upper_lane.style.background = "rgba(0, 0, 0, 0.6)";
        upper_lane.style.position = "relative";
        upper_lane.style.marginTop = "-101px";
        upper_lane.style.marginLeft = "-1px";
        upper_lane.style.zIndex = 2;
    }

    createDiv() {
        const parent = document.getElementById("contentSub");
        parent.style = "height: 100px;"
        const div = document.createElement('div');
        div.id = "WikirecSlideshow";

        div.style.width = "70%";
        div.style.height = "100%";
        div.style.marginLeft = "15%";
        div.style.opacity = this._opacity;

        parent.appendChild(div);

        this._maxSlides = parseInt(div.offsetWidth / 162);
        this._imgWidth = parseInt(div.offsetWidth / this._maxSlides) - 1;

        return div;
    }

    delete() {
        this.disappear();
        this._images = [];
        this._imagesCount = 0;
    }

    retrieveImage(link) {
        if (this._imagesCount >= this._maxSlides)
            return
        this._imagesCount += 1;
        const callback = (img) => {
            this._images.push({'img': img.src, 'title': img.title, 'href': link});
            if (this._images.length == this._maxSlides) {
                this.draw();
                this.appear();
            }
        }
        apiMod.retrieveImage({
            'link': link,
            'callback': callback
        });
    }

    update(links) {
        for (let link of links) {
            this.retrieveImage(link.href);
        }
    }

    setOpacity(x) {
        this._opacity = Math.min(1, Math.max(0, x));
        this._HTMLelement.style.opacity = this._opacity;
    }

    disappear() {
        this.setOpacity(this._opacity - Constants.FADE_SPEED);
        let that = this;
        if (this._opacity > 0) {
            setTimeout( () => { that.disappear(); }, Constants.FREQUENCY );
        }
    }

    appear() {
        console.log(this._opacity);
        this.setOpacity(this._opacity + Constants.FADE_SPEED);
        let that = this;
        if (this._opacity < 1) {
            setTimeout( () => { that.appear(); }, Constants.FREQUENCY );
        }
    }
}

let slideshow = new Slideshow();
