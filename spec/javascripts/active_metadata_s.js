describe("ActiveMetadata", function() {

	beforeEach(function() {
		loadFixtures('active_metadata.html');
		var button = $('#notes_form .submit');
		$(button).click(function(e){
			e.preventDefault();
		})	  	
		var opts = {modelName:'modelName', modelId :1, token : 'TOKEN', current_user:1, watching:true}; 
		am = new ActiveMetadata(opts);
	});

	afterEach(function() {
		$.unblockUI();
		jasmine.getFixtures().cleanUp();
	});

	describe("loading", function() {
		it("should define active_meta object", function() {
			expect(ActiveMetadata).toBeDefined();
		});	
		it("should verify that layer is not visible", function() {
			expect($('#active_metadata_view')).not.toBeVisible();
		});
	});

	describe("initialization", function() {

		it("should require modelName", function() {
			var opts = {}; 
			expect(function(){new ActiveMetadata(opts)}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
		});

		it("should require modelId", function() {
			var opts = {modelName:'modelName'}; 
			expect(function(){new ActiveMetadata()}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
		});

		it("should require form token", function() {
			var opts = {modelName:'modelName', modelId :1}; 
			expect(function(){new ActiveMetadata()}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
		});

		it("should require current_user", function() {
			var opts = {modelName:'modelName', modelId :1, token : 'TOKEN'}; 
			expect(function(){new ActiveMetadata(opts)}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
		});

		it("should correctly configure modelName", function() {
			expect(am.get("modelName")).toBeTruthy('modelName');
		});

		it("should correctly configure modelId", function() {
			expect(am.get("modelId")).toBeTruthy(1);
		});

		it("should correctly configure token", function() {
			expect(am.get("token")).toBeTruthy('TOKEN');
		});

		it("should correctly configure current_user", function() {
			expect(am.get("current_user")).toBeTruthy(1);
		});

		it("should verify that layer contains the form for creating new notes", function() {
			expect($('#active_metadata_view')).toContain('form#notes_form');
		});

		it("should attach click events to any active_metadata_grip element", function() {
			expect($('.active_metadata_grip')).toHandle('click');
		});

		it("should set note tab selected by default", function() {
			expect($('#tabs li.notes_tab')).toHaveClass('selected');
		});

		it("should set notes container visible by default", function() {
			expect($('#containers div#notes')).not.toHaveClass('hidden');
		});

		it("should set containers except note invisible by default", function() {
			expect($('#containers div#history')).toHaveClass('hidden');
			expect($('#containers div#watchlist')).toHaveClass('hidden');
			expect($('#containers div#attachments')).toHaveClass('hidden');
		});

		it("should add to the grip close image the ability to unblock the screen", function() {
			expect($('#active_metadata_view .active_metadata_grip_close')).toHandle('click');
			$('.active_metadata_grip_close').first().trigger('click');
			$('#active_metadata_view .active_metadata_grip_close').trigger('click');
			expect($('#active_metadata_view')).not.toBeVisible();							
		});

		it("should verify that notes form handle submit.rails event", function(){
			mock = sinon.mock(jQuery);
			var $form = $('form#notes_form');
			$form.attr('action','/test/1')
			$form.trigger('submit');

			mock.expects("ajax").once();
			mock.verify();
			mock.restore();
		});

		it("should verify that form notes has been added with the provided token",function(){
			var $form = $('form#notes_form');
			expect($form).toContain('input[name="authenticity_token"]');
			expect($('input[name="authenticity_token"]')).toHaveValue('TOKEN');
		});

		it("should verify that exists the hook element for the uploader", function() {
			expect($('#containers div#attachments')).toContain('#active_metadata_uploader');	
		});

		it("should verify that all containers have data-loaded = false", function() {
			expect($('div[data-loaded=false]').length).toEqual($('#containers').children().length);
		});

		it("should verify that active_metadata icons are binded to click event", function() {
			$('img.active_metadata_watchlist_icon, img.active_metadata_notes_icon, img.active_metadata_attachments_icon').each(function(){
				expect($(this)).toHandle('click');
			})
		});

	});

	describe("instance currents", function() {

		it("should record the actual field when view is displayed", function() {
			var $grip = $('.active_metadata_grip').first();
			var field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			$grip.trigger('click');
			expect($(am.current_field).attr('data-label')).toEqual($(field).attr('data-label'));
		});

		it("should return the correct label for the current_field", function() {
			var $grip = $('.active_metadata_grip').first();
			var field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			$grip.trigger('click');
			expect(am.current_label()).toEqual($(field).attr('data-label'));		  
		});

		it("should return the current tab selected except if no_tab class exists", function() {
			$('#tabs li').each(function(){
                $tab = $(this)
                if(!$tab.hasClass('no_tab')){
                    $(this).trigger('click');
                    expect(am.current_tab()).toEqual($(this).attr('data-container'));
                }
			})
		});
	});

	describe("notes", function() {

		it("should fill notes target with the provided html", function() {
			am.htmlNotesTarget('<li class="note">pippo</li>');
			expect($("#notes_target")).toContain('li.note');	
		});

		it("should load notes invoking the correct url", function() {			
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			mock = sinon.mock(jQuery);
			mock.expects("get").withArgs('/active_metadata/modelName/1/' + $field.attr('data-label') + '/notes').once();

			am.fetchNotes();
			mock.verify();
			mock.restore();
		});

		it("should load notes into the notes target element", function() {			
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;
			sinon.stub(jQuery, "get").callsArgWith(1,'<li class="note">pippo</li>')
			am.fetchNotes();
			expect($("#notes_target")).toContain('li.note');
			jQuery.get.restore();
		});

		it("should display the ajax loader before notes are displayed", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			var mock = sinon.mock(am);
			mock.expects('showLoaderIn').withArgs('notes_target').once();
			am.fetchNotes();
			mock.verify();
			mock.restore();			
		});

		it("should manage the notes form action when view is opened", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			var label = $field.attr('data-label');
			$grip.trigger('click');			
			var expectedAction = "/active_metadata/modelName/1/" + label + "/notes";
			expect($('#active_metadata_view #notes_form').attr('action')).toEqual(expectedAction); 
		});

		it("should disable the submit button of the notes form when clicked", function() {
			var button = $('#notes_form .submit');
			$(button).trigger('click');
			expect($(button)).toBeDisabled();
		});

		it("should enable submit notes", function() {
			var button = $('#notes_form .submit');
			$(button).trigger('click');
			expect($(button)).toBeDisabled();
			ActiveMetadata.Util.enableNotesButton();	
			expect($(button)).not.toBeDisabled();
		});

		it("should verify that elimina note link is binded to the ajax:beforeSend event", function() {
			am.htmlNotesTarget('<a data-method="delete">Elimina</li>');
			var el = $('#notes_target a[data-method="delete"]');
			expect($(el)).toHandle('ajax:beforeSend');		  
		});

		it("should make the notes icon visible when notes exists", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			var $icon = $('div[data-label=' + am.current_label() +']').find('.active_metadata_notes_icon');

			expect($icon).toHaveClass('hidden');
			am.htmlNotesTarget('<ul><li><a data-method="delete">Elimina</a></li></ul>');
			expect($icon).not.toHaveClass('hidden');

		});

		it("should hide the notes icon if no notes exists", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			var $icon = $('div[data-label=' + am.current_label() +']').find('.active_metadata_notes_icon');
			$icon.removeClass('hidden');

			expect($icon).not.toHaveClass('hidden');
			am.htmlNotesTarget('<ul></ul>');
			expect($icon).toHaveClass('hidden');

		});

        describe("starred", function(){

            it("should verify that starred checkbox is binded to onchange", function() {
                am.htmlNotesTarget('<input type="checkbox" name="starred" value="true">');
                var el = $('#notes_target input[name="starred"]');
                expect($(el)).toHandle('change');
            });

            it("should call the star route if starred checkbox is checked", function(){
                sinon.spy(jQuery, "post");

                var $grip = $('.active_metadata_grip').first();
                var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
                am.current_field = $field;

                am.htmlNotesTarget('<input type="checkbox" name="starred" value="true" data-id="2">');
                var $el = $('#notes_target input[name="starred"]');
                $el.attr('checked','checked');


                $el.trigger('change');

                var url = '/active_metadata/modelName/1/' + $field.attr('data-label') + '/notes/' + $el.attr('data-id') + '/star';
                expect(jQuery.post.getCall(0).args[0]).toEqual(url);
                expect(jQuery.post.getCall(0).args[1]["_method"]).toEqual("PUT");

                jQuery.post.restore();

            })

            it("should starNote show the loading icon", function(){
                var spy = sinon.spy(am, "showLoaderIn");
                am.starNote(2);
                expect(spy.calledOnce).toBeTruthy();
                expect(spy.calledWithExactly('notes_target')).toBeTruthy();
                spy.restore();
            })

            it("should call the unstar route if starred checkbox is checked", function(){
                sinon.spy(jQuery, "post");

                var $grip = $('.active_metadata_grip').first();
                var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
                am.current_field = $field;

                am.htmlNotesTarget('<input type="checkbox" name="starred" value="true" data-id="2">');
                var $el = $('#notes_target input[name="starred"]');

                $el.trigger('change');

                var url = '/active_metadata/modelName/1/' + $field.attr('data-label') + '/notes/' + $el.attr('data-id') + '/unstar';
                expect(jQuery.post.getCall(0).args[0]).toEqual(url);
                expect(jQuery.post.getCall(0).args[1]["_method"]).toEqual("PUT");

                jQuery.post.restore();

            })

            it("should unStarNote show the loading icon", function(){
                var spy = sinon.spy(am, "showLoaderIn");
                am.unStarNote(2);
                expect(spy.calledOnce).toBeTruthy();
                expect(spy.calledWithExactly('notes_target')).toBeTruthy();
                spy.restore();
            })

        });

	});

	describe("history", function() {

		it("should load history into the history_target element", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			sinon.stub(jQuery, "get").callsArgWith(1, '<li class="history">valore</li>');
			am.fetchHistory();
			expect($("#history_target")).toContain('li.history');		  
			jQuery.get.restore();
		});

		it("should load history invoking the correct url", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			mock = sinon.mock(jQuery);
			mock.expects("get").withArgs('/active_metadata/modelName/1/'+ $field.attr('data-label') +'/histories').once();
			am.fetchHistory();
			mock.verify();
			mock.restore();
		});

		it("should fill history target with the provided html", function() {
			am.htmlHistoryTarget('<li class="history">valore</li>');
			expect($("#history_target")).toContain('li.history');	
		});

	});

	describe("attachments", function() {

		it("should fill the attachments target url with the passed html", function() {
			am.htmlAttachmentsTarget('<li class="attach">file</li>');
			expect($("#attachments_target")).toContain('li.attach');	

		});

		it("should load attachments invoking the correct url", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			mock = sinon.mock(jQuery);
			mock.expects("get").withArgs('/active_metadata/modelName/1/'+ $field.attr('data-label') +'/attachments').once();
			am.fetchAttachments();
			mock.verify();
			mock.restore();
		});

		it("should load attachments into the attachment_target element", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			sinon.stub(jQuery, "get").callsArgWith(1, '<li class="attach">file</li>');
			am.fetchAttachments();
			expect($("#attachments_target")).toContain('li.attach');		  
			jQuery.get.restore();
		});

		it("should display the ajax loader before attachments are displayed", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			var mock = sinon.mock(am);
			mock.expects('showLoaderIn').withArgs('attachments_target').once();
			am.fetchAttachments();
			mock.verify();
			mock.restore();			
		});

		it("should verify that when view is displayed the uploader js object has been created", function() {
			var $grip = $('.active_metadata_grip').first();
			$grip.trigger('click');
			expect(active_metadata_uploader).toBeDefined();
		});

		it("should verify that the created uploader point to the correct route", function() {
			var $grip = $('.active_metadata_grip').last();
			var label = $grip.attr('data-label');
			$grip.trigger('click');
			var expected_action = '/active_metadata/modelName/1/' + label + '/attachments';
			expect(active_metadata_uploader._options.action).toEqual(expected_action);	
		});


		it("should make the notes icon visible when at least one attachment exists", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			var $icon = $('div[data-label=' + am.current_label() +']').find('.active_metadata_attachments_icon');

			expect($icon).toHaveClass('hidden');
			am.htmlAttachmentsTarget('<ul><li></li></ul>');
			expect($icon).not.toHaveClass('hidden');

		});

		it("should hide the notes icon if no attachments exists", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			var $icon = $('div[data-label=' + am.current_label() +']').find('.active_metadata_attachments_icon');
			$icon.removeClass('hidden');

			expect($icon).not.toHaveClass('hidden');
			am.htmlAttachmentsTarget('<ul></ul>');
			expect($icon).toHaveClass('hidden');

		});

        describe("starred", function(){

            it("should verify that starred checkbox is binded to onchange", function() {
                am.htmlAttachmentsTarget('<input type="checkbox" name="starred" value="true">');
                var el = $('#attachments_target input[name="starred"]');
                expect($(el)).toHandle('change');
            });

            it("should call the star route if starred checkbox is checked", function(){
                sinon.spy(jQuery, "post");

                var $grip = $('.active_metadata_grip').first();
                var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
                am.current_field = $field;

                am.htmlAttachmentsTarget('<input type="checkbox" name="starred" value="true" data-id="2">');
                var $el = $('#attachments_target input[name="starred"]');
                $el.attr('checked','checked');


                $el.trigger('change');

                var url = '/active_metadata/modelName/1/' + $field.attr('data-label') + '/attachments/' + $el.attr('data-id') + '/star';
                expect(jQuery.post.getCall(0).args[0]).toEqual(url);
                expect(jQuery.post.getCall(0).args[1]["_method"]).toEqual("PUT");

                jQuery.post.restore();

            })

            it("should starAttacment show the loading icon", function(){
                var spy = sinon.spy(am, "showLoaderIn");
                am.starAttachment(2);
                expect(spy.calledOnce).toBeTruthy();
                expect(spy.calledWithExactly('attachments_target')).toBeTruthy();
                spy.restore();
            })

            it("should call the unstar route if starred checkbox is checked", function(){
                sinon.spy(jQuery, "post");

                var $grip = $('.active_metadata_grip').first();
                var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
                am.current_field = $field;

                am.htmlAttachmentsTarget('<input type="checkbox" name="starred" value="true" data-id="2">');
                var $el = $('#attachments_target input[name="starred"]');

                $el.trigger('change');

                var url = '/active_metadata/modelName/1/' + $field.attr('data-label') + '/attachments/' + $el.attr('data-id') + '/unstar';
                expect(jQuery.post.getCall(0).args[0]).toEqual(url);
                expect(jQuery.post.getCall(0).args[1]["_method"]).toEqual("PUT");

                jQuery.post.restore();

            })

            it("should unStarNote show the loading icon", function(){
                var spy = sinon.spy(am, "showLoaderIn");
                am.unStarAttachment(2);
                expect(spy.calledOnce).toBeTruthy();
                expect(spy.calledWithExactly('attachments_target')).toBeTruthy();
                spy.restore();
            })

        });

	});

	describe("watchlist", function() {

		it("should check the watcher flag when the view is opened if input data-watching is true", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			// set watching to true
			$field.attr('data-watching',true);
			$grip.trigger('click');
			expect($('input[name="watching"]')).toBeChecked();		  
		});

		it("should check the watcher flag when the view is opened if input data-watching is false", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			// set watching to true
			$field.attr('data-watching',false);
			$grip.trigger('click');
			expect($('input[name="watching"]').attr('checked')).toEqual(false);		  
		});

		it("should verify that checkbox is binded to onChange", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			// set watching to true
			$field.attr('data-watching',false);
			$grip.trigger('click');
			expect($('input[name="watching"]')).toHandle('change');		  		  
		});

		it("should call stopWatching when watching is unchecked", function() {
			var spy = sinon.spy(am,'stopWatching');
			$('input[name="watching"]').attr('checked',false);
			$('input[name="watching"]').trigger('change');
			expect(spy.calledOnce).toBeTruthy();
		});

		it("should call startWatching when watching is check", function() {
			var spy = sinon.spy(am,'startWatching');
			$('input[name="watching"]').attr('checked',true);
			$('input[name="watching"]').trigger('change');
			expect(spy.calledOnce).toBeTruthy();
		});

		it("should verify that startWatching is invoked with the correct params", function() {
			sinon.spy(jQuery, "ajax");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			$('input[name="watching"]').attr('checked',true);
			$('input[name="watching"]').trigger('change');

			var expected_url = '/active_metadata/' + am.get('modelName') + '/' + am.get('modelId') + '/' + am.current_label() + '/watchers/' + am.get('current_user');
			expect(jQuery.ajax.getCall(0).args[0].url).toEqual(expected_url);
			expect(jQuery.ajax.getCall(0).args[0].data['authenticity_token']).toEqual(am.get('token'));
			expect(jQuery.ajax.getCall(0).args[0].type).toEqual('POST');

			jQuery.ajax.restore(); 
		});


		it("should verify that stopWatching is invoked with the correct params", function() {
			sinon.spy(jQuery, "ajax");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			$('input[name="watching"]').attr('checked',false);
			$('input[name="watching"]').trigger('change');

			var expected_url = '/active_metadata/' + am.get('modelName') + '/' + am.get('modelId') + '/' + am.current_label() + '/watchers/' + am.get('current_user');
			expect(jQuery.ajax.getCall(0).args[0].url).toEqual(expected_url);
			expect(jQuery.ajax.getCall(0).args[0].data['authenticity_token']).toEqual(am.get('token'));
			expect(jQuery.ajax.getCall(0).args[0].type).toEqual('POST');
			expect(jQuery.ajax.getCall(0).args[0].data['_method']).toEqual('delete');

			jQuery.ajax.restore(); 
		});

		it("should verify that after startWatching has success the target dom element is updated", function() {
			sinon.spy(jQuery, "ajax");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			$field.attr('data-watching',false);
			am.current_field = $field;

			expect($field.attr('data-watching')).toEqual('false');

			$('input[name="watching"]').attr('checked',true);			
			$('input[name="watching"]').trigger('change');

			// invoke onSuccess
			jQuery.ajax.getCall(0).args[0].success();

			expect($field.attr('data-watching')).toEqual('true');

			jQuery.ajax.restore(); 

		});


		it("should verify that after stopWatching has success the target dom element is updated", function() {
			sinon.spy(jQuery, "ajax");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			$field.attr('data-watching',true);
			am.current_field = $field;

			expect($field.attr('data-watching')).toEqual('true');

			$('input[name="watching"]').attr('checked',false);			
			$('input[name="watching"]').trigger('change');

			// invoke onSuccess
			jQuery.ajax.getCall(0).args[0].success();

			expect($field.attr('data-watching')).toEqual('false');

			jQuery.ajax.restore(); 

		});

		it("should display the correct message when view is opened depending on the watching status", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			// set watching to true
			$field.attr('data-watching',false);
			$grip.trigger('click');

			expect($('div#watchlist_target')).toHaveText(/Watchlist inattiva/);		  		  		  

			$('.blockOverlay').trigger('click');

			$field.attr('data-watching',true);
			$grip.trigger('click');

			expect($('div#watchlist_target')).toHaveText(/Sarai informato sulle modifiche inerenti al campo selezionato/);		  		  		  
		});

		it("should display the correct message when view the watching status change", function() {			
			//clean the target
			$('div#watchlist_target').empty();

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			am.fieldIsNotWatching();			

			expect($('div#watchlist_target')).toHaveText(/Watchlist inattiva/);		  		  		  

			//clean the target
			$('div#watchlist_target').empty();

			am.fieldIsWatching();			

			expect($('div#watchlist_target')).toHaveText(/Sarai informato sulle modifiche inerenti al campo selezionato/);		  		  		  
		});

		it("should show the watchlist icon if fieldIsWatching", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			am.current_field = $field;

			var $icon = $('div[data-label=' + am.current_label() +']').find('.active_metadata_watchlist_icon');

			expect($icon).toHaveClass('hidden');			
			am.fieldIsWatching();			
			expect($icon).not.toHaveClass('hidden');			

		});

		it("should hide the watchlist icon if fieldIsNotWatching", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			am.current_field = $field;

			var $icon = $('div[data-label=' + am.current_label() +']').find('.active_metadata_watchlist_icon');
			$icon.removeClass('hidden')

			expect($icon).not.toHaveClass('hidden');			
			am.fieldIsNotWatching();			
			expect($icon).toHaveClass('hidden');			

		});

		it("should display the loading icon when creating a watching", function() {
			var spy = sinon.spy(am,'showLoaderIn');

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			$('input[name="watching"]').attr('checked',true);
			$('input[name="watching"]').trigger('change');

			expect(spy.calledWith('watchlist_target')).toBeTruthy();

		});

		it("should display the loading icon when deleting a watching", function() {
			var spy = sinon.spy(am,'showLoaderIn');

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			$('input[name="watching"]').attr('checked',false);
			$('input[name="watching"]').trigger('change');

			expect(spy.calledWith('watchlist_target')).toBeTruthy();

		});

	});

	describe("interaction", function() {


		it("should verify that when the view is opened using the grip assets are loaded only for the selected tab", function() {
			var spy = sinon.spy(jQuery, "ajax");

			var $grip = $('.active_metadata_grip').first();
			var label = $grip.attr('data-label');
			$grip.trigger('click');

			var args = jQuery.ajax.getCall(0).args[0]
			expect(args.url).toBe("/active_metadata/modelName/1/" + label + "/notes");
			expect(spy.calledOnce).toBeTruthy();	

			jQuery.ajax.restore();
		});

		it("should verify that tab attachments is clicked data are loaded", function() {
			var spy = sinon.spy(jQuery, "ajax");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			$('#tabs li.attachments_tab').trigger('click');

			var args = jQuery.ajax.getCall(0).args[0]
			expect(args.url).toBe("/active_metadata/modelName/1/" + $field.attr('data-label') + "/attachments");
			expect(spy.calledOnce).toBeTruthy();	

			jQuery.ajax.restore();
		});

		it("should verify that tab history is clicked data are loaded", function() {
			var spy = sinon.spy(jQuery, "ajax");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			$('#tabs li.history_tab').trigger('click');

			var args = jQuery.ajax.getCall(0).args[0]
			expect(args.url).toBe("/active_metadata/modelName/1/" + $field.attr('data-label') + "/histories");
			expect(spy.calledOnce).toBeTruthy();	

			jQuery.ajax.restore();
		});

		it("should verify that when notes icon is clicked note tab is selcted, container visible and data is loaded and view opened", function() {
			var spy = sinon.spy(jQuery, "ajax");
			var spy_open = sinon.spy(am, "open");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			am.current_field = $field;

			$('.active_metadata_notes_icon').first().trigger('click');

			expect($('.notes_tab')).toHaveClass('selected');
			expect($('#containers div#notes')).not.toHaveClass('hidden');
			
			var args = jQuery.ajax.getCall(0).args[0]
			expect(args.url).toBe("/active_metadata/modelName/1/" + $field.attr('data-label') + "/notes");

			expect(spy.calledOnce).toBeTruthy();	
			expect(spy_open.calledOnce).toBeTruthy();	

			jQuery.ajax.restore();
		});


		it("should verify that when attachments icon is clicked note tab is selcted, container visible and data is loaded and view opened", function() {
			var spy = sinon.spy(jQuery, "ajax");
			var spy_open = sinon.spy(am, "open");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			am.current_field = $field;

			$('.active_metadata_attachments_icon').first().trigger('click');

			expect($('.attachments_tab')).toHaveClass('selected');
			expect($('#containers div#attachments')).not.toHaveClass('hidden');
			
			var args = jQuery.ajax.getCall(0).args[0]
			expect(args.url).toBe("/active_metadata/modelName/1/" + $field.attr('data-label') + "/attachments");

			expect(spy.calledOnce).toBeTruthy();	
			expect(spy_open.calledOnce).toBeTruthy();	

			jQuery.ajax.restore();
		});

		it("should verify that when watchlist icon is clicked note tab is selcted, container is visible and view opened", function() {
			var spy_open = sinon.spy(am, "open");

			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');
			am.current_field = $field;

			$('.active_metadata_notes_icon').first().trigger('click');

			expect($('.notes_tab')).toHaveClass('selected');
			expect($('#containers div#notes')).not.toHaveClass('hidden');
			expect(spy_open.calledOnce).toBeTruthy();	
		});


		it("should verify that when window is closed all containers data-loaded are resetted to false", function() {
			var spy = sinon.spy(ActiveMetadata.Util,'resetContainersDataFlag')

			var $grip = $('.active_metadata_grip').first();
			$grip.trigger('click');
			$('#containers').children().attr('data-loaded', true);

			$('.blockOverlay').trigger('click');

			expect(spy.called).toBeTruthy();
			expect($('div[data-loaded=true]').length).toEqual(0);

		});


		it("should close the view when clicking on the overlay", function() {
			spy = sinon.spy(jQuery,'unblockUI');

			$('.active_metadata_grip').first().trigger('click');
			$('.blockOverlay').trigger('click');
			expect(spy.called).toBeTruthy();	

			jQuery.unblockUI.restore();

		});


		it("should show the containers accordingly with the tabs selected", function() {
			var tabs = $('#active_metadata_view #tabs li');
			var containers = $('#active_metadata_view #containers').children();

			var tabClicked = tabs[0];
			var data = $(tabClicked).attr('data-container');

			$(tabClicked).trigger('click');

			var container = $('#active_metadata_view #containers div#' + data);

			expect($(container)).not.toHaveClass('hidden');

		});

		it("should show the add class selected when a tab is clicked and remove class from all the others tabs", function() {
			var tabs = $('#active_metadata_view #tabs li');
			// click last tab

			var tabClicked = tabs[tabs.size()-1];
			$(tabClicked).trigger('click');

			expect($(tabClicked)).toHaveClass('selected');
			expect($('#active_metadata_view #tabs li.selected').size()).toEqual(1);

		});

		it("should verify that the input div contains the actual value of the form input of type text", function() {
			var $grip = $('.active_metadata_grip').first();
			var $field = $('.active_metadata_field').filter('[data-label=' + $grip.attr("data-label") + ']');			
			var value = "valore campo";
			$field.val(value);
			$grip.trigger('click');	
			expect($('#active_metadata_view #input_container div#input')).toHaveText(value);
		});

		it("should trace the current_tab name", function() {
			var tabs = $('#tabs ul li');
			var $tab = $(tabs[1]);

			$tab.trigger('click');

			expect(am.current_tab()).toBe($tab.attr('data-container'));

		});


	});


	describe("ActiveMetadata.Util", function() {

		it("should reset containers data-loaded to false", function() {

			$('#containers').children().attr('data-loaded', true);
			expect($('div[data-loaded=true]').length).toEqual($('div#containers').children().length);
			ActiveMetadata.Util.resetContainersDataFlag()			
			expect($('div[data-loaded=true]').length).toEqual(0);
		});
	});
});