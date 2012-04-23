describe("Popcorn", function () {
    var $first;
    var $last;
    var FatPopcorn = exports.FatPopcorn;

    describe("default fat behaviour", function () {

        beforeEach(function () {
            loadFixtures('activemetadata-fixture.html');
            $elements = $('.open_popcorn').fatpopcorn({token:'TOKEN', current_user:1, autoWrap:true});
            $first = $elements.first();
            $last = $elements.last();
            jasmine.Ajax.useMock();
            $('head').append('<meta content="authenticity_token" name="csrf-param" /><meta content="TOKEN" name="csrf-token" />');
        });

        describe("overall visualization of the plugin", function () {
            it("should generate an hidden html with class fatpopcorn", function () {
                expect($('.fatpopcorn').first()).toBeHidden();
            });

            it("should generate the html only once", function () {
                expect($('.fatpopcorn').size()).toBe(1);
            });

            it("should create a .fatpopcorn_grip on the :hover class of the matched element", function () {
                expect($first.parent()).toBe('span.fatpopcorn_grip');
            });
        });

        describe("fatpopcorn option", function () {
            beforeEach(function () {
                $fatpopcorn = new FatPopcorn($first, {token:'TOKEN', current_user:1});
            });
            it("should create a fileuploader object", function () {
                expect(FatPopcorn.uploader).toBeDefined();
            });
            it("should require some options", function () {
                var options = {};
                expect(
                    function () {
                        new FatPopcorn($first, options)
                    }).toThrow(new Error('parameters [token], [current_user] are required'));
            });
            it("should require current_user", function () {
                var options = {token:'TOKEN'};
                expect(
                    function () {
                        new FatPopcorn($first, options)
                    }).toThrow(new Error('parameters [token], [current_user] are required'));
            });
            it("should correctly configure token", function () {
                expect($fatpopcorn.defaults.token).toEqual('TOKEN');
            });
            it("should correctly configure current_user", function () {
                expect($fatpopcorn.defaults.current_user).toEqual(1);
            });
        });

        describe("fatpopcorn window positioning and visualization", function () {
            it("should verify that if element left offset is 0 the popcorn $element becomes the popcorn span wrapper", function () {
                $first.css("margin-left", -9000)
                new FatPopcorn($first, {token:'TOKEN', current_user:1});
                $('.fatpopcorn_grip').first().click();
            });
            it("should attach click events to any fatpopcorn_grip element", function () {
                expect($('.fatpopcorn_grip')).toHandle('click');
            });
            it("should attach click events to stream-items-count class inside fatpopcorn_grip", function () {
                expect($('.stream-items-count').first()).toHandle('click');
            });
            it("should be visible when fatpopcorn_grip element is clicked", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('.fatpopcorn')).toBeVisible();
            });
            it("should not be visible when sonething else is clicked", function () {
                $('.fatpopcorn_grip').first().click();
                $('.other_element').click();
                expect($('.fatpopcorn')).not.toBeVisible();
            });
            it("should set stream body visible by default", function () {
                $first.attr('data-stream', '12');
                $('.fatpopcorn_grip').first().click();
                expect($('.popcorn-body .stream')).toBeVisible();
            });
            it("should set edit body visible by default if data-stream is 0", function () {
                $first.attr('data-stream', '0');
                $('.fatpopcorn_grip').first().click();
                expect($('.popcorn-body .edit')).toBeVisible();
                $first.removeAttr('data-stream');
            });
            it("should add a class has-stream to the grip data-stream is > 0", function () {
                $('.fatpopcorn_grip').first().click();
                FatPopcorn.newNoteOrAttachmentSuccess("({fieldId:'#addr_two', streamItemsCount: 10, streamBody: 'fake body', modelName: 'modelName', fieldName: 'my_label2'})");
                expect($('#addr_two').parent()).toHaveClass('has-stream');
            });
            it("should add a class has-stream to the grip data-stream is = 0", function () {
                $('#addr_two').parent().addClass('has-stream');
                FatPopcorn.newNoteOrAttachmentSuccess("({fieldId:'#addr_two', streamItemCount: 0, streamBody: 'fake body', modelName: 'modelName', fieldName: 'my_label2'})");
                expect($('#addr_two').parent()).not.toHaveClass('has-stream');
            });
            it("should remove number of elements when data-stream is = 0", function () {

                FatPopcorn.newNoteOrAttachmentSuccess("({fieldId:'#addr_two', streamItemCount: 0, streamBody: 'fake body', modelName: 'modelName', fieldName: 'my_label2'})");

                expect($('#stream-items-count-test').text()).toBe('');
            });

            it("should set history not visible by default", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('.popcorn-body .history')).not.toBeVisible();
            });
            it("should have a click handle on stream tab", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('.stream-tab')).toHandle('click');
            });
            it("should have a click handle on edit tab", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('.edit-tab')).toHandle('click');
            });
            it("should have a click handle on history tab", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('.history-tab')).toHandle('click');
            });
            it("should make the tab active when clicking edit-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').first().click();
                expect($('.edit-tab')).toHaveClass('active');
            });
            it("should make the stream and history tab not active when clicking edit-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').first().click();
                expect($('.stream-tab')).not.toHaveClass('active');
                expect($('.history-tab')).not.toHaveClass('active');
            });
            it("should make the tab active when clicking history-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.history-tab').first().click();
                expect($('.history-tab')).toHaveClass('active');
            });
            it("should make the stream and edit tab not active when clicking history-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.history-tab').first().click();
                expect($('.stream-tab')).not.toHaveClass('active');
                expect($('.edit-tab')).not.toHaveClass('active');
            });
            it("should make the tab active when clicking stream-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.stream-tab').first().click();
                expect($('.stream-tab')).toHaveClass('active');
            });
            it("should make the stream and edit tab not active when clicking stream-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.stream-tab').first().click();
                expect($('.edit-tab')).not.toHaveClass('active');
                expect($('.history-tab')).not.toHaveClass('active');
            });

            it("should add to the grip image the ability to close fatpopcorn", function () {
                $('.fatpopcorn_grip').first().click();
                $('.fatpopcorn_grip').first().click();
                expect($('.fatpopcorn')).not.toBeVisible();
            });
            it("should position the control at the correct height under the element", function () {
                $('.fatpopcorn_grip').last().click();
                expect($('.fatpopcorn').offset().top).toBeGreaterThan($last.offset().top + 26);
            });
            it("should make only the stream visible when clicking on the stream-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.stream-tab').first().click();
                expect($('.stream')).toBeVisible();
                expect($('.history')).not.toBeVisible();
                expect($('.edit')).not.toBeVisible();
            });
            it("should make only the edit visible when clicking on the edit-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').first().click();
                expect($('.edit')).toBeVisible();
                expect($('.stream')).not.toBeVisible();
                expect($('.history')).not.toBeVisible();
            });
            it("should make only the history visible when clicking on the edit-tab", function () {
                $('.fatpopcorn_grip').first().click();
                $('.history-tab').first().click();
                expect($('.history')).toBeVisible();
                expect($('.edit')).not.toBeVisible();
                expect($('.stream')).not.toBeVisible();
            });
            it("should avoid closing the pop when the popup itself is clicked", function () {
                $('.fatpopcorn_grip').first().click();
                $('.fatpopcorn').click();
                expect($('.fatpopcorn')).toBeVisible();
            });

            it("should show ON in the watchlist field when data-watching attr is true", function () {
                $first.attr('data-watching', 'true');
                $('.fatpopcorn_grip').first().click();
                $('.fatpopcorn .edit-tab').click();
                expect($('#watchlist_true')).toBeChecked();
            });

        });

        describe("fatpopcorn notes", function () {
            it("should verify that layer contains the form for creating new notes", function () {
                expect($('.fatpopcorn')).toContain('form#notes_form');
            });
            it("should manage the notes form action when view is opened", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('.fatpopcorn #notes_form').attr('action')).toEqual("/active_metadata/modelName/1/my_label/notes");
            });
            it("should set the watchlist edit[data-url] when initializing the corn", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('.fatpopcorn .edit').attr('data-url')).toEqual("/active_metadata/modelName/1/my_label/watchers/1");
            });
            it("should verify that form notes has been added with the provided token", function () {
                $('.fatpopcorn_grip').first().click();
                expect($('form#notes_form')).toContain('input[name="authenticity_token"]');
                expect($('input[name="authenticity_token"]')).toHaveValue('TOKEN');
            });
            it("should check the link of inserisci nota handles a click event", function () {
                expect($('#send_note')).toHandle('click');
            });
            it("should show the loader when making an ajax request", function () {
                $('.fatpopcorn_grip').first().click();
                spyOn($, 'post').andCallThrough();
                $('#send_note').trigger('click');
                expect($('.loader')).toBeVisible();
                $.post.reset();
            });
            it("should reset the textarea of the send_note after a successful post", function () {
                $('.fatpopcorn_grip').first().click();
                $('textarea#note_text').val('prova uno due tre');
                FatPopcorn.newNoteOrAttachmentSuccess("({fieldId:'#id', streamItemCount: 10, streamBody: 'pippo', modelName: 'modelName', fieldName: 'my_label2'})");
                expect($('textarea#note_text').val()).toBe('');
            });
            it("should set the data-watching accordingly to the ajax call", function () {
                FatPopcorn.watchingServiceSuccess({ fieldId:'#addr_two', modelName:'modelName', fieldName:'my_label2', watching:false});
                expect($('#addr_two')).toHaveAttr('data-watching', 'false');
            });
        });

        describe("stream", function () {
            beforeEach(function () {
                $testElementGrip = $('.three .fatpopcorn_grip');
            });

            it("should change the data-stream url", function () {
                $testElementGrip.click();
                expect($('.fatpopcorn .stream').attr('data-url')).toEqual("/active_metadata/anotherModelName/2/my_label/stream");
            });
        });

        describe("ajax interactions", function () {
            beforeEach(function () {
                jasmine.Ajax.useMock();
                function _htmlStream() {
                    return '<span class="line"></span><span class="time">Oggi</span>' +
                        '<div class="attachment"><h1 data-id="1"><a href="#">esito_tecnico_2.pdf</a><span class="star" data-url="/active_metadata/modelName/1/my_label/attachments/1/star">*</span><span class="delete">x</span></h1>' +
                        '<p>Matteo De Vecchi ha allegato un file</p></div>' +
                        '<div class="note"><h1 data-id="1">nota bene!<span class="star" data-url="/active_metadata/modelName/1/my_label/notes/1/star">*</span><span class="delete">x</span></a></h1>' +
                        '<p>Matteo De Vecchi ha creato una nota un file</p></div>';
                }

                ;

                this.success_response = {
                    attach:{success:{status:200, responseText:{modelName:'modelName', fieldName:'my_label2'}}},
                    send_note:{success:{status:200, responseText:'<body></body>'}},
                    recv_stream:{success:{status:200, responseText:_htmlStream()}}
                };
                onSuccess = jasmine.createSpy('onSuccess');
                onFailure = jasmine.createSpy('onFailure');
                clearAjaxRequests();
                $('head').append('<meta content="authenticity_token" name="csrf-param" /><meta content="TOKEN" name="csrf-token" />');
            });

            it("streamEvent should make an ajax call to the stream url", function () {
                spyOn($, 'ajax').andCallThrough();
                $('.fatpopcorn_grip').first().click();
                $('.stream-tab').click();
                var request = mostRecentAjaxRequest();
                request.response(this.success_response.recv_stream.success);
                expect($.ajax).toHaveBeenCalled();
                expect(request.url).toBe("/active_metadata/modelName/1/my_label/stream");
                expect(request.method).toBe("GET");

            });
            it("action of the attachments url should be set correctly", function () {
                $('.fatpopcorn_grip').first().click();
                expect(FatPopcorn.uploader._options.action).toEqual('/active_metadata/modelName/1/my_label/attachments');
            });
            it("should open the stream tab after uploading a file", function () {
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').click();
                FatPopcorn.onCompleteUpload(0, "pippo.js", {success:true}, {getQueue:function () {
                    return 0
                }});
                expect($('.stream')).toBeVisible();
            });

            it("historyEvent should make an ajax call to the history url", function () {
                spyOn($, 'ajax').andCallThrough();
                $('.fatpopcorn_grip').first().click();
                $('.history-tab').click();
                var request = mostRecentAjaxRequest();
                request.response(this.success_response.recv_stream.success);
                expect($.ajax).toHaveBeenCalled();
                expect(request.url).toBe("/active_metadata/modelName/1/my_label/histories");
                expect(request.method).toBe("GET");
            });

            it("should call streamEvent when clicking on stream-tab", function () {
                spyOn(FatPopcorn, 'streamEvent');

                $('.fatpopcorn_grip').first().click();
                $('.stream-tab').click();

                expect(FatPopcorn.streamEvent).toHaveBeenCalled()
                FatPopcorn.streamEvent.reset();
            });
            it("should call historyEvent when clicking on history-tab", function () {
                spyOn(FatPopcorn, 'historyEvent');

                $('.fatpopcorn_grip').first().click();
                $('.history-tab').click();

                expect(FatPopcorn.historyEvent).toHaveBeenCalled()
                FatPopcorn.historyEvent.reset();
            });

            it("should append the stream result after a GET has being made", function () {
                $('.fatpopcorn_grip').first().click();
                $('.stream-tab').click();
                FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                expect($('.fatpopcorn .stream .content .time')).toExist();
            });
            it("should append the stream result after a GET has being made clearing the previous output", function () {
                $('.fatpopcorn_grip').first().click();
                $('.stream-tab').click();
                $('.fatpopcorn .stream .content').append("<h3>pippo</h3>");
                FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                expect($('.fatpopcorn .stream .content h3')).not.toExist();
            });
            it("should append the history result after a GET has being made", function () {
                $('.fatpopcorn_grip').first().click();
                $('.history-tab').click();
                FatPopcorn.getHistorySuccess(this.success_response.recv_stream.success.responseText);
                expect($('.fatpopcorn .history .content .time')).toExist();
            });

            it("should call ajaxSend on the loader when making an ajax request", function () {
                spyOnEvent($('.loader'), 'ajaxSend');
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').click();
                $('#send_note').click();
                var request = mostRecentAjaxRequest();
                request.response(this.success_response.send_note.success);
                expect('ajaxSend').toHaveBeenTriggeredOn($('.loader'));
            });
            it("should call ajaxComplete on the loader when making an ajax request", function () {
                spyOnEvent($('.loader'), 'ajaxComplete');
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').click();
                $('#send_note').click();
                var request = mostRecentAjaxRequest();
                request.response(this.success_response.send_note.success);
                expect('ajaxComplete').toHaveBeenTriggeredOn($('.loader'));
            });
            it("should avoid sending notes when textarea is blank", function () {
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').click();
                $('#send_note').click();
                expect($('.edit')).toBeVisible();
            });

            it("watchlist labels/input should handle click", function () {
                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').click();
                expect($('#watchlist_false')).toHandle('click');
                expect($('#watchlist_true')).toHandle('click');
            });

            it("should trigger an ajax request when clicking on watchlist", function () {
                spyOn($, 'ajax').andCallThrough();

                $('.fatpopcorn_grip').first().click();
                $('.edit-tab').click();
                $('#watchlist_true').click();
                var request = mostRecentAjaxRequest();

                request.response(this.success_response.recv_stream.success);

                expect(request.url).toBe("/active_metadata/modelName/1/my_label/watchers/1");
                expect(request.method).toBe("POST");
            });

            it("should load true or false in watchlist input accordingly to data-watcher")

            it("should handle click on the delete note span", function () {
                spyOn($, 'ajax').andCallThrough();

                $('.fatpopcorn_grip').first().click();

                FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);

                expect($('.fatpopcorn .stream .note span.delete')).toHandle('click');
            });
            it("should handle click on the delete attachment span", function () {
                spyOn($, 'ajax').andCallThrough();

                $('.fatpopcorn_grip').first().click();

                FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);

                expect($('.fatpopcorn .stream .attachment span.delete')).toHandle('click');
            });

            it("should delete an attachment when clicking on delete note link", function () {
                spyOn($, 'ajax').andCallThrough();
                spyOn(window, 'confirm').andReturn(true);
                $('.fatpopcorn_grip').first().click();
                FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                $('.fatpopcorn .stream .attachment span.delete').click();

                var request = mostRecentAjaxRequest();

                expect(request.url).toBe("/active_metadata/modelName/1/my_label/attachments/1");
                expect(request.params).toContain("_method=delete");
                expect(request.method).toBe("POST");
            });

            it("should delete a note when clicking on delete note link", function () {
                spyOn($, 'ajax').andCallThrough();
                spyOn(window, 'confirm').andReturn(true);
                $('.fatpopcorn_grip').first().click();
                FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                $('.fatpopcorn .stream .note span.delete').click();

                var request = mostRecentAjaxRequest();

                expect(request.url).toBe("/active_metadata/modelName/1/my_label/notes/1");
                expect(request.params).toContain("_method=delete");
                expect(request.method).toBe("POST");
            });

            describe("error handling", function(){

                it("should display error message when create note return a failure", function(){

                })

            });

            describe("star/unstar", function () {

                it("should handle click on the note star span", function () {
                    spyOn($, 'ajax').andCallThrough();
                    $('.fatpopcorn_grip').first().click();
                    FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                    expect($('.fatpopcorn .stream .note span.star')).toHandle('click');
                });

                it("should handle click on the attachment star span", function () {
                    spyOn($, 'ajax').andCallThrough();
                    $('.fatpopcorn_grip').first().click();
                    FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                    expect($('.fatpopcorn .stream .attachment span.star')).toHandle('click');
                });

                it("should star a note when clicking on a note star icon", function () {
                    spyOn($, 'ajax').andCallThrough();
                    $('.fatpopcorn_grip').first().click();
                    FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                    $('.fatpopcorn .stream .note span.star').click();

                    var request = mostRecentAjaxRequest();

                    expect(request.url).toBe("/active_metadata/modelName/1/my_label/notes/1/star");
                    expect(request.params).toContain("_method=put");
                    expect(request.method).toBe("POST");
                });

                it("should star an attachment when clicking on an attachment star icon", function () {
                    spyOn($, 'ajax').andCallThrough();
                    $('.fatpopcorn_grip').first().click();
                    FatPopcorn.getStreamSuccess(this.success_response.recv_stream.success.responseText);
                    $('.fatpopcorn .stream .attachment span.star').click();

                    var request = mostRecentAjaxRequest();

                    expect(request.url).toBe("/active_metadata/modelName/1/my_label/attachments/1/star");
                    expect(request.params).toContain("_method=put");
                    expect(request.method).toBe("POST");
                });

            })

            describe("notifier", function () {

                it("should generate and display a message inside a notice element", function(){
                    FatPopcorn.notifier.notify("notice","message");
                    expect($('.fatpopcorn .info p.notice')).toHaveText("message");
                });

                it("should generate and display a message inside an error element", function(){
                    FatPopcorn.notifier.notify("error","message");
                    expect($('.fatpopcorn .info p.error')).toHaveText("message");
                });

                it("should verify that the message box handle click", function(){
                    FatPopcorn.notifier.notify("error","message");
                    expect($('.fatpopcorn .info p.error')).toHandle('click');
                });

                it("should verify that clicking the message box destroy the element", function(){
                    FatPopcorn.notifier.notify("error","message");
                    $('.fatpopcorn .info p.error').click();
                    expect($('.fatpopcorn .info p.error')).not.toExist();
                });

                it("should verify that message box ise not displayed twice, second notify must override", function(){
                    FatPopcorn.notifier.notify("error","message");
                    FatPopcorn.notifier.notify("error","message");
                    expect($('.fatpopcorn .info p.messageBox').length).toBe(1);
                });

                it("should verify that closing the FatPopcorn window destroy the element", function(){
                    $('.fatpopcorn_grip').first().click();
                    FatPopcorn.notifier.notice("notice");
                    FatPopcorn.notifier.error("error");
                    $(window).click();
                    expect($('.fatpopcorn .info p.notice')).not.toExist();
                    expect($('.fatpopcorn .info p.error')).not.toExist();
                });

                describe("notice", function(){

                    it("should display the notice message", function(){
                        spyOn(FatPopcorn.notifier, "notify").andCallThrough();
                        FatPopcorn.notifier.notice("notice message");
                        expect(FatPopcorn.notifier.notify).toHaveBeenCalledWith("notice","notice message");
                    })

                });

                describe("error", function(){

                    it("should display the error message", function(){
                        spyOn(FatPopcorn.notifier, "notify").andCallThrough();
                        FatPopcorn.notifier.error("error message");
                        expect(FatPopcorn.notifier.notify).toHaveBeenCalledWith("error","error message");
                    })

                });

                describe("removeBox", function(){

                    it("should remove the message box", function(){
                        FatPopcorn.notifier.error("error message");
                        FatPopcorn.notifier.notice("notice message");
                        FatPopcorn.notifier.removeBox();
                        expect($('.fatpopcorn .info p.notice')).not.toExist();
                        expect($('.fatpopcorn .info p.error')).not.toExist();
                    })

                });

            });

            describe("displayFailure", function(){

                it("should display the error message",function(){
                    spyOn(FatPopcorn.notifier, "notify").andCallThrough();
                    $('.fatpopcorn_grip').first().click();
                    FatPopcorn.displayFailure("error message");
                    expect(FatPopcorn.notifier.notify).toHaveBeenCalledWith("error","error message");

                });

            });

        });
    });

});
