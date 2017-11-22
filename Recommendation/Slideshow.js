class Slideshow {

    constructor() {
        this._imagesCount = 0;
        this._maxSlides = 0;
        this._imgWidth = 0;
        this._HTMLelement = this.createDiv();
        this._images = []; // {img: ..., href: ...}
    }

    draw() {
        this.delete();
        this._HTMLelement = this.createDiv();
        let offset = 0;
        for (let img of this._images) {
            const divDOM = document.createElement('div');

            divDOM.style.backgroundImage = "url('" + img.img + "')";
            divDOM.style.height = "100px";
            divDOM.style.width = this._imgWidth + "px";
            divDOM.style.backgroundPosition = "center center";
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

        upper_lane.innerHTML = "Pages you may like..."
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

        div.style.border = "1px solid black";
        div.style.width = "70%";
        div.style.height = "100%";
        div.style.marginLeft = "15%";

        parent.appendChild(div);

        this._maxSlides = parseInt(div.offsetWidth / 162);
        this._imgWidth = parseInt(div.offsetWidth / this._maxSlides);

        return div;
    }

    delete() {
        const parent = document.getElementById("contentSub");
        parent.removeChild(this._HTMLelement);
        this._images = [];
    }

    retrieveImage(link) {
        if (this._imagesCount >= this._maxSlides)
            return
        this._imagesCount += 1;
        const callback = (img) => {
            this._images.push({'img': img.src, 'title': img.title, 'href': link});
            this.draw();
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
}

let slideshow = new Slideshow();

window.onresize = function(event) {
    slideshow.delete();
    slideshow._HTMLelement = slideshow.createDiv();
    slideshow.update(art.links);
};
