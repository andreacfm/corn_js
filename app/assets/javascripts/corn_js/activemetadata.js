var exports = window.exports || {};

(function (exports) {

    var Popcorn = exports.Popcorn;

    var Cm = function () {
    };

    var FP = exports.FatPopcorn = function ($element, defaults) {
        var self = this;

        function _anOptionIsMissingIn(options) {
            if (!options.autoWrap) options.autoWrap = false;
            //TODO check if is the case to avoid looking for token and modelId
            return options.current_user === undefined;
        }

        if (_anOptionIsMissingIn(defaults)) throw("parameter [current_user] is required");

        self.$element = $element;
        self.defaults = defaults;
        self.defaults.modelName = "#";
        self.baseCssClass = ".fatpopcorn";
    };

    FP.prototype = new Popcorn();

    FP.baseCssClass = function () {
        return '.fatpopcorn';
    };

    FP.prototype.init = function () {
        this.setupFormAction();
        this.setupFormToken();
        this.setupStreamUrl();
        this.setupHistoryUrl();
        this.setupEditForm();
        this.setupWatchlistUrl();

        if (this.hasStream()) {
            $(FP.baseCssClass() + ' .stream-tab').click();
        }
        else {
            $(FP.baseCssClass() + ' .edit-tab').click();
        }
    };

    FP.prototype.setupStreamUrl = function () {
        $(FP.baseCssClass() + ' .stream').attr('data-url', this.streamUrl());
    };
    FP.prototype.setupEditForm = function () {
        FP.createAttachmentButton(this.attachmentsUrl());
        $(FP.baseCssClass() + ' .edit').attr('data-attach-url', this.attachmentsUrl());
        $(FP.baseCssClass() + ' .on-off label.' + this.$element.attr('data-watching')).click();
        $(FP.baseCssClass() + ' .on-off input#watchlist_' + this.$element.attr('data-watching')).click();
    };
    FP.prototype.setupWatchlistUrl = function () {
        $(FP.baseCssClass() + ' .edit').attr('data-url', this.watchlistUrl());
    };
    FP.prototype.setupHistoryUrl = function () {
        $(FP.baseCssClass() + ' .history').attr('data-url', this.historyUrl());
    };
    FP.prototype.setupFormAction = function () {
        $(FP.baseCssClass() + ' #notes_form').attr('action', this.actionUrl());
        $(FP.baseCssClass() + ' .edit').attr('data-note-url', this.actionUrl());
    };
    FP.prototype.setupFormToken = function () {
        $(FP.baseCssClass() + ' #notes_form input[name="authenticity_token"]').val(FP.formToken());
    };
    FP.prototype.actionUrl = function () {
        return this.urlPrefix() + '/notes';
    };
    FP.prototype.streamUrl = function () {
        return this.urlPrefix() + '/stream';
    };
    FP.prototype.attachmentsUrl = function () {
        return this.urlPrefix() + '/attachments';
    };
    FP.prototype.watchlistUrl = function () {
        return this.urlPrefix() + '/watchers/' + this.defaults.current_user;
    };
    FP.prototype.historyUrl = function () {
        return this.urlPrefix() + '/histories';
    };
    FP.prototype.urlPrefix = function () {
        return '/active_metadata/' + this.$element.attr('data-model') + '/' + this.$element.attr('data-model-id') + '/' + this.$element.attr('data-label');
    };
    FP.prototype.hasStream = function () {
        return parseInt(this.$element.attr('data-stream')) > 0;
    };
    FP.prototype.hideContainer = function () {
        $(window).off('resize');
        return this.containerOf().hide();
    };
    FP.container = function () {
        return $(FP.baseCssClass()).first();
    };
    FP.prototype.containerOf = function () {
        return FP.container();
    };

    FP.onCompleteUpload = function (id, fileName, response, qq) {
        if (qq.getQueue().length == 1) {
            $('.qq-upload-list').empty();
        }
        if (!response.success) {
            FP.displayFailure("Si è verificato un errore.");
            return;
        }
        FP.newNoteOrAttachmentSuccess(response);
    };

    FP.prototype.decorateContainerWithHtml = function () {
        var self = this;

        function _html() {
            return '<div class="fatpopcorn"><div class="popcorn-body"><div class="header"><ul><li class="stream-tab"><div>stream</div></li>' +
                    '<li class="edit-tab"><div>edit</div></li><li class="history-tab"><div>history</div></li></ul></div>' +
                    '<div class="stream"><div class="content"></div></div><div class="history"><div class="content"></div></div>' +
                    '<div class="edit"><div class="watchlist"><h1>Watchlist</h1><div class="on-off _23states"><input name="watchlist" id="watchlist_true" value="true" type="radio"><label class="true" for="watchlist_true"><span>On</span></label><input checked="checked" name="watchlist" id="watchlist_false" value="false" type="radio"><label class="false" for="watchlist_false"><span>Off</span></label></div></div><hr/>' +
                    '<div class="note"><h1>Nota</h1><form action="" method="post" id="notes_form"><div style="margin:0;padding:0;display:inline"><input type="hidden" value="✓" name="utf8"><input type="hidden" value="' + self['token'] + '" name="authenticity_token"></div>' +
                    '<textarea id="note_text" name="note" rows="4"></textarea><a id="send_note">Inserisci</a></form></div><hr/>' +
                    '<div class="attachment"><h1>Allegati</h1><div id="fatpopcorn_attach"></div><div id="attach_output"></div></div>' +
                    '<div class="info"><h1>Info</h1><p>Lorem ipsum...</p></div></div></div><div class="popcorn-tail"></div><span class="loader"></span></div>';
        }


        if (self.containerOf().size() == 0) {
            $('body').append(_html());
        }

        self.containerOf().hide();
    };

    FP.prototype.addGripToElement = function ($element) {
        if (!$element.parent().is('span.fatpopcorn_grip') && this.defaults.autoWrap) {
            $element.wrap('<span class="fatpopcorn_grip"/>')
        }
        return $element.parent();
    };
    FP.prototype.gripOf = function ($element) {
        return $element.parent();
    };

    FP.prototype.activateTheClickedTab = function () {
        var self = this;

        $(FP.baseCssClass() + ' .header > ul > li').unbind('click').click(
                function (e) {
                    var that = this;

                    function _tabBodyName(tabName) {
                        return tabName.split('-')[0].trim();
                    }

                    function _currentTabName() {
                        return _tabBodyName($(that).attr('class'));
                    }

                    function _currentTab() {
                        return $('.' + _currentTabName());
                    }

                    function _currentTabMethod() {
                        return _currentTabName() + "Event";
                    }

                    e.stopPropagation();
                    e.preventDefault();

                    $(FP.baseCssClass() + ' .active').removeClass('active');
                    $(FP.baseCssClass() + ' .popcorn-body > div:not(.header)').hide();

                    _currentTab().show();

                    $(this).addClass('active');

                    self[_currentTabMethod()].call();
                });
    };

    FP.prototype.streamEvent = function () {
        $.ajax($(FP.baseCssClass() + ' .stream').attr('data-url')).success(FP.getStreamSuccess);
    };
    FP.prototype.editEvent = function () {
        // should do something?
    };
    FP.prototype.historyEvent = function () {
        $.ajax($(FP.baseCssClass() + ' .history').attr('data-url')).success(FP.getHistorySuccess);
    };
    FP.prototype.containerVisible = function () {
        return this.containerOf().is(':visible');
    };

    FP.formToken = function () {
        return $('meta[name="csrf-token"]').attr('content');
    };

    FP.createAttachmentButton = function (actionUrl) {
        delete FP.uploader;
        FP.uploader = new qq.FileUploader({
            element:document.getElementById('fatpopcorn_attach'),
            allowedExtensions:[],
            params:{ authenticity_token:FP.formToken(), target:"attach_output"},
            uploadButtonText:'Inserisci',
            action:actionUrl,
            multiple:true,
            onComplete:FP.onCompleteUpload
        });
    };

    FP.prototype.bindRemoteEvents = function () {
        var self = this;

        function _startWatching() {
            _callWatchlistService({authenticity_token:FP.formToken() });
        }

        function _stopWatching() {
            _callWatchlistService({_method:'delete', authenticity_token:FP.formToken() });
        }

        function _callWatchlistService(data) {
            var url = $(self.baseCssClass + ' .edit').attr('data-url');
            $.post(url, data, {dataType:'script'}).done(FP.watchingServiceSuccess).error(FP.watchingServiceFail);
        }

        $(self.baseCssClass).unbind('click').click(function (e) {
            e.stopPropagation();
        });
        $(self.baseCssClass + ' #watchlist_true').unbind('click').click(function () {
            _startWatching()
        });
        $(self.baseCssClass + ' #watchlist_false').unbind('click').click(function () {
            _stopWatching();
        });
        $(self.baseCssClass + ' #send_note').unbind('click').click(function () {
            if ($(self.baseCssClass + ' #note_text').val() == '') return false;

            $.post($(self.baseCssClass + ' form#notes_form').attr('action'), $(self.baseCssClass + 'form#notes_form').serialize())
                    .success('success.rails', FP.newNoteOrAttachmentSuccess)
                    .fail(function () {
                        FP.displayFailure("Si è verificato un errore.")
                    });
        });
        $('.loader').ajaxSend(function () {
            $(this).show();
        });
        $('.loader').ajaxComplete(function () {
            $(this).hide();
        });
    };

//    FP.bindRemoteEvents = function () { Cm.bindRemoteEvents(FP); };

    /********
     Notifier
     ********/
    FP.notifier = {
        notify:function (type, message) {
            type = type || "notice";
            this.removeBox();
            var $messageBox = $(FP.baseCssClass() + ' .info h1').after('<p class="' + type + ' messageBox">' + message + '</p>').next();
            var self = this;
            $messageBox.bind('click', function () {
                self.removeBox();
            });
        },

        notice:function (message) {
            this.notify("notice", message);
        },

        error:function (message) {
            this.notify("error", message);
        },

        removeBox:function () {
            $(FP.baseCssClass() + ' .info p.messageBox').remove();
        }
    };

    /****************
     * Error Handling
     ****************/
    FP.displayFailure = function (message) {
        FP.notifier.error(message);
    };

    /* ajax callbacks */
    FP.watchingServiceSuccess = function (jqxhr) {
        var data = eval(jqxhr);
        //remove the error/notice messageBox
        FP.notifier.removeBox();
        FP.item(data).attr('data-watching', data.watching);
    };
    FP.watchingServiceFail = function (data) {
        FP.displayFailure("Si è verificato un errore.");
        console.log('Watchlist service request failed');
        console.log(data);
        console.log(data.state());
        console.log(data.statusCode());
        console.log(data.getAllResponseHeaders());
    };

    FP.item = function (data) {
        return $('[data-model="' + data.modelName + '"][data-label="' + data.fieldName + '"]');
    };

    FP.newNoteOrAttachmentSuccess = function (dataString) {
        var data = eval(dataString);
        //remove the error/notice messageBox
        FP.notifier.removeBox();
        FP.item(data).attr('data-stream', data.streamItemsCount);

        if (data.streamItemsCount > 0) {
            FP.item(data).parents('.fatpopcorn_grip').addClass('has-stream');
            FP.item(data).siblings('.stream-items-count').text(data.streamItemsCount);
            if (data.streamItemsCount > 9)
                FP.item(data).siblings('.stream-items-count').addClass('two-digits');
            else
                FP.item(data).siblings('.stream-items-count').removeClass('two-digits');
        } else {
            FP.item(data).parents('.fatpopcorn_grip').removeClass('has-stream');
            FP.item(data).siblings('.stream-items-count').empty();
        }
        $(FP.baseCssClass() + ' textarea#note_text').val('');
        $(FP.baseCssClass() + ' .active').removeClass('active');
        $(FP.baseCssClass() + ' .popcorn-body > div:not(.header)').hide();
        $(FP.baseCssClass() + ' .stream').show();
        $(FP.baseCssClass() + ' .stream-tab').addClass('active');
        FP.getStreamSuccess(data.streamBody);
    };

    FP.getStreamSuccess = function (data) {
        $(FP.baseCssClass() + ' .stream .content').html(data);
        $(FP.baseCssClass() + ' .stream .attachment span.delete').click(FP.deleteAttachment);
        $(FP.baseCssClass() + ' .stream .note span.delete').click(FP.deleteNote);
        $(FP.baseCssClass() + ' .stream span.star').click(FP.starUnstar);
    };

    FP.deleteAttachment = function (e) {
        if (confirm("Sei sicuro?")) {
            FP.deleteStream(e, $(FP.baseCssClass() + ' .edit').attr('data-attach-url'));
        }
    };

    FP.deleteNote = function (e) {
        if (confirm("Sei sicuro?")) {
            FP.deleteStream(e, $(FP.baseCssClass() + ' .edit').attr('data-note-url'));
        }
    };

    FP.deleteStream = function (e, urlPrefix) {
        function _url() {
            return urlPrefix + '/' + $(e.target).parent().attr('data-id');
        }

        $.post(_url(), {_method:'delete'}).
                success('success.rails', FP.newNoteOrAttachmentSuccess).fail(FP.deleteFailure);
    };

    FP.starUnstar = function (e, urlPrefix) {
        var url = $(e.target).attr('data-url');
        $.post(url, {_method:'put'}).
                success('success.rails',
                function (data) {
                    FP.getStreamSuccess(data.streamBody)
                }).
                fail(FP.deleteFailure);
    };

    FP.deleteSuccess = function () {
        $(FP.baseCssClass() + ' .stream-tab').click();
    };

    FP.deleteFailure = function () {
    };

    FP.getHistorySuccess = function (data) {
        $(FP.baseCssClass() + ' .history .content').empty();
        $(FP.baseCssClass() + ' .history .content').append(data);
    };

    var SC = exports.StickyCorn = function ($element, defaults) {
        this.$element = $element;
        this.defaults = defaults;
        this.baseCssClass = ".stickycorn"
    };

    SC.prototype = new FP(null, {current_user:-1});

    SC.baseCssClass = function () {
        return '.stickycorn';
    };

    SC.prototype.decorateContainerWithHtml = function () {
        var self = this;

        function _html() {
            return '<div class="stickycorn"><div class="popcorn-body"><div class="header"><ul><li class="stream-tab"><div>stream</div></li>' +
                    '<li class="edit-tab"><div>edit</div></li><li class="history-tab"><div>history</div></li></ul></div>' +
                    '<div class="stream"><div class="content"></div></div><div class="history"><div class="content"></div></div>' +
                    '<div class="edit"><div class="watchlist"><h1>Watchlist</h1><div class="on-off _23states"><input name="watchlist" id="watchlist_true" value="true" type="radio"><label class="true" for="watchlist_true"><span>On</span></label><input checked="checked" name="watchlist" id="watchlist_false" value="false" type="radio"><label class="false" for="watchlist_false"><span>Off</span></label></div></div><hr/>' +
                    '<div class="note"><h1>Nota</h1><form action="" method="post" id="notes_form"><div style="margin:0;padding:0;display:inline"><input type="hidden" value="✓" name="utf8"><input type="hidden" value="' + self['token'] + '" name="authenticity_token"></div>' +
                    '<textarea id="note_text" name="note" rows="4"></textarea><a id="send_note">Inserisci</a></form></div><hr/>' +
                    '<div class="attachment"><h1>Allegati</h1><div id="fatpopcorn_attach"></div><div id="attach_output"></div></div>' +
                    '<div class="info"><h1>Info</h1><p>Lorem ipsum...</p></div></div></div><span class="loader"></span></div>';
        }

        self.$element.append(_html());
    };

    return exports;

})(window.exports);

(function ($, FatPopcorn, StickyCorn) {
    console.log("test!");
    $.fn.stickycorn = function (defaults) {
        var self = this;


        function _setUpElement() {
            var $element = $(this), stickycorn = new StickyCorn($element, defaults);
            stickycorn.activateTheClickedTab();
            stickycorn.bindRemoteEvents();
            stickycorn.decorateContainerWithHtml();

            return this;
        }

        return self.each(_setUpElement);
    };

    $.fn.fatpopcorn = function (options) {

        // plugin default options
        var self = this, defaults = {
            marginBorder:4,
            arrowWidth:24,
            marginArrow:11,
            verticalOffsetFromElement:26
        };

        // extends defaults with options provided
        if (options) {
            $.extend(defaults, options);
        }

        function _setUpElement() {
            var $element = $(this), fatpopcorn = new FatPopcorn($element, defaults);

            $(window).click(function () {
                fatpopcorn.hideContainer();
                FatPopcorn.notifier.removeBox();
            });

            fatpopcorn.decorateContainerWithHtml();
            fatpopcorn.activateTheClickedTab();
            fatpopcorn.bindRemoteEvents();
            FatPopcorn.createAttachmentButton();

            fatpopcorn.addGripToElement($element);

            fatpopcorn.gripOf($element).children().click(function (e) {
                $(e.target).data('elementMatched', true);
            });

            $('.fatpopcorn_grip .stream-items-count').click(function (e) {
                $(e.target).data('elementMatched', false);
            });

            fatpopcorn.gripOf($element).click(function (e) {
                if ($(e.target).data('elementMatched')) return;

                e.stopPropagation();
                e.preventDefault();
                fatpopcorn.init();

                if (fatpopcorn.containerVisible()) {
                    fatpopcorn.hideContainer();
                    return;
                }

                fatpopcorn.inferPositionType();
                fatpopcorn.setContainerPosition();
                fatpopcorn.decorateContainerWithArrow();
                fatpopcorn.containerOf().show();

                $(window).on('resize', function () {
                    if (fatpopcorn.containerVisible()) fatpopcorn.setContainerPosition();
                });
            });

            return this;
        }

        return self.each(_setUpElement);
    };
})(jQuery, exports.FatPopcorn, exports.StickyCorn);
