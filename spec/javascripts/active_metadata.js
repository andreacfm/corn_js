/*global  window, jQuery, $, active_metadata_uploader, document, qq */
var ActiveMetadata = function(config){

	var instance = this;
	this.attributes = config || {};
	
	if(typeof this.attributes.modelName === undefined || this.attributes.modelId === undefined || this.attributes.token === undefined || this.attributes.current_user === undefined){
		throw("parameters [modelName], [modelId], [token], [current_user] are required");
	}

	this.configs = {
		ajaxLoader : '<div style="text-align:center;padding-top:30px;"><img src="/images/active_metadata/ajax-loader-transparent.gif" class="active_metadata_ajax_loader"></div>'
	};
	

    this.render();
	this.bind();

};

ActiveMetadata.prototype = {
	
	current_label : function(){
		return $(this.current_field).attr('data-label');
	},
	
	current_tab :function(){
		return $('#active_metadata_view #tabs ul li.selected').attr('data-container');
	},

	formActions : function(){
		var notes_form_action = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/notes';
		$('#active_metadata_view #notes_form').attr({'action':notes_form_action});
	},

	get : function(attribute){
		return this.attributes[attribute];
	},

	loadTabData : function(){
		var selectedTab = this.current_tab();
		var $container = $('#active_metadata_view #containers div#' + selectedTab);
		
		switch(selectedTab){
			case 'notes':
				this.fetchNotes();							
			break;

			case 'attachments':
				this.fetchAttachments();
			break;			
			
			case 'history':
				this.fetchHistory();
			break;						
		} 		
		
		$container.attr('data-loaded',true);
	},

	fetchNotes : function(){
		var instance = this;
		var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/notes';
		instance.showLoaderIn('notes_target');
		$.get(url,function(data){
				instance.htmlNotesTarget(data);
			}
		);
	},

	// use this from rails callbacks to fill up the target
	htmlNotesTarget : function(html){
		var instance = this;
		var util = ActiveMetadata.Util;
		$('#notes_target').html(html);

		// any time new content is displayed be sure the submit button is enabled
		util.enableNotesButton();

		// add binds to the incoming html
		$('#notes_target a[data-method="delete"]').bind('ajax:beforeSend', function(){
			util.disableNotesButton();
			instance.showLoaderIn('notes_target');
		});

        // bind the starred checkbox
        $('#notes_target input[name="starred"]').bind('change', function(){
           instance.handleStarringNotes($(this));
        });
		
		//if there are notes be sure icon is displayed if not hide
		if($(html).find('li').length > 0){
			this.showNotesIcon();				
		}else{
			this.hideNotesIcon();
		}
	},
	
	showNotesIcon : function(){
		$('div[data-label=' + this.current_label() + ']').find('img.active_metadata_notes_icon').removeClass('hidden');						
	},
	
	hideNotesIcon : function(){
		$('div[data-label=' + this.current_label() + ']').find('img.active_metadata_notes_icon').addClass('hidden');								
	},

    /************************************
    Starred Notes
    ************************************/
    handleStarringNotes : function(el){
        var $el = $(el);
        var id = $el.attr('data-id')
        if($el.is(':checked')){
            this.starNote(id);
        }else{
            this.unStarNote(id);
        }
    },

    starNote : function(id){
        var instance = this;
        var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/notes/' + id + '/star';
        instance.showLoaderIn('notes_target');
        $.post(url,{_method:"PUT"});
    },

    unStarNote : function(id){
        var instance = this;
        var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/notes/' + id + '/unstar';
        instance.showLoaderIn('notes_target');
        $.post(url,{_method:"PUT"});
    },


    /************************************
    History
    ************************************/

	fetchHistory : function(){
		var instance = this;
		var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/histories';
		instance.showLoaderIn('history_target');
		$.get(url,function(data){
				instance.htmlHistoryTarget(data);
			}
		);
	},

	// use this from rails callbacks to fill up the target
	htmlHistoryTarget : function(html){
		$('#history_target').html(html);
	},

    /***************************
    Attachments
    *****************************/
	fetchAttachments : function(){
		var instance = this;
		var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/attachments';
		instance.showLoaderIn('attachments_target');
		$.get(url,function(data){
			instance.htmlAttachmentsTarget(data);
		});

	},

	// use this from rails callbacks to fill up the target
	htmlAttachmentsTarget : function(html){
		var instance = this;
        var $target =  $('#attachments_target');

        $target.html(html);

		// add binds to the incoming html
		$target.find('a[data-method="delete"]').bind('ajax:beforeSend', function(){
			instance.showLoaderIn('attachments_target');
		});

        // bind the starred checkbox
        $target.find('input[name="starred"]').bind('change', function(){
           instance.handleStarringAttachments($(this));
        });

		//if there are attachments be sure icon is displayed if not hide
		if($(html).find('li').length > 0){
			this.showAttachmentsIcon();				
		}else{
			this.hideAttachmentsIcon();
		}

	},
	
	showAttachmentsIcon : function(){
		$('div[data-label=' + this.current_label() + ']').find('img.active_metadata_attachments_icon').removeClass('hidden');						
	},
	
	hideAttachmentsIcon : function(){
		$('div[data-label=' + this.current_label() + ']').find('img.active_metadata_attachments_icon').addClass('hidden');								
	},


   /*************************
   Handle starred attachments
   **************************/
   handleStarringAttachments : function(el){
       var $el = $(el);
       var id = $el.attr('data-id')
       if($el.is(':checked')){
           this.starAttachment(id);
       }else{
           this.unStarAttachment(id);
       }
   },

   starAttachment : function(id){
       var instance = this;
       var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/attachments/' + id + '/star';
       instance.showLoaderIn('attachments_target');
       $.post(url,{_method:"PUT"});
   },

   unStarAttachment : function(id){
       var instance = this;
       var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/attachments/' + id + '/unstar';
       instance.showLoaderIn('attachments_target');
       $.post(url,{_method:"PUT"});
   },



	showLoaderIn : function(id){
		$('#' + id ).html(this.configs.ajaxLoader);
	},
		
	createUploader : function() {
		var instance = this;
		var label = label;
		var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/attachments';
		active_metadata_uploader = new qq.FileUploader({
			element: document.getElementById('active_metadata_uploader'),
			allowedExtensions: [],
			params: {},
			action: url,
			uploadButtonText: 'Allega',
			multiple: false,
			onComplete: function() {
				instance.fetchAttachments();
				ActiveMetadata.Util.cleanUploaderProgress();
			}
		});		
	},

	replicateTarget : function(){
		var $input_div = $('#active_metadata_view #input_container div#input');
		var value = $(this.current_field).val();
		$input_div.empty().text(value);
	},
	
	setWatchingSwicther : function(){
		var util = ActiveMetadata.Util;
		var watching = $(this.current_field).attr('data-watching');
		if(watching == 'true'){
			$('#active_metadata_view div#watchlist input[name=watching]').attr('checked',true);	
			util.showWatchilistOnMessage();
		}else{
			$('#active_metadata_view div#watchlist input[name=watching]').removeAttr('checked');
			util.showWatchilistOffMessage();
		}
	},


    /***********************************************
     Watching
     ***********************************************/
	handleWatching : function(){
		var $checkbox = $('input[name=watching]');

		if($checkbox.attr('checked')){
			this.startWatching();
		}else{
			this.stopWatching();			
		}
	},
	
	startWatching : function(){
		var instance = this;
		var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/watchers/' + this.get('current_user');
		$.ajax({
			url : url,
			type : 'POST',
			beforeSend : function(){
				instance.showLoaderIn('watchlist_target');
			},
			success : function(data){
				instance.fieldIsWatching(data);
			},
			data : {
				authenticity_token : instance.get('token')
			}
		});
				
	},

	fieldIsWatching : function(){
		var util = ActiveMetadata.Util;
		$(this.current_field).attr('data-watching',true);		
		$('div[data-label=' + this.current_label() + ']').find('img.active_metadata_watchlist_icon').removeClass('hidden');	
		util.showWatchilistOnMessage();	
	},
	
	stopWatching : function(){
		var instance = this;
		var url = '/active_metadata/' + this.get('modelName') + '/' + this.get('modelId') + '/' + this.current_label() + '/watchers/' + this.get('current_user');
		$.ajax({
			url : url,
			type : 'POST',
			beforeSend : function(){
				instance.showLoaderIn('watchlist_target');
			},
			success : function(data){
				instance.fieldIsNotWatching(data);
			},
			data : {
				authenticity_token : instance.get('token'),
				_method : 'delete'
			}
		});
		
	},
	
	fieldIsNotWatching : function(){
		var util = ActiveMetadata.Util;
		$(this.current_field).attr('data-watching',false);		
		$('div[data-label=' + this.current_label() + ']').find('img.active_metadata_watchlist_icon').addClass('hidden');
		util.showWatchilistOffMessage();		
	},
			
	render : function(){
        var html = [];
        html.push('<div id="input_container"><div id="input" class="text"></div></div>');
        html.push('	<div id="tabs"><ul><li class="no_tab"><img src="/images/active_metadata/grip_up.gif"  class="active_metadata_grip_close" /></li><li class="history_tab" data-container="history"></li><li class="watchlist_tab" data-container="watchlist"></li>' +
            '<li class="attachments_tab" data-container="attachments"><li class="first notes_tab" data-container="notes"></li></ul></div>');
        html.push('<div style="clear:both"> </div>');
        //open containers
        html.push('<div id="containers">');
        //notes
        html.push('<div id="notes" data-loaded="false">');
        html.push('<h6>Note inserite</h6><div id="notes_target"></div>');
        html.push('<div class="clear dashed"><img src="/images/active_metadata/dashed.png" /></div>');
        html.push('<h6>Scrivi una nota</h6>');
        html.push('<form action="" method="post" id="notes_form" class="form-proposal">');
        html.push('<div style="margin:0;padding:0;display:inline"><input type="hidden" value="✓" name="utf8"><input type="hidden" value="' + this.get('token') + '" name="authenticity_token"></div>');
        html.push('<div class="textarea-holder"><div class="textarea"><textarea name="note"></textarea></div></div>');
        html.push('<input type="submit"  value="Inserisci" class="submit"/>');
		html.push('</form>');
		html.push('</div>');

        //attachments
        html.push('<div id="attachments" data-loaded="false"><h6>Attachments</h6><div id="active_metadata_uploader"></div><div id="attachments_target"></div></div>');
        //watchlist
        html.push('<div id="watchlist" data-loaded="false"><h6>Watchlist</h6>');
        html.push('<input type="checkbox" name="watching" class="watching_switch"/> Aggiungi il campo alla mia watchlist');
        html.push('<div class="clear dashed"><img src="/images/active_metadata/dashed.png" /></div>');
       	html.push('<div id="watchlist_target"></div>');
		html.push('</div>');
        //history
        html.push('<div id="history" data-loaded="false"><h6>History</h6><div id="history_target"></div></div>');
        //close containers
        html.push('</div>');
        $('#active_metadata_view').html(html.join(' '));
    },

	open : function(){

		// TODO : only fetch data for current tab
		this.formActions();		
		this.replicateTarget();
		this.createUploader();	
		this.setWatchingSwicther();	
		this.show();		
	},

	show : function(){		
		var instance = this;
		var offset = this.calculateOffset();
		$.blockUI({
			message:$('#active_metadata_view'),
			css :{
				backgroundColor : "#dce6ee",
				border: "1px solid #7d9ab4",
				width : 350,
				top	: offset.top,
				left : offset.left,
				color : "#333"
			},
			overlayCSS:  {
			        backgroundColor: 'transparent',
			        opacity:         0.6
			}
		});
		$('.blockUI.blockPage').css('position','absolute'); 
		$('.blockOverlay').attr('title','Click per chiudere la finestra').click(function(){
			instance.close();
		});
	},
	
	fixViewPosition : function(){
		var offset = this.calculateOffset();
		$('div.blockPage').css({
			left : offset.left,
			top : offset.top
		});
	},
	
	calculateOffset : function(){
		var _offset;
		var $current = $(this.current_field);
		
		// if current_field is a radio (23 states) looks for the offset of the first label
		if($current.attr('type') == 'radio'){
			_offset = $current.next().offset();
		}else{
			_offset = $current.offset();
		}
		return _offset;
	},
	
	close : function(){
		var util = ActiveMetadata.Util;
		util.resetContainersDataFlag();
		$.unblockUI();
	},
	
	bind : function(){

		var util = ActiveMetadata.Util;
		var instance = this;

        //bind the notes form to submit rails event
        $('#active_metadata_view div#notes form#notes_form').bind('submit.rails', function (e) {
            $(this).callRemote();
            e.preventDefault();
        });

		// bind the watchlist checkbox
		$('#active_metadata_view div#watchlist input[name=watching]').change(function(){
			instance.handleWatching();
		});

        //notes form button
        $('#notes_form .submit').click(function(){
            util.disableNotesButton();
            instance.showLoaderIn('notes_target');
        });

        // bind all the grip
		$('.active_metadata_grip').click(function(){
			var label = $(this).attr('data-label');
			instance.current_field = $('.active_metadata_field').filter('[data-label=' + label + ']');
			// click the default tab
			$('#active_metadata_view #tabs ul li.notes_tab').trigger('click');			
			instance.open();
		});
		
		//bind icons
		$('img.active_metadata_watchlist_icon, img.active_metadata_notes_icon, img.active_metadata_attachments_icon').click(function(){
			var label = $(this).attr('data-label');
			instance.current_field = $('.active_metadata_field').filter('[data-label='+ label +']');
			// click the correct tab
			$('#active_metadata_view #tabs li[data-container='+ $(this).attr("data-tab") +']').trigger('click');
			instance.open();
		});


        // defaults selections
		$('#active_metadata_view #tabs li.notes_tab').addClass('selected');

		$('#active_metadata_view #containers').children().each(function(index,el){
			var id = $(el).attr('id');
			if(id == 'notes'){
				util.showContainer(el);
			}else{
				util.hideContainer(el);
			}
		});

		$('#active_metadata_view #tabs li').filter(':not(.no_tab)').click(function(){
			var data = $(this).attr('data-container');
			// select the actual tab
			$('#active_metadata_view #tabs li').removeClass('selected');
			$(this).addClass('selected');

			// hide show the containers
			var $container = $('#active_metadata_view #containers div#' + data);
			util.hideContainers();
			util.showContainer($container);			
			
			//load the data for the selected tab if not already loaded
			if($container.attr('data-loaded') == 'false'){
				instance.loadTabData();
			} 
			
		});

		$('#active_metadata_view .active_metadata_grip_close').attr('title','Click per chiudere la finestra').click(function(){
			instance.close();
		});
				
		//window resize
		$(window).resize(function() {
			if(instance.current_field !== undefined ){
				instance.fixViewPosition();				
			}
		});

		// window scroll
		$(window).scroll(function() {
			if(instance.current_field !== undefined ){
				instance.fixViewPosition();				
			}
		});

	}
	
};

// UTIL
ActiveMetadata.Util ={
	
	resetContainersDataFlag : function(){
		$('#containers').children().attr('data-loaded', false);
	},
	
	showContainer :function(el){
		$(el).removeClass('hidden');
	},

	hideContainer :function(el){
		$(el).addClass('hidden');
	},

	hideContainers : function(){
		var instance = this;
		$('#active_metadata_view #containers').children().each(function(index,el){
			ActiveMetadata.Util.hideContainer(el);
		});
	},

	disableNotesButton : function(){
		$('#notes_form .submit').attr('disabled',true);
	},

	enableNotesButton : function(){
		$('#notes_form .submit').removeAttr('disabled');
	},
	
	cleanUploaderProgress : function(){
		$('div#attachments ul.qq-upload-list').empty();
	},
	
	showWatchilistOffMessage : function(){
		$('div#watchlist_target').html('Watchlist inattiva');				
	},
	
	showWatchilistOnMessage : function(){
		$('div#watchlist_target').html('Sarai informato sulle modifiche inerenti al campo selezionato');				
	}

};