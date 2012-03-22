  var Popcorn = function($element, defaults) {
    this.$element = $element;
    this.$anchor = this.$element;
    this.defaults =  defaults;
  };

  Popcorn.prototype.decorateContainerWithHtml = function() {
    if (this.positionType) {
      throw "inferPositionType must be called after decorateContainerWithHtml";
    }
    this.containerOf().hide().addClass('popcorn');
    if(!this.containerOf().find('.popcorn-body').length){
        this.containerOf().contents().wrap("<div class='popcorn-body'/>");
    }
    this.containerOf().append("<div class='popcorn-tail'></div>");
  };

  Popcorn.prototype.inferPositionType = function() {
    var self = this;
    this.$anchor = this.$element;
    
    function _createPositionType(defaults) {

      if(self.$element.offset().left < 1) {
          self.$anchor = self.$element.parent();
      }

      if (self.collideLeft()) { return new LeftPosition(self); }
      else if (self.collideRight()) { return new RightPosition(self); }
      return new CenterPosition(self);
    }
              
    self.positionType = _createPositionType(self.defaults);
  };
      
  Popcorn.prototype.decorateContainerWithArrow = function() {
    if (this.positionType == undefined) { throw "inferPositionType must be called in order to set up the arrows"; }

    this.containerOf().find('.popcorn-tail').css('left', this.positionType.leftOffset());
  };

  var LeftPosition = function(popcorn) {
    // TODO centrare la freccia sull'elemento puntato da fatpopcorn
    // this.leftOffset = function() {return popcorn.$element.offset().left + (popcorn.$element.width() - popcorn.defaults.arrowWidth) / 2; }
    this.leftOffset = function() {	return popcorn.defaults.marginArrow; }
    this.left = function() { return popcorn.defaults.marginBorder; }
    this.top = function() { return popcorn.$anchor.offset().top + popcorn.defaults.verticalOffsetFromElement };
  };

  var RightPosition = function(popcorn) {
    this.leftOffset = function() { return popcorn.containerOf().width() - (popcorn.defaults.arrowWidth + popcorn.defaults.marginArrow);	}
    this.left = function() { return $('html').width() - popcorn.defaults.marginBorder - popcorn.containerOf().width(); }
    this.top = function() { return popcorn.$anchor.offset().top + popcorn.defaults.verticalOffsetFromElement };
  };

  var CenterPosition = function(popcorn) {
    this.leftOffset = function() { return popcorn.containerOf().width() / 2 - Math.floor(popcorn.defaults.arrowWidth / 2); }
    this.left = function() {                                                                  
      var middleOfElement = Popcorn.calculateMiddle(popcorn.$anchor.offset().left, popcorn.$anchor.width());
      return Popcorn.calculateLeftOffset(middleOfElement, popcorn.containerOf().width());
    }
    this.top = function() { return popcorn.$anchor.offset().top + popcorn.defaults.verticalOffsetFromElement };
  };

  Popcorn.containerOf = function($element) {
    return $element.next();
  }

  Popcorn.prototype.containerOf = function() {
    return Popcorn.containerOf(this.$element);
  }

  Popcorn.prototype.setContainerPosition = function() {
    this.containerOf().css('top', this.positionType.top());
    this.containerOf().css('left', this.positionType.left());
  }

  Popcorn.prototype.collideRight = function() {
    var middleOfElement = Popcorn.calculateMiddle(this.$anchor.offset().left, this.$anchor.width());
    var rightOffset = middleOfElement + this.containerOf().width() / 2;
    return ($('html').width() - (rightOffset + this.defaults.marginBorder)) < 0;
  }

  Popcorn.prototype.collideLeft = function() {
    return (Popcorn.calculateLeftOffset(this.middleOf(), this.containerOf().width()) - this.defaults.marginBorder) < 0;
  }

  Popcorn.prototype.middleOf = function() {
    return Popcorn.calculateMiddle(this.$anchor.offset().left, this.$anchor.width());
  }

  Popcorn.calculateMiddle = function(left, width) {
    return left + width / 2;
  }

  Popcorn.calculateRightOffset = function(middlePoint, width) {
    return middlePoint + width / 2;
  }
  Popcorn.calculateLeftOffset = function(middlePoint, width) {
    return middlePoint - width / 2;
  }
  Popcorn.containerOf = function(element) {
    return $(element).next();
  }
  Popcorn.hideAllContainers = function($elements) {
    $elements.each(function() {
      Popcorn.containerOf(this).hide();
    });
  }
  Popcorn.hideAllContainersExcept = function($elements, element) {
    $elements.not(element).each(function() {
      Popcorn.containerOf(this).hide()
    });
  };

  var FatPopcorn = function($element, defaults) {		
    function _checkOptions(options) {
      if (!options.autoWrap) options.autoWrap = false;

      return typeof options.modelId === undefined || 
      options.token === undefined || 
      options.current_user === undefined;      
    };
    var self = this;

    if (_checkOptions(defaults)) throw("parameters [token], [current_user] are required");

    self.$element = $element;
    self.defaults = defaults;
    

    self.defaults.modelName = "#"
  };
  FatPopcorn.prototype = new Popcorn();
  	
  FatPopcorn.prototype.init = function() {
    this.setupFormAction();
    this.setupFormToken();
    this.setupStreamUrl();
    this.setupHistoryUrl();
    this.setupEditForm();
    this.setupWatchlistUrl();
    
    if (this.hasStream()) {
      $('.fatpopcorn .stream-tab').click();
    }
    else {
      $('.fatpopcorn .edit-tab').click();
    }
  };
  	
  FatPopcorn.prototype.setupStreamUrl = function() {
    $('.fatpopcorn .stream').attr('data-url', this.streamUrl());
  };
  FatPopcorn.prototype.setupEditForm = function() {
    FatPopcorn.createAttachmentButton(this.attachmentsUrl());
    $('.fatpopcorn .edit').attr('data-attach-url', this.attachmentsUrl());    
    $('.on-off label.' + this.$element.attr('data-watching')).click();
  };
  FatPopcorn.prototype.setupWatchlistUrl = function() {
    $('.fatpopcorn .edit').attr('data-url', this.watchlistUrl());
  };
  FatPopcorn.prototype.setupHistoryUrl = function() {  
    $('.fatpopcorn .history').attr('data-url', this.historyUrl());
  };
  FatPopcorn.prototype.setupFormAction = function() {
    $('.fatpopcorn #notes_form').attr('action', this.actionUrl());
    $('.fatpopcorn .edit').attr('data-note-url', this.actionUrl());
  };
  FatPopcorn.prototype.setupFormToken = function() {
    $('.fatpopcorn #notes_form input[name="authenticity_token"]').val(FatPopcorn.formToken());
  };
  FatPopcorn.prototype.actionUrl = function() {
    return this.urlPrefix() + '/notes';
  };
  FatPopcorn.prototype.streamUrl = function() {
    return this.urlPrefix() + '/stream';
  };
  FatPopcorn.prototype.attachmentsUrl = function() {
    return this.urlPrefix() + '/attachments';
  };
  FatPopcorn.prototype.watchlistUrl = function() {
    return this.urlPrefix() + '/watchers/' + this.defaults.current_user;
  };
  FatPopcorn.prototype.historyUrl = function() {
    return this.urlPrefix() + '/histories';
  };
  FatPopcorn.prototype.urlPrefix = function() {
    return '/active_metadata/' + this.$element.attr('data-model') + '/' + this.$element.attr('data-model-id') + '/' + this.$element.attr('data-label');
  };
  FatPopcorn.prototype.currentLabel = function() {
    return this.$element.attr('data-label');
  };
  FatPopcorn.prototype.hasStream = function() {
    return parseInt(this.$element.attr('data-stream')) > 0;
  };
  FatPopcorn.hideContainer = function() {
    $(window).off('resize');
    return FatPopcorn.container().hide();
  }
  FatPopcorn.container = function() {
    return $('.fatpopcorn').first();
  }
  FatPopcorn.prototype.containerOf = function() {
    return $('.fatpopcorn').first();
  }
  FatPopcorn.onCompleteUpload = function(id, fileName, response, qq) {
      console.log('FatPopcorn.onCompleteUpload');
      if(qq.getQueue().length == 1) {
          $('.qq-upload-list').empty();                    
      }
      if(!response.success){
        console.log(response);
          K.message.error(K.message.buildListOfErrors(response.errors));
          return;
      }
      FatPopcorn.newNoteOrAttachmentSuccess(response);
  }
  FatPopcorn.decorateContainerWithHtml = function() {
    var self = this;
    function _html() {
      return '<div class="fatpopcorn"><div class="popcorn-body"><div class="header"><ul><li class="stream-tab"><div>stream</div></li>' +
      '<li class="edit-tab"><div>edit</div></li><li class="history-tab"><div>history</div></li></ul></div>' +
      '<div class="stream"><div class="content"></div></div><div class="history"><div class="content"></div></div>' +
      '<div class="edit"><div class="watchlist"><h1>Watchlist</h1><div class="on-off _23states"><input name="watchlist" id="watchlist_true" value="true" type="radio"><label class="true" for="watchlist_true"><span>On</span></label><input checked="checked" name="watchlist" id="watchlist_false" value="false" type="radio"><label class="false" for="watchlist_false"><span>Off</span></label></div></div><hr/>' + 
      '<div class="note"><h1>Nota</h1><form form action="" method="post" id="notes_form"><div style="margin:0;padding:0;display:inline"><input type="hidden" value="✓" name="utf8"><input type="hidden" value="' + self['token'] + '" name="authenticity_token"></div>' +
      '<textarea id="note_text" name="note" rows="4"></textarea><a id="send_note" href="#">Inserisci</a></form></div><hr/>' +
      '<div class="attachment"><h1>Allegati</h1><div id="fatpopcorn_attach"></div><div id="attach_output"></div></div>' +
      '<div class="info"><h1>Info</h1><p>Lorem ipsum...</p></div></div></div><div class="popcorn-tail"></div><span class="loader"></span></div>';
    };
  	
    if (FatPopcorn.container().size() == 0) {
      $('body').append(_html());
    }
    FatPopcorn.container().hide();
  }

  FatPopcorn.prototype.addGripToElement = function($element) {
    if (!$element.parent().is('span.fatpopcorn_grip') && this.defaults.autoWrap) {
      $element.wrap('<span class="fatpopcorn_grip"/>')
    }
    return $element.parent();
  };
  FatPopcorn.prototype.gripOf = function($element) {
    return $element.parent();
  };

  FatPopcorn.activateTheClickedTab = function() {
    $('.fatpopcorn .header > ul > li').click(function(e){
      var self = this;

      function _tabBodyName(tabName) { return tabName.split('-')[0].trim(); };
      function _currentTabName() { return _tabBodyName($(self).attr('class')); };
      function _currentTab() { return $('.' + _currentTabName()); };
      function _currentTabMethod() { return _currentTabName() + "Event"; }    

      e.stopPropagation();
      e.preventDefault();

      $('.fatpopcorn .active').removeClass('active');
      $('.fatpopcorn .popcorn-body > div:not(.header)').hide();
      
      _currentTab().show();    

      $(this).addClass('active');

      FatPopcorn[_currentTabMethod()].call();
    });
  };
  FatPopcorn.streamEvent = function() {
    $.ajax($('.fatpopcorn .stream').attr('data-url'))
      .success(FatPopcorn.getStreamSuccess);
  };
  FatPopcorn.editEvent = function() {
    // should do something?
  };
  FatPopcorn.historyEvent = function() {
    $.ajax($('.fatpopcorn .history').attr('data-url'))
      .success(FatPopcorn.getHistorySuccess);
  };
  FatPopcorn.containerVisible = function () {
    return FatPopcorn.container().is(':visible');
  };
  FatPopcorn.formToken = function() {
    return $('meta[name="csrf-token"]').attr('content');
  };
  FatPopcorn.createAttachmentButton = function(actionUrl) {
    delete FatPopcorn.uploader;
    FatPopcorn.uploader = new qq.FileUploader({
      element: document.getElementById('fatpopcorn_attach'),
      allowedExtensions: [],
      params: { authenticity_token: FatPopcorn.formToken(), target: "attach_output"},
      uploadButtonText: 'Inserisci',
      action: actionUrl,
      multiple: true,
      onComplete: FatPopcorn.onCompleteUpload
     });  
  };

  FatPopcorn.bindRemoteEvents = function() {    

    function _startWatching() {      
      _callWatchlistService({authenticity_token: FatPopcorn.formToken() });
    };
    function _stopWatching() {
      _callWatchlistService({_method: 'delete', authenticity_token: FatPopcorn.formToken() });
    };
    function _callWatchlistService(data) {
      var url = $('.fatpopcorn .edit').attr('data-url');

      $.post(url, data, {dataType: 'script'}).done(FatPopcorn.watchingServiceSuccess).error(FatPopcorn.watchingServiceFail);
    };
    $('.fatpopcorn').unbind('click').click(function(e) {
      e.stopPropagation();
    });
    $('.fatpopcorn #watchlist_true').unbind('click').click(function() {
      _startWatching()
    });
    $('.fatpopcorn #watchlist_false').unbind('click').click(function() {
      _stopWatching();
    });

    $('#send_note').unbind('click').click(function() {
      if ($('#note_text').val() == '') return false;

      $.post($('form#notes_form').attr('action'), $('form#notes_form').serialize())
        .success('success.rails', FatPopcorn.newNoteOrAttachmentSuccess)
        .fail(function(e){console.log('request failed')});
    });
    $('.loader').ajaxSend(function(e) { $(this).show(); });
    $('.loader').ajaxComplete(function() { $(this).hide(); });
  };

  /* ajax callbacks */
  FatPopcorn.watchingServiceSuccess = function(jqxhr) {    
    var data = eval(jqxhr);
    FatPopcorn.item(data).attr('data-watching', data.watching);
  }
  FatPopcorn.watchingServiceFail = function(data) {
    console.log('Watchlist service request failed');
    console.log(data);
    console.log(data.state());
    console.log(data.statusCode());
    console.log(data.getAllResponseHeaders());
    
  }

  FatPopcorn.item = function(data) {
    return $('[data-model="' + data.modelName + '"][data-label="' + data.fieldName + '"]');
  }

  FatPopcorn.newNoteOrAttachmentSuccess = function(dataString) {
    var data = eval(dataString)
    FatPopcorn.item(data).attr('data-stream', data.streamItemsCount);
    
    if (data.streamItemsCount > 0) {
      FatPopcorn.item(data).parents('.fatpopcorn_grip').addClass('has-stream');
      FatPopcorn.item(data).siblings('.stream-items-count').text(data.streamItemsCount);
      if (data.streamItemsCount > 9)
        FatPopcorn.item(data).siblings('.stream-items-count').addClass('two-digits')
      else
        FatPopcorn.item(data).siblings('.stream-items-count').removeClass('two-digits')
    } else {
      FatPopcorn.item(data).parents('.fatpopcorn_grip').removeClass('has-stream');
      FatPopcorn.item(data).siblings('.stream-items-count').empty();
    }
    $('.fatpopcorn textarea#note_text').val('');
    $('.fatpopcorn .active').removeClass('active');
    $('.fatpopcorn .popcorn-body > div:not(.header)').hide();
    $(".fatpopcorn .stream").show();
    $(".fatpopcorn .stream-tab").addClass('active');
    FatPopcorn.getStreamSuccess(data.streamBody);

  };

  FatPopcorn.getStreamSuccess = function(data) {
    $('.fatpopcorn .stream .content').html(data);
    $('.fatpopcorn .stream .attachment span.delete').click(FatPopcorn.deleteAttachment);
    $('.fatpopcorn .stream .note span.delete').click(FatPopcorn.deleteNote);
    $('.fatpopcorn .stream .note span.star').click(FatPopcorn.starUnstar);
  };
  FatPopcorn.deleteAttachment = function(e) {
    FatPopcorn.deleteStream(e, $('.fatpopcorn .edit').attr('data-attach-url'));
  };
  FatPopcorn.deleteNote = function(e) {
    FatPopcorn.deleteStream(e, $('.fatpopcorn .edit').attr('data-note-url'));
  };
  FatPopcorn.deleteStream = function(e, urlPrefix) {
    function _url() {
      return urlPrefix + '/' + $(e.target).parent().attr('data-id');    
    }

    $.post(_url(), {_method: 'delete'}).    
      success('success.rails', FatPopcorn.newNoteOrAttachmentSuccess).
      fail(FatPopcorn.deleteFailure);
  };
  FatPopcorn.starUnstar = function(e, urlPrefix) {
      var url = $(e.target).attr('data-url');
      console.log(url);
      $.post(url, {_method: 'put'}).
          success('success.rails', function(data){
              FatPopcorn.getStreamSuccess(data.streamBody)
          }).
          fail(FatPopcorn.deleteFailure);
  };

  FatPopcorn.deleteSuccess = function() {
    $('.fatpopcorn .stream-tab').click();
  };
  FatPopcorn.deleteFailure = function() {
  };
  FatPopcorn.getHistorySuccess = function(data) { 
    $('.fatpopcorn .history .content').empty();
    $('.fatpopcorn .history .content').append(data);
  };
(function($) {
  $.fn.fatpopcorn = function(options) {

    // plugin default options
    var self = this, defaults = {
      marginBorder: 4,
      arrowWidth: 24,
      marginArrow: 11,
      verticalOffsetFromElement: 26
    };

    // extends defaults with options provided
    if (options) {
      $.extend(defaults, options);
    }
		
    $(window).click(function() { FatPopcorn.hideContainer(); });
		
    FatPopcorn.decorateContainerWithHtml();
    FatPopcorn.activateTheClickedTab();
    FatPopcorn.bindRemoteEvents();
    FatPopcorn.createAttachmentButton();

    function _setUpElement() {
      var $element = $(this), fatpopcorn = new FatPopcorn($element, defaults);
      fatpopcorn.addGripToElement($element);
        
      fatpopcorn.gripOf($element).children().click(function(e) {
        $(e.target).data('elementMatched', true);   
      });

      $('.fatpopcorn_grip .stream-items-count').click(function(e) {
        $(e.target).data('elementMatched', false);
      });

      fatpopcorn.gripOf($element).click(function(e) {        
        if ($(e.target).data('elementMatched')) return;

        e.stopPropagation();
        e.preventDefault();
        fatpopcorn.init();
				
        if (FatPopcorn.containerVisible()) {
          FatPopcorn.hideContainer();
          return;					
        }

        fatpopcorn.inferPositionType();
        fatpopcorn.setContainerPosition();
        fatpopcorn.decorateContainerWithArrow();
        fatpopcorn.containerOf().show();
				
        $(window).on('resize',function() {
          if (FatPopcorn.containerVisible()) fatpopcorn.setContainerPosition();
        });
      });
        
      return this;
    }
    return self.each(_setUpElement);
  }
	
  $.fn.popcorn = function(options) {

    // plugin default options
    var elements = this, defaults = {
      marginBorder: 4,
      arrowWidth: 19,
      marginArrow: 10,
      verticalOffsetFromElement: 20
    };

    // extends defaults with options provided
    if (options) {
      $.extend(delfaults, options);
    }

    $(window).unbind('click').click(function() { Popcorn.hideAllContainers(elements); });

    function _setUpElement(){
      var $element = $(this), popcorn = new Popcorn($element, defaults);

      popcorn.decorateContainerWithHtml();            
      popcorn.inferPositionType();
      popcorn.decorateContainerWithArrow();
      popcorn.setContainerPosition();

      $element.click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        Popcorn.hideAllContainersExcept(elements, this);
        Popcorn.containerOf($element).show();
      });

      $(window).resize(function() {
        popcorn.setContainerPosition();
      });
    }

    return this.each(_setUpElement);

  };
})(jQuery);