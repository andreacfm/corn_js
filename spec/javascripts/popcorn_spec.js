describe("Popcorn", function () {
    var $first, $last, Popcorn = exports.Popcorn,
            mock_defaults = {marginBorder:4, arrowWidth:19, marginArrow:10, autoWrap:true};

    describe("framwork", function () {
        it("testing the framework is loaded into jquery", function () {
            expect($.fn.popcorn).toBeDefined();
        });
    });

    describe("default behaviour", function () {
        beforeEach(function () {
            loadFixtures('popcorn-fixture.html');
            $elements = $('.open_popcorn').popcorn();
            $first = $elements.first();
            $last = $elements.last();
        });

        it("should hide the popcorn containers", function () {
            expect($('.open_popcorn').next().first()).toBeHidden();
        });

        it("should test that the popcorn hooks are binded to click event", function () {
            expect($('.open_popcorn').first()).toHandle('click');
        });

        it("should test that the pop container has class popcorn", function () {
            expect($('.open_popcorn').next().first()).toHaveClass('popcorn');
        });

        it("should show the containers on hook click", function () {
            $first.click();
            expect($first.next()).toBeVisible();
        });

        it("should position the container element in the center of the popupped one", function () {
            $first.click();
            expect($first.next().offset().left).toEqual(150);
        });

        it("should close any container when body is clicked", function () {
            $('.open_popcorn').each(function () {
                $(this).click();
                expect($(this).next()).toBeVisible();
            });

            $(window).click();

            $('.open_popcorn').each(function () {
                expect($(this).next()).toBeHidden();
            });
        });

        it("should hide any other opened container when a hook is clicked", function () {
            $first.click();
            $last.click();

            expect($first.next()).toBeHidden();
            expect($last.next()).toBeVisible();
        });
    })

    describe("arrow position", function () {
        var popcorn;
        var $leftElement;
        var $centerElement;
        var $rightElement;

        beforeEach(function () {
            loadFixtures('popcorn-arrow-fixture.html');
            $elements = $('.open_popcorn').popcorn();
            $leftElement = $elements.first();
            $centerElement = $('.open_popcorn.two');
            $rightElement = $elements.last();

            popcorn = new Popcorn($leftElement, mock_defaults);
        });

        it("should not be added twice", function () {
            $('.open_popcorn').popcorn();
            expect($(Popcorn.containerOf($first)).find('.popcorn-body').length).toBe(1);
        });

        it("should calculate the right position of the popcorn window", function () {
            expect(Popcorn.calculateRightOffset(200, 100)).toEqual(250);
        });

        it("should return false when the container don't collide with the right border", function () {
            expect(new Popcorn($leftElement, mock_defaults).collideRight()).toBeFalsy();
        });

        it("should return true when the container collide with right border", function () {
            expect(new Popcorn($rightElement, mock_defaults).collideRight()).toBeTruthy();
        });

        it("should return false when the container don't collide with the left border", function () {
            expect(new Popcorn($rightElement, mock_defaults).collideLeft()).toBeFalsy();
        });

        it("should return true when the container collide with left border", function () {
            expect(new Popcorn($leftElement, mock_defaults).collideLeft()).toBeTruthy();
        });

        describe("tail positioning behaviour", function () {
            it("should place the tail in the true center of the element", function () {
                $centerElement.offset({top:400, left:400});
                $centerElement.click();
                expect(tooltipTailOf($centerElement).offset().left).toEqual(146);
            });

            it("should place the tail in the true right corner when is stick to right", function () {
                $rightElement.click();
                var leftTooltipPosition = tooltipTailOf($rightElement).offset().left
                expect(leftTooltipPosition).toEqual($('html').width() - 33);
            });

            function tooltipTailOf($element) {
                return $element.next().find('.popcorn-tail');
            }

        });

        describe("set the correct container position when not in the center", function () {

            it("should position the container element in the right corner when element is stick to right", function () {
                $rightElement.click();
                expect($rightElement.next().offset().left + $rightElement.next().width() + 4).toEqual($('html').width());
            });

            it("should position the container element in the left corner when element is stick to left", function () {
                $leftElement.click();
                expect($leftElement.next().offset().left).toEqual(4);
            });

        });

        describe("html of the content", function () {
            it("should add a custom div inside the container one", function () {
                expect($leftElement.next().children().select(":last-child")).toBe("div.popcorn-tail");
            });

            it("should wrap the content of the container with a div", function () {
                expect($leftElement.next().children().select(":firt-child")).toBe("div.popcorn-body");
            });
        });
    });
});
