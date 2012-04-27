var exports = window.exports || {};

(function (exports) {

    var Popcorn = exports.Popcorn;

    var FP = exports.FatPopcorn = function ($element, defaults) {
        var self = this;

        function _anOptionIsMissingIn(options) {
            if (!options.autoWrap) options.autoWrap = false;
            return options.current_user === undefined;
        }

        if (_anOptionIsMissingIn(defaults)) throw("parameter [current_user] is required");

        self.$element = $element;
        self.defaults = defaults;
        self.defaults.modelName = "#";
        self.baseName = "fatpopcorn";
        self.baseCssClass = ".fatpopcorn";
    };

    FP.prototype = new Popcorn();

    FP.baseCssClass = function () { return '.fatpopcorn'; };

    FP.prototype.init = function () {
        var self = this;
        self.setupFormAction();
        self.setupFormToken();
        self.setupStreamUrl();
        self.setupHistoryUrl();
        self.setupEditForm();
        self.setupWatchlistUrl();
        self.bindRemoteEvents();
        if (self.hasStream()) {
            $(self.baseCssClass + ' .stream-tab').click();
        }
        else {
            $(self.baseCssClass + ' .edit-tab').click();
        }
    };

    FP.prototype.setupStreamUrl = function () {
        var self = this;
        $(self.baseCssClass + ' .stream').attr('data-url', self.streamUrl());
    };
    FP.prototype.setupEditForm = function () {
        var self = this;
        self.createAttachmentButton(self.attachmentsUrl());
        $(self.baseCssClass + ' .edit').attr('data-attach-url', this.attachmentsUrl());
        $(self.baseCssClass + ' .on-off label.' + this.$element.attr('data-watching')).click();
        $(self.baseCssClass + ' .on-off input#watchlist_' + this.$element.attr('data-watching')).click();
    };
    FP.prototype.setupWatchlistUrl = function () {
        $(this.baseCssClass + ' .edit').attr('data-url', this.watchlistUrl());
    };
    FP.prototype.setupHistoryUrl = function () {
        $(this.baseCssClass + ' .history').attr('data-url', this.historyUrl());
    };
    FP.prototype.setupFormAction = function () {
        $(this.baseCssClass + ' #notes_form').attr('action', this.actionUrl());
        $(this.baseCssClass + ' .edit').attr('data-note-url', this.actionUrl());
    };
    FP.prototype.setupFormToken = function () {
        $(this.baseCssClass + ' #notes_form input[name="authenticity_token"]').val(FP.formToken());
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
    FP.prototype.containerOf = function () {
        return $(this.baseCssClass).first();
    };

    FP.prototype.decorateContainerWithHtml = function () {
        var self = this;

        function _html() {
            return '<div class="fatpopcorn"><div class="popcorn-body"><div class="header"><ul><li class="stream-tab"><div>stream</div></li>' +
                    '<li class="edit-tab"><div>edit</div></li><li class="history-tab"><div>history</div></li></ul></div>' +
                    '<div class="stream"><div class="content"></div></div><div class="history"><div class="content"></div></div>' +
                    '<div class="edit"><div class="watchlist"><h1>Watchlist</h1><div class="on-off _23states"><input name="watchlist" id="fatpopcorn_watchlist_true" value="true" type="radio"><label class="true" for="fatpopcorn_watchlist_true"><span>On</span></label><input checked="checked" name="watchlist" id="fatpopcorn_watchlist_false" value="false" type="radio"><label class="false" for="fatpopcorn_watchlist_false"><span>Off</span></label></div></div><hr/>' +
                    '<div class="note"><h1>Nota</h1><form action="" method="post" id="notes_form"><div style="margin:0;padding:0;display:inline"><input type="hidden" value="✓" name="utf8"><input type="hidden" value="' + self['token'] + '" name="authenticity_token"></div>' +
                    '<textarea id="note_text" name="note" rows="4"></textarea><a id="send_note">Inserisci</a></form></div><hr/>' +
                    '<div class="attachment"><h1>Allegati</h1><div class="edit-attach"></div><div id="attach_output"></div></div>' +
                    '<div class="info"><h1>Info</h1><p>Lorem ipsum...</p></div></div></div><div class="popcorn-tail"></div><span class="loader"></span></div>';
        }

        if (self.containerOf().size() == 0) { $('body').append(_html()); }

        self.containerOf().hide();
    };

    FP.prototype.addGripToElement = function () {
        var self = this;
        if (!self.$element.parent().is('span.fatpopcorn_grip') && this.defaults.autoWrap) {
            self.$element.wrap('<span class="fatpopcorn_grip"/>')
        }
        return self.$element.parent();
    };
    FP.prototype.gripOf = function () { return this.$element.parent(); };

    FP.prototype.activateTheClickedTab = function () {
        var self = this;
        $(self.baseCssClass + ' .header > ul > li').unbind('click').click(
            function (e) {
                var that = this;

                function _currentTabName() { return _tabBodyName($(that).attr('class')); }
                function _tabBodyName(tabName) { return tabName.split('-')[0].trim(); }
                function _currentTab() { return $(self.baseCssClass + ' .' + _currentTabName()); }
                function _currentTabMethod() { return _currentTabName() + "Event"; }

                e.stopPropagation();
                e.preventDefault();

                $(self.baseCssClass + ' .active').removeClass('active');
                $(self.baseCssClass + ' .popcorn-body > div:not(.header)').hide();

                _currentTab().show();

                $(that).addClass('active');
                self[_currentTabMethod()].call(self);
            });
    };

    FP.prototype.streamEvent = function () {
        var self = this;
        $.ajax($(self.baseCssClass + ' .stream').attr('data-url')).success(function(e){self.getStreamSuccess.call(self,e)});
    };
    FP.prototype.editEvent = function () {
        // should do something?
    };
    FP.prototype.historyEvent = function () {
        var self = this;
        $.ajax($(this.baseCssClass + ' .history').attr('data-url')).success(function(e){self.getHistorySuccess.call(self,e)});
    };
    FP.prototype.containerVisible = function () {
        return this.containerOf().is(':visible');
    };

    FP.formToken = function () {return $('meta[name="csrf-token"]').attr('content'); };

    FP.prototype.createAttachmentButton = function (actionUrl) {
        var self = this;

        delete self.uploader;

        self.uploader = new qq.FileUploader({
            element:$(self.baseCssClass + ' .edit-attach').get(0),
            allowedExtensions:[],
            params:{ authenticity_token:FP.formToken(), target:"attach_output"},
            uploadButtonText:'Inserisci',
            action:actionUrl,
            multiple:true,
            onComplete: function (id, fileName, response, qq) {
                    if (qq.getQueue().length == 1) {
                        $('.qq-upload-list').empty();
                    }
                    if (!response.success) {
                        FP.displayFailure("Si è verificato un errore.");
                        return;
                    }
                    self.newNoteOrAttachmentSuccess(response);
                }


        });
    };

    FP.prototype.bindRemoteEvents = function () {
        var self = this;
        function _startWatching(e) { _callWatchlistService({authenticity_token:FP.formToken() }); }
        function _stopWatching(e) { _callWatchlistService({_method:'delete', authenticity_token:FP.formToken() }); }
        function _callWatchlistService(data) {
            var url = $(self.baseCssClass + ' .edit').attr('data-url');
            $.post(url, data, {dataType:'script'}).done(FP.watchingServiceSuccess).error(FP.watchingServiceFail);
        }

        $(self.baseCssClass).unbind('click').click(function (e) { e.stopPropagation(); });
        $('#' + self.baseName + '_watchlist_true').unbind('click').click(function (e) { _startWatching.call(self,e); });
        $('#' + self.baseName + '_watchlist_false').unbind('click').click(function (e) { _stopWatching.call(self,e); });
        $(self.baseCssClass + ' #send_note').unbind('click').click(function () {
            if ($(self.baseCssClass + ' #note_text').val() == '') return false;

            $.post($(self.baseCssClass + ' form#notes_form').attr('action'), $(self.baseCssClass + ' form#notes_form').serialize())
                    .success('success.rails', function(e){self.newNoteOrAttachmentSuccess.call(self,e);})
                    .fail(function () { FP.displayFailure("Si è verificato un errore.") });
        });
        $(self.baseCssClass + ' .loader').ajaxSend(function () { $(this).show(); });
        $(self.baseCssClass + ' .loader').ajaxComplete(function () { $(this).hide(); });
    };

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
    };

    FP.item = function (data) {
        return $('[data-model="' + data.modelName + '"][data-label="' + data.fieldName + '"]');
    };

    FP.prototype.newNoteOrAttachmentSuccess = function (dataString) {
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
        $(this.baseCssClass + ' textarea#note_text').val('');
        $(this.baseCssClass + ' .active').removeClass('active');
        $(this.baseCssClass + ' .popcorn-body > div:not(.header)').hide();
        $(this.baseCssClass + ' .stream').show();
        $(this.baseCssClass + ' .stream-tab').addClass('active');
        this.getStreamSuccess(data.streamBody);
    };

    FP.prototype.getStreamSuccess = function (data) {
        var self = this;
        $(this.baseCssClass + ' .stream .content').html(data);
        $(this.baseCssClass + ' .stream .attachment span.delete').click(function(e){self.deleteAttachment.call(self, e)});
        $(this.baseCssClass + ' .stream .note span.delete').click(function(e){self.deleteNote.call(self, e)});
        $(this.baseCssClass + ' .stream span.star').click(function(e){self.starUnstar.call(self, e)});
    };

    FP.prototype.deleteAttachment = function (e) {
        if (confirm("Sei sicuro?")) {
            this.deleteStream(e, $(this.baseCssClass + ' .edit').attr('data-attach-url'));
        }
    };

    FP.prototype.deleteNote = function (e) {
        if (confirm("Sei sicuro?")) {
            this.deleteStream(e, $(this.baseCssClass + ' .edit').attr('data-note-url'));
        }
    };

    FP.prototype.deleteStream = function (e, urlPrefix) {
        var self = this;
        function _url() { return urlPrefix + '/' + $(e.target).parent().attr('data-id'); }
        $.post(_url(), {_method:'delete'}).success('success.rails', function(e){self.newNoteOrAttachmentSuccess.call(self,e);}).fail(FP.deleteFailure);
    };

    FP.prototype.starUnstar = function (e, urlPrefix) {
        var self = this;
        var url = $(e.target).attr('data-url');

        $.post(url, {_method:'put'}).
                success('success.rails', function (data) { self.getStreamSuccess(data.streamBody); }).fail(FP.deleteFailure);
    };

    FP.deleteFailure = function () {
    };

    FP.prototype.getHistorySuccess = function (data) {
        $(this.baseCssClass + ' .history .content').empty();
        $(this.baseCssClass + ' .history .content').append(data);
    };

    var SC = exports.StickyCorn = function ($element, defaults) {
        this.$element = $element;
        if (defaults.current_user === undefined) throw("parameter [current_user] is required");
        this.defaults = defaults;
        this.baseName = "stickycorn";
        this.baseCssClass = ".stickycorn";

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
                    '<div class="edit"><div class="watchlist"><h1>Watchlist</h1><div class="on-off _23states"><input name="watchlist" id="stickycorn_watchlist_true" value="true" type="radio"><label class="true" for="stickycorn_watchlist_true"><span>On</span></label><input checked="checked" name="watchlist" id="stickycorn_watchlist_false" value="false" type="radio"><label class="false" for="stickycorn_watchlist_false"><span>Off</span></label></div></div><hr/>' +
                    '<div class="note"><h1>Nota</h1><form action="" method="post" id="notes_form"><div style="margin:0;padding:0;display:inline"><input type="hidden" value="✓" name="utf8"><input type="hidden" value="' + self['token'] + '" name="authenticity_token"></div>' +
                    '<textarea id="note_text" name="note" rows="4"></textarea><a id="send_note">Inserisci</a></form></div><hr/>' +
                    '<div class="attachment"><h1>Allegati</h1><div class="edit-attach"></div><div id="attach_output"></div></div>' +
                    '<div class="info"><h1>Info</h1><p>Lorem ipsum...</p></div></div></div><span class="loader"></span></div>';
        }

        self.$element.append(_html());
    };

    return exports;

})(window.exports);

(function ($, FatPopcorn, StickyCorn) {

    $.fn.stickycorn = function (defaults) {
        var self = this;


        function _setUpElement() {
            var $element = $(this), stickycorn = new StickyCorn($element, defaults);

            stickycorn.decorateContainerWithHtml();
            stickycorn.activateTheClickedTab();
            stickycorn.bindRemoteEvents();
            stickycorn.init();

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
            fatpopcorn.addGripToElement();

            fatpopcorn.gripOf().children().click(function (e) {
                $(e.target).data('elementMatched', true);
            });

            $('.fatpopcorn_grip .stream-items-count').click(function (e) {
                $(e.target).data('elementMatched', false);
            });

            fatpopcorn.gripOf().click(function (e) {
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
