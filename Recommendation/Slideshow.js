class Slideshow {

    constructor() {
        this._imagesCount = 0;
        this._maxSlides = 0;
        this._imgWidth = 0;
        this._HTMLelement = this.createDiv();
        this.loader = new Loading(this);
        this._images = []; // {img: ..., href: ...}
        this._opacity = 0;
    }

    draw() {

        let that = this;

        $.get("https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/UI/slideshow.html",
        function(data){
            $(that._HTMLelement).append(data);

            // String .format()
            if (!String.prototype.format) {
              String.prototype.format = function() {
                var args = arguments;
                return that.replace(/{(\d+)}/g, function(match, number) {
                  return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                  ;
                });
              };
            }

            let count_imgs = 1;

            for (let img of that._images) {
                if (count_imgs == 1 || count_imgs == 4) {
                            $(that._HTMLelement).find('.carousel-inner')
                                                .append('<div class="bootstrap item{0}">\
                                                        <div class="bootstrap row">\
                                                        </div>\
                                                    </div>'
                                                    .format((count_imgs == 1) ? " active" : "")
                                                    );
                }

                const title = (img.title.length > 20) ? img.title.substr(0, 20) + '...' : img.title;

                $(that._HTMLelement).find('.carousel-inner .row:last')
                        .append('<div class="bootstrap col-md-4">\
                              <figure class="bootstrap gallery-item">\
                                  <a href="{0}"><img src="{1}" class="bootstrap img-responsive thumbnail"></a>\
                                  <figcaption class="bootstrap img-title">\
                                      <h5>{2}</h5>\
                                  </figcaption>\
                              </figure>\
                            </div>'.format(img.href, img.img, title));

                count_imgs += 1;
            }

        });

    }

    createDiv() {
        $("#contentSub").css({ 'text-align': "center" });


        const div = document.createElement('div');
        div.id = "WikirecSlideshow";

        $("#contentSub").append($(div));

        this._maxSlides = 12;
        this._imgWidth = 162;

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
                this.loader.disappear();
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
         $(this._HTMLelement).css({
            'opacity': this._opacity
        });
    }

    disappear() {
        this._imagesCount = 0;
        this._images = []; // {img: ..., href: ...}

        let that = this;

        $(this._HTMLelement).hide("slow", function() {
            $('#WikirecSlideshow').html("");
            that.loader.appear();
        });

    }

    appear() {
        $(this._HTMLelement).show("slow");
    }

    load() {
        this.loader.appear();
    }
}

let slideshow = new Slideshow();
slideshow.load();
