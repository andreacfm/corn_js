var Popcorn = function($element, defaults) {
  this.$element = $element;
  this.defaults =  defaults;
};

Popcorn.prototype.decorateContainerWithHtml = function() {
  if (this.positionType) {
    throw "inferPositionType must be called after decorateContainerWithHtml";
  }
  this.containerOf().hide().addClass('popcorn');
  this.containerOf().contents().wrap("<div class='popcorn-body'/>");
  this.containerOf().append("<div class='popcorn-tail'></div>");
};

Popcorn.prototype.inferPositionType = function() {
  var self = this;

  function _createPositionType(defaults) {
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
  this.top = function() { return popcorn.$element.offset().top + popcorn.defaults.verticalOffsetFromElement };
};

var RightPosition = function(popcorn) {
  this.leftOffset = function() { return popcorn.containerOf().width() - (popcorn.defaults.arrowWidth + popcorn.defaults.marginArrow);	}
  this.left = function() { return $('html').width() - popcorn.defaults.marginBorder - popcorn.containerOf().width(); }
  this.top = function() { return popcorn.$element.offset().top + popcorn.defaults.verticalOffsetFromElement };
};

var CenterPosition = function(popcorn) {
  this.leftOffset = function() { return popcorn.containerOf().width() / 2 - Math.floor(popcorn.defaults.arrowWidth / 2); }
  this.left = function() {                                                                  
    var middleOfElement = Popcorn.calculateMiddle(popcorn.$element.offset().left, popcorn.$element.width());
    return Popcorn.calculateLeftOffset(middleOfElement, popcorn.containerOf().width());
  }
  this.top = function() { return popcorn.$element.offset().top + popcorn.defaults.verticalOffsetFromElement };
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
  var middleOfElement = Popcorn.calculateMiddle(this.$element.offset().left, this.$element.width());
  var rightOffset = middleOfElement + this.containerOf().width() / 2;
  return ($('html').width() - (rightOffset + this.defaults.marginBorder)) < 0;
}

Popcorn.prototype.collideLeft = function() {
  return (Popcorn.calculateLeftOffset(this.middleOf(), this.containerOf().width()) - this.defaults.marginBorder) < 0;
}

Popcorn.prototype.middleOf = function() {
  return Popcorn.calculateMiddle(this.$element.offset().left, this.$element.width());
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
    return typeof options.modelName === undefined || 
    options.modelId === undefined || 
    options.token === undefined || 
    options.current_user === undefined;
  };
  var self = this;

  self.$element = $element;
  self.defaults = defaults;
  self.attributes = defaults;
  this.get = function(option) {
    return self.defaults[option];
  }
	
  if (_checkOptions(self.defaults)){
    throw("parameters [modelName], [modelId], [token], [current_user] are required");
  }
};
FatPopcorn.prototype = new Popcorn();

// // all'inizializzazione dello stream fa una richiesta e mostra la rotella di caricamento
// // all'arrivo della risposta toglie la rotella di caricamento e mostra lo stream arrivato
// FatPopcorn.prototype.initStream = function() {
// 	this.requestStream(onArrivedStream);
// 	this.showSpinner();
// };
// FatPopcorn.prototype.onArrivedStream = function() {
// 	this.hideSpinner();
// 	this.showStream();
// };
// FatPopcorn.prototype.initEdit = function() {
// 	
// };
// FatPopcorn.prototype.initHistory = function() {
// 	
// };
	
FatPopcorn.prototype.initEdit = function() {
  this.setupFormAction();
  this.setupFormToken();
	
};	
FatPopcorn.prototype.actionUrl = function() {
  return '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.currentLabel() + '/notes';
};
FatPopcorn.prototype.setupFormAction = function() {
  $('.fatpopcorn #notes_form').attr('action', this.actionUrl());
};
FatPopcorn.prototype.setupFormToken = function() {
  $('.fatpopcorn #notes_form input[name="authenticity_token"]').val(this.get('token'));
};
FatPopcorn.prototype.currentLabel = function() {
  return this.$element.attr('data-label');
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

FatPopcorn.decorateContainerWithHtml = function() {
  var self = this;
  function _html() {
    return '<div class="fatpopcorn"><div class="popcorn-body"><div class="header"><ul><li class="stream-tab active"><div>stream</div></li>' +
    '<li class="edit-tab"><div>edit</div></li><li class="history-tab"><div>history</div></li></ul></div>' +
    '<div class="stream"><div class="content"></div></div><div class="history"><div class="content"></div></div>' +
    '<div class="edit"><div class="watchlist"><h1>Watchlist</h1><div class="on-off _23states"><input type="radio" ' +
    'name="on" value="on" id="on"><label for="on" class="true"><span class="true">On</span></label><input type="radio" name="off" value="off" id="off"><label for="off" class="false">' +
    '<span class="false">Off</span></label></div></div><hr/><div class="note"><h1>Nota</h1><form form action="" method="post" id="notes_form"><div style="margin:0;padding:0;display:inline"><input type="hidden" value="✓" name="utf8"><input type="hidden" value="' + self['token'] + '" name="authenticity_token"></div>' +
    '<textarea name="note" rows="4"></textarea><a id="send_note" href="#">Inserisci</a></form></div><hr/>' +
    '<div class="attachment"><h1>Allegati</h1><a href="#">Inserisci</a></div><div class="info"><h1>Info</h1><p>Lorem ipsum...</p></div></div></div><div class="popcorn-tail"></div><span class="loader"></span></div>';
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
  function _tabBodyName(tabName) {	return '.' + tabName.split('-')[0].trim(); }
  $('.fatpopcorn .header > ul > li').click(function(e){
    e.stopPropagation();
    e.preventDefault();
    $('.fatpopcorn .active').removeClass('active');
    $('.fatpopcorn .popcorn-body > div:not(.header)').hide();
    $(_tabBodyName($(this).attr('class'))).show();
    $(this).addClass('active');
  });				
};

FatPopcorn.containerVisible = function () {
  return FatPopcorn.container().is(':visible');
};

FatPopcorn.bindRemoteEvents = function() {
  $('.fatpopcorn').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
  });			
  $('#send_note').on('click',function() {
    $.post($('form#notes_form').attr('action'), $('form#notes_form').serialize())
    .success(FatPopcorn.newNoteSuccess);
  });
  $('.loader').ajaxSend(function(e) {
    $(this).show();		
  });
  $('.loader').ajaxComplete(function() {
    $(this).hide();
  });
};

FatPopcorn.prototype.newNoteSuccess = function() { $('.stream-tab').click(); };

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

    function _setUpElement() {
      var $element = $(this), fatpopcorn = new FatPopcorn($element, defaults);
      fatpopcorn.addGripToElement($element);
        
      fatpopcorn.gripOf($element).children().click(function(e) {
        $(e.target).data('elementMatched', true);        
      });

      fatpopcorn.gripOf($element).click(function(e) {
        if ($(e.target).data('elementMatched')) return;
        
        e.stopPropagation();
        e.preventDefault();
        fatpopcorn.initEdit();
				
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

    $(window).click(function() { Popcorn.hideAllContainers(elements); });

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