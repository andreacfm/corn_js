var exports = {};

(function (exports) {

    var Popcorn = exports.Popcorn = function ($element, defaults) {
        this.$element = $element;
        this.$anchor = this.$element;
        this.defaults = defaults;
    };

    Popcorn.prototype.decorateContainerWithHtml = function () {
        if (this.positionType) { throw "inferPositionType must be called after decorateContainerWithHtml"; }

        this.containerOf().hide().addClass('popcorn');

        if (!this.containerOf().find('.popcorn-body').length) {
            this.containerOf().contents().wrap("<div class='popcorn-body'/>");
        }
        this.containerOf().append("<div class='popcorn-tail'></div>");
    };

    Popcorn.prototype.inferPositionType = function () {
        var self = this;
        this.$anchor = this.$element;

        function _createPositionType() {
            if (self.$element.offset().left < 1) { self.$anchor = self.$element.parent(); }

            if (self.collideLeft()) { return new LeftPosition(self);  }
            else if (self.collideRight()) { return new RightPosition(self); }
            return new CenterPosition(self);
        }

        self.positionType = _createPositionType();
    };

    Popcorn.prototype.decorateContainerWithArrow = function () {
        if (this.positionType == undefined) {
            throw "inferPositionType must be called in order to set up the arrows";
        }
        this.containerOf().find('.popcorn-tail').css('left', this.positionType.leftOffset());
    };

    var LeftPosition = function (popcorn) {
        // TODO centrare la freccia sull'elemento puntato da fatpopcorn
        // this.leftOffset = function() {return popcorn.$element.offset().left + (popcorn.$element.width() - popcorn.defaults.arrowWidth) / 2; }
        this.leftOffset = function () { return popcorn.defaults.marginArrow; };
        this.left = function () { return popcorn.defaults.marginBorder; };
        this.top = function () { return popcorn.$anchor.offset().top + popcorn.defaults.verticalOffsetFromElement; };
    };

    var RightPosition = function (popcorn) {
        this.leftOffset = function () {
            return popcorn.containerOf().width() - (popcorn.defaults.arrowWidth + popcorn.defaults.marginArrow);
        };
        this.left = function () {
            return $('html').width() - popcorn.defaults.marginBorder - popcorn.containerOf().width();
        };
        this.top = function () {
            return popcorn.$anchor.offset().top + popcorn.defaults.verticalOffsetFromElement
        };
    };

    var CenterPosition = function (popcorn) {
        this.leftOffset = function () {
            return popcorn.containerOf().width() / 2 - Math.floor(popcorn.defaults.arrowWidth / 2);
        };
        this.left = function () {
            var middleOfElement = Popcorn.calculateMiddle(popcorn.$anchor.offset().left, popcorn.$anchor.width());
            return Popcorn.calculateLeftOffset(middleOfElement, popcorn.containerOf().width());
        };
        this.top = function () {
            return popcorn.$anchor.offset().top + popcorn.defaults.verticalOffsetFromElement
        };
    };

    Popcorn.containerOf = function ($element) {
        return $element.next();
    };

    Popcorn.prototype.containerOf = function () {
        return Popcorn.containerOf(this.$element);
    };

    Popcorn.prototype.setContainerPosition = function () {
        this.containerOf().css('top', this.positionType.top());
        this.containerOf().css('left', this.positionType.left());
    };

    Popcorn.prototype.collideRight = function () {
        var middleOfElement = Popcorn.calculateMiddle(this.$anchor.offset().left, this.$anchor.width());
        var rightOffset = middleOfElement + this.containerOf().width() / 2;
        return ($('html').width() - (rightOffset + this.defaults.marginBorder)) < 0;
    };

    Popcorn.prototype.collideLeft = function () {
        return (Popcorn.calculateLeftOffset(this.middleOf(), this.containerOf().width()) - this.defaults.marginBorder) < 0;
    };

    Popcorn.prototype.middleOf = function () {
        return Popcorn.calculateMiddle(this.$anchor.offset().left, this.$anchor.width());
    };

    Popcorn.calculateMiddle = function (left, width) {
        return left + width / 2;
    };
    Popcorn.calculateRightOffset = function (middlePoint, width) {
        return middlePoint + width / 2;
    };
    Popcorn.calculateLeftOffset = function (middlePoint, width) {
        return middlePoint - width / 2;
    };
    Popcorn.containerOf = function (element) {
        return $(element).next();
    };
    Popcorn.hideAllContainers = function ($elements) {
        $elements.each(function () {
            Popcorn.containerOf(this).hide();
        });
    };
    Popcorn.hideAllContainersExcept = function ($elements, element) {
        $elements.not(element).each(function () {
            Popcorn.containerOf(this).hide()
        });
    };
    return exports;
})(window.exports);

(function ($, exports) {
    var Popcorn = exports.Popcorn;

    $.fn.popcorn = function (options) {

        // plugin default options
        var elements = this, defaults = {
            marginBorder:4,
            arrowWidth:19,
            marginArrow:10,
            verticalOffsetFromElement:20
        };

        // extends defaults with options provided
        if (options) {
            $.extend(delfaults, options);
        }

        $(window).unbind('click').click(function () {
            Popcorn.hideAllContainers(elements);
        });

        function _setUpElement() {
            var $element = $(this), popcorn = new Popcorn($element, defaults);

            popcorn.decorateContainerWithHtml();
            popcorn.inferPositionType();
            popcorn.decorateContainerWithArrow();
            popcorn.setContainerPosition();

            $element.click(function (e) {
                e.stopPropagation();
                e.preventDefault();
                Popcorn.hideAllContainersExcept(elements, this);
                Popcorn.containerOf($element).show();
            });

            $(window).resize(function () {
                popcorn.setContainerPosition();
            });
        }

        return this.each(_setUpElement);

    };
})(jQuery, exports);