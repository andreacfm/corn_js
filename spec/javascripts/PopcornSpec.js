describe("Popcorn", function() {
  var $first;
  var $last;

  var mock_defaults = {
    marginBorder: 4,
    arrowWidth: 19,
    marginArrow: 10
  };

  describe("framwork", function() {
    it("testing the framework is loaded into jquery", function() {
      expect($.fn.popcorn).toBeDefined();
    });
  });

  describe("default fat behaviour", function() {

    beforeEach(function() {
      loadFixtures('fatpopcorn-fixture.html');
      $elements = $('.open_popcorn').fatpopcorn({modelName:'modelName', modelId :1, token : 'TOKEN', current_user:1, watching:true});
      $first = $elements.first();
      $last = $elements.last();
      jasmine.Ajax.useMock();
    });

    it("should generate an hidden html with class fatpopcorn", function() {
      expect($('.fatpopcorn').first()).toBeHidden();
    });

    it("should generate the html only once", function() {
      expect($('.fatpopcorn').size()).toBe(1);
    });
		
    it("should create a .fatpopcorn_grip on the :hover class of the matched element", function() {
      expect($first.parent()).toBe('span.fatpopcorn_grip');
    });		

    describe("initialization", function() {
      beforeEach(function() {
        $element = $('.one').first();
        var options = {modelName:'modelName', modelId :1, token : 'TOKEN', current_user:1, watching:true}; 
        am = new FatPopcorn($element, options);
      });
      it("should require modelName", function() {
        var options = {};
        expect(function(){new FatPopcorn($element, options)}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
      });
      it("should require modelId", function() {
        var options = {modelName:'modelName'}; 
        expect(function(){new FatPopcorn($element, options)}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
      });
      it("should require form token", function() {
        var options = {modelName:'modelName', modelId :1}; 
        expect(function(){new FatPopcorn($element, options)}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
      });
      it("should require current_user", function() {
        var options = {modelName:'modelName', modelId :1, token : 'TOKEN'}; 
        expect(function(){new FatPopcorn($element, options)}).toThrow(new Error('parameters [modelName], [modelId], [token], [current_user] are required'));	
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
        expect($('.fatpopcorn')).toContain('form#notes_form');
      });
      it("should attach click events to any fatpopcorn_grip element", function() {
        expect($('.fatpopcorn_grip')).toHandle('click');
      });
      it("should be visible when fatpopcorn_grip element is clicked", function() {
        $('.fatpopcorn_grip').first().click();
        expect($('.fatpopcorn')).toBeVisible();
      });
      it("should not be visible when sonething else is clicked", function() {
        $('.fatpopcorn_grip').first().click();
        $('.other_element').click();
        expect($('.fatpopcorn')).not.toBeVisible();
      });			
      it("should set stream tab selected by default", function() {
        expect($('.header .stream-tab.active')).toExist();
      });
      it("should set stream body visible by default", function() {
        $('.fatpopcorn_grip').first().click();
        expect($('.popcorn-body .stream')).toBeVisible();
      });
      it("should set edit not visible by default", function() {
        $('.fatpopcorn_grip').first().click();
        expect($('.popcorn-body .edit')).not.toBeVisible();
      });
      it("should set history not visible by default", function() {
        $('.fatpopcorn_grip').first().click();
        expect($('.popcorn-body .history')).not.toBeVisible();
      });
      it("should have a click handle on stream tab", function() {
        $('.fatpopcorn_grip').first().click();
        expect($('.stream-tab')).toHandle('click');
      });
      it("should have a click handle on edit tab", function() {
        $('.fatpopcorn_grip').first().click();
        expect($('.edit-tab')).toHandle('click');
      });
      it("should have a click handle on history tab", function() {
        $('.fatpopcorn_grip').first().click();
        expect($('.history-tab')).toHandle('click');
      });
      it("should make the tab active when clicking edit-tab", function() {
        $('.fatpopcorn_grip').first().click();
        $('.edit-tab').first().click();
        expect($('.edit-tab')).toHaveClass('active');
      });						
      it("should make the stream and history tab not active when clicking edit-tab", function() {
        $('.fatpopcorn_grip').first().click();
        $('.edit-tab').first().click();
        expect($('.stream-tab')).not.toHaveClass('active');
        expect($('.history-tab')).not.toHaveClass('active');
      });						
      it("should make the tab active when clicking history-tab", function() {
        $('.fatpopcorn_grip').first().click();
        $('.history-tab').first().click();
        expect($('.history-tab')).toHaveClass('active');
      });						
      it("should make the stream and edit tab not active when clicking history-tab", function() {
        $('.fatpopcorn_grip').first().click();
        $('.history-tab').first().click();
        expect($('.stream-tab')).not.toHaveClass('active');
        expect($('.edit-tab')).not.toHaveClass('active');
      });						
      it("should make the tab active when clicking stream-tab", function() {
        $('.fatpopcorn_grip').first().click();
        $('.stream-tab').first().click();
        expect($('.stream-tab')).toHaveClass('active');
      });						
      it("should make the stream and edit tab not active when clicking stream-tab", function() {
        $('.fatpopcorn_grip').first().click();
        $('.stream-tab').first().click();
        expect($('.edit-tab')).not.toHaveClass('active');
        expect($('.history-tab')).not.toHaveClass('active');
      });		
			
      it("should add to the grip image the ability to close fatpopcorn", function() {
        $('.fatpopcorn_grip').first().click();
        $('.fatpopcorn_grip').first().click();
        expect($('.fatpopcorn')).not.toBeVisible();
      });
      // it("should add an event handler to resize when fatpopcorn is visible", function() {
        // 	$('.fatpopcorn_grip').first().click();
        // 	console.log($(window).data('events'))
        // 	expect($(window)).toHandle('resize');
        // });
        it("should position the control at the correct height under the element", function () {
          $('.fatpopcorn_grip').last().click();
          expect($('.fatpopcorn').offset().top).toBeGreaterThan($last.offset().top + 26);
        });
        it("should make only the stream visible when clicking on the stream-tab", function() {
          $('.fatpopcorn_grip').first().click();
          $('.stream-tab').first().click();
          expect($('.stream')).toBeVisible();				
          expect($('.history')).not.toBeVisible();				
          expect($('.edit')).not.toBeVisible();				
        });
        it("should make only the edit visible when clicking on the edit-tab", function() {
          $('.fatpopcorn_grip').first().click();
          $('.edit-tab').first().click();
          expect($('.edit')).toBeVisible();				
          expect($('.stream')).not.toBeVisible();				
          expect($('.history')).not.toBeVisible();				
        });
        it("should make only the history visible when clicking on the edit-tab", function() {
          $('.fatpopcorn_grip').first().click();
          $('.history-tab').first().click();
          expect($('.history')).toBeVisible();				
          expect($('.edit')).not.toBeVisible();				
          expect($('.stream')).not.toBeVisible();
        });
			

        // it("should verify that notes form handle submit.rails event", function(){
          // 	mock = sinon.mock(jQuery);
          // 	$('#send_note').trigger('click');
          // 	mock.expects("ajax").once();
          // 	mock.verify();
          // 	mock.restore();
          // });
          it("should manage the notes form action when view is opened", function() {
            $('.fatpopcorn_grip').first().click();
            $('.fatpopcorn').attr('data-label', 'my_label');
            expect($('.fatpopcorn #notes_form').attr('action')).toEqual("/active_metadata/modelName/1/my_label/notes");
          });
          it("should verify that form notes has been added with the provided token",function(){
            expect($('form#notes_form')).toContain('input[name="authenticity_token"]');
            expect($('input[name="authenticity_token"]')).toHaveValue('TOKEN');
          });
          it("should check the link of inserisci nota handles a click event",function(){
            expect($('#send_note')).toHandle('click');
          });
          it("should avoid closing the pop when the popup itself is clicked", function() {
            $('.fatpopcorn_grip').first().click();
            $('.fatpopcorn').click();
            expect($('.fatpopcorn')).toBeVisible();
          }); 
          it("should show the loader when making an ajax request", function() {
            $('.fatpopcorn_grip').first().click();
            var m = sinon.mock(jQuery, 'post');
            $('#send_note').trigger('click');
            expect($('.loader')).toBeVisible();
            m.restore();
          }); 
          describe("ajax checks", function() {
            beforeEach(function() {
              this.success_response = {
                send_note_success: {success: {status: 200,responseText: '<body></body>'}}
              };
            });
            it("should call ajaxSend on the loader when making an ajax request", function() {
              spyOnEvent($('.loader'), 'ajaxSend');
              $('.fatpopcorn_grip').first().click();
              $('#send_note').click();
              var request = mostRecentAjaxRequest();
              request.response(this.success_response.send_note_success.success);
              expect('ajaxSend').toHaveBeenTriggeredOn($('.loader'));
            }); 
            it("should call ajaxComplete on the loader when making an ajax request", function() {
              spyOnEvent($('.loader'), 'ajaxComplete');
              $('.fatpopcorn_grip').first().click();
              $('#send_note').click();
              var request = mostRecentAjaxRequest();
              request.response(this.success_response.send_note_success.success);
              expect('ajaxComplete').toHaveBeenTriggeredOn($('.loader'));
            });
            // it("should show a stream after sending a new note", function() {
              // 	spyOnEvent($('.loader'), 'ajaxSuccess');
              // 	$('.fatpopcorn_grip').first().click();
              // 	$('#send_note').click();
              // 	var request = mostRecentAjaxRequest();
              // 	request.response(this.success_response.send_note_success.success);
              // 	expect($(".stream-tab")).toHaveClass('active');
              // }); 
              // it("should request the stream of the element it becomes active", function() {
                // 	spyOnEvent($('.loader'), 'ajaxSend');
                // 	$(".stream-tab").click();
                // 	var request = mostRecentAjaxRequest();
                // 	request.response(this.success_response.send_note_success.success);
                // 	expect(request.url).toBe('/active_metadata/modelName/1/my_label/stream');
                // });
              });

              // it("should check the link of inserisci nota trigger a submit of a form",function(){
                // 	$('.fatpopcorn_grip').first().click();
                // 	var m = sinon.mock(jQuery, 'post');
                // 	$('#send_note').click();
                // 	m.expects('post').once();
                // 	m.verify();
                // 	m.restore();
                // });
			
                // it("should verify that exists the hook element for the uploader", function() {
                  // 	expect($('#containers div#attachments')).toContain('#active_metadata_uploader');	
                  // });
                });
              });

              describe("default behaviour", function() {
                beforeEach(function() {
                  loadFixtures('fixture.html');
                  $elements = $('.open_popcorn').popcorn();
                  $first = $elements.first();
                  $last = $elements.last();
                });

                it("should hide the popcorn containers", function() {
                  expect($('.open_popcorn').next().first()).toBeHidden();
                });

                it("should test that the popcorn hooks are binded to click event", function() {
                  expect($('.open_popcorn').first()).toHandle('click');
                });

                it("should test that the pop container has class popcorn", function() {
                  expect($('.open_popcorn').next().first()).toHaveClass('popcorn');
                });

                it("should show the containers on hook click", function() {
                  $first.click();
                  expect($first.next()).toBeVisible();
                });

                it("should position the container element in the center of the popupped one", function() {
                  $first.click();
                  expect($first.next().offset().left).toEqual(150);
                });

                it("should close any container when body is clicked", function() {
                  $('.open_popcorn').each(function() {
                    $(this).click();
                    expect($(this).next()).toBeVisible();
                  });

                  $(window).click();

                  $('.open_popcorn').each(function() {
                    expect($(this).next()).toBeHidden();
                  });
                });

                it("should hide any other opened container when a hook is clicked", function() {
                  $first.click();
                  $last.click();

                  expect($first.next()).toBeHidden();
                  expect($last.next()).toBeVisible();
                });
              })

              describe("arrow position", function() {
                var popcorn;
                var $leftElement;
                var $centerElement;
                var $rightElement;

                beforeEach(function() {
                  loadFixtures('fixture_arrow.html');
                  $elements = $('.open_popcorn').popcorn();
                  $leftElement = $elements.first();
                  $centerElement = $('.open_popcorn.two');
                  $rightElement = $elements.last();

                  popcorn = new Popcorn($leftElement, mock_defaults);
                });

                it("should calculate the right position of the popcorn window", function() {
                  expect(Popcorn.calculateRightOffset(200, 100)).toEqual(250);
                });

                it("should return false when the container don't collide with the right border", function() {
                  expect(new Popcorn($leftElement, mock_defaults).collideRight()).toBeFalsy();
                });

                it("should return true when the container collide with right border", function() {
                  expect(new Popcorn($rightElement, mock_defaults).collideRight()).toBeTruthy();
                });

                it("should return false when the container don't collide with the left border", function() {
                  expect(new Popcorn($rightElement, mock_defaults).collideLeft()).toBeFalsy();
                });

                it("should return true when the container collide with left border", function() {
                  expect(new Popcorn($leftElement, mock_defaults).collideLeft()).toBeTruthy();
                });

                describe("tail positioning behaviour", function() {
                  it("should place the tail in the true center of the element", function() {
                    $centerElement.offset({top: 400, left: 400});
                    $centerElement.click();
                    expect(tooltipTailOf($centerElement).offset().left).toEqual(149);
                  });

                  it("should place the tail in the true right corner when is stick to right", function() {
                    $rightElement.click();
                    var leftTooltipPosition = tooltipTailOf($rightElement).offset().left
                    expect(leftTooltipPosition).toEqual($('html').width() - 33);
                  });

                  function tooltipTailOf($element) {
                    return $element.next().find('.popcorn-tail');
                  }

                });

                describe("set the correct container position when not in the center", function() {

                  it("should position the container element in the right corner when element is stick to right", function() {
                    $rightElement.click();
                    expect($rightElement.next().offset().left + $rightElement.next().width() + 4).toEqual($('html').width());
                  });

                  it("should position the container element in the left corner when element is stick to left", function() {
                    $leftElement.click();
                    expect($leftElement.next().offset().left).toEqual(4);
                  });

                });

                describe("html of the content", function() {
                  it("should add a custom div inside the container one", function() {
                    expect($leftElement.next().children().select(":last-child")).toBe("div.popcorn-tail");
                  });

                  it("should wrap the content of the container with a div", function() {
                    expect($leftElement.next().children().select(":firt-child")).toBe("div.popcorn-body");
                  });

                });
              });
            });
