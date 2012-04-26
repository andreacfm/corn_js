describe("how stickycorn", function () {

    beforeEach(function () {
        loadFixtures('activemetadata-sticky-fixture.html');
        $stickycorn = $('.stickycorn_holder').stickycorn({current_user:1}).first();        
        jasmine.Ajax.useMock();
        $('head').append('<meta content="authenticity_token" name="csrf-param" /><meta content="TOKEN" name="csrf-token" />');
    });

    describe("is loaded in the page", function () {
        it("being defined in the library", function () {
            expect($.fn.stickycorn).toBeDefined();
        });
        it("generating a some visible with class .stickycorn", function () {
            expect($('.stickycorn').first()).toBeVisible();
        });
        it("hiding history pane by default", function () {
            expect($('.stickycorn .history')).not.toBeVisible();
        });
        it("hiding stream tab by default", function () {
            expect($('.stream-tab')).toHandle('click');
        });
        it("should have a click handle on edit tab", function () {
            expect($('.edit-tab')).toHandle('click');
        });
        it("should have a click handle on history tab", function () {
            expect($('.history-tab')).toHandle('click');
        });
        it("should make the tab active when clicking edit-tab", function () {
            $('.edit-tab').first().click();
            expect($('.edit-tab')).toHaveClass('active');
        });
    });
});