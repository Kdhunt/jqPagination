
$(function() {
    
    // the widget definition, where "custom" is the namespace,
    // "gallery-slider" the widget name
    $.widget( "custom.paginate", {
        // default options
        options: {
            id: "",
            minHeight: 400,
            maxHeight: 600,
            pageCount: 1,
            currentPage: 1,
            pagingTextColor: "#ffffff",
            pagingColor: "#8ce7ea",
            pagingAccentColor: "#56c3ea",
            pagingFontSize: "14px",
            wrapperNodes: ["H1","H2","H3","H4","H5","H6"],
            currentPageHeight: 0,
            currentPageElemCount: 0,
            elementsPerPage: null
            
        },
        // the constructor
        _create: function() {
            // add a class for theming 
            this.element.addClass( "paginate" );
          if (this.element[0].clientHeight == null || this.element[0].clientHeight < this.options.maxHeight)return;
            this.options.id = this.randomId();
            this.element.addClass(this.options.id);
            //Set up paging object
            this.paging = $('.paging');
            if(this.paging.length == 0){
                this.paging = $('<div class="pagination"><div class="paging"><div class="tostart lft">&#12298;</div><div class="prev lft">&#12296;</div><div class="next rht">        &#12297;</div><div class="toend rht">&#12299;</div></div></div>');
                
            }
            this.paging.insertAfter(this.element);
            //Set up new page Structure
            this.newpage = null;
            this.elements = this.element.children();
                           this.paginate();
                if(this.options.pageCount > 5){this.addRange();}
                this.gotopage(this.options.currentPage);
                this._bindEvents();
            this.style();
            page = this.getURLParam('page');
            if(this.IsNumeric(page) && page > 0){this.gotopage(page);}
            this._refresh();
        },
                
        // bind any events here
        _bindEvents: function(){
            var that = this;
            this.paging.find('.tostart').on("click", function(i){that.gotopage(1);});
            this.paging.find('.toend').on("click", function(){that.gotopage(that.options.pageCount)});
            this.paging.find('.prev').on("click", function(){that.gotopage(that.options.currentPage-1)});
            this.paging.find('.next').on("click", function(){that.gotopage(that.options.currentPage+1)});
            this.element.bind();
        },
              
        //register callbacks to handle events
        _trigger:function(event, message){
            
        },
                
        // called when created, and later when changing options
        _refresh: function() {
            //TODO: make any refresh updates here
            
            // trigger a callback/event
            $.event.trigger({type: "refresh.paginate"});
            
        },
                
        // events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {        
            //clean up items
            this.element.removeClass( "paginate" );
        },
                
        // _setOptions is called with a hash of all options that are changing
        // always refresh when changing options
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            //this._superApply( arguments );
            this._refresh();
        },
 
        // _setOption is called for each individual option that is changing
        _setOption: function( key, value ) {
            // prevent invalid option values
            //this._super( key, value );
        },
        addPage: function(){
            this.element.append("<div data-pagenum=\""+this.options.pageCount+"\" class=\"pagable inactive page"+this.options.pageCount+"\" ></div>");
            this.newpage = this.element.find('.page'+this.options.pageCount);
        },
        addPaging: function(){
            var that = this;
            var currPage = that.options.pageCount;
            this.paging.find('.next').before('<div class="pageNav pageto'+that.options.pageCount+'" >'+that.options.pageCount+'</div>');
            this.paging.find('.pageto'+that.options.pageCount).on("click", function(){that.gotopage(currPage)});
        },
        paginate: function(){
            var that = this;
            that.options.currentPageHeight = 0;
            that.options.currentPageElemCount = 0;
            that.addPage();
            
            this.elements.each(
                function(i, elem){
                    that.newpageCheck();
                    if(elem.clientHeight < that.options.maxHeight){
                        //it is not too tall to fit on one page, add the height to the page height
                        that.newpage.append(elem);
                        that.options.currentPageElemCount += 1;
                        if($.inArray(elem.nodeName, that.options.wrapperNodes) < 0){
                            that.options.currentPageHeight += elem.clientHeight;
                        }
                    }else{
                        that.pageDeep(elem);
                    }
                
                }
            );
        },
        gotopage:function(pagenumber){
            if(pagenumber < 1)pagenumber = 1;
            if(pagenumber > this.options.pageCount)pagenumber = this.options.pageCount;
            this.element.find('.pagable').addClass("inactive").removeClass("active");
            this.element.find('.page'+pagenumber).addClass("active").removeClass("inactive");
            this.paging.find('div').removeClass("selected");
            this.paging.find('div.pageto'+pagenumber).addClass('selected');
            this.options.currentPage = pagenumber;
            $.event.trigger({type: "pageTo",message: "page".pagenumber});
            this.showPaging();
           if(this.options.currentPage > 1){ 
               $('html, body').animate({scrollTop: (this.element[0].offsetTop)}, 1300, 'swing');
           }
        },
        style: function(){
            var that = this;
            this.paging.before('\
                <style>\n\
                    .'+this.options.id+'{overflow:hidden; }\
                    .pagination{width:940px;margin:0 auto;}\
                    .paging{margin:0px auto;width:'+(150+(40*this.options.pageCount))+'px;}\n\
                    .paging div{\n\
                        font-family: helvetica, sans-serif;\n\
                        font-size: '+that.options.pagingFontSize+';\n\
                        cursor:pointer;\n\
                        display:inline;\n\
                        padding:6px 9px 6px 10px;; \n\
                        line-height: 150%;\n\
                        margin-right:8px; \n\
                        color:'+that.options.pagingTextColor+';\n\
                        background-color: '+that.options.pagingColor+'; \n\
                        border:1px solid '+that.options.pagingAccentColor+';\n\
                        max-width: 15px;\n\
                        border-radius:5px;\n\
                        -webkit-border-radius: 5px;\n\
    -moz-border-radius: 5px;\n\
    border-radius: 5px;\n\
    -moz-background-clip: padding; -webkit-background-clip: padding-box; background-clip: padding-box;\n\
                    }\n\
                    .paging div:hover, .paging div.selected{\n\
                    background-color: '+that.options.pagingAccentColor+';\n\
                    border:1px solid '+that.options.pagingColor+';\n\
                    color: '+that.options.pagingColor+';\n\
                    }\n\
                    .paging div.lft{padding:6px 9px 6px 2px;}\n\
                    .paging div.rht{padding:6px 2px 6px 9px;}\n\
                    .paging .grayed{color:#ccc; border:1px solid #ccc; background-color:#fff;}\n\
                    .paging .outofrange, .paging .range.off{display:none;}\n\
                    .paging .range{color:'+that.options.pagingColor+';padding-right:7px;}\
                    div.active{\
                        display: block;\
                    }\
                    div.inactive{\
                        display:none;\
                    }\
                </style>\
            ');
        },
        showPaging: function(){
            var that = this;
            if(that.options.pageCount > 5){
                that.paging.find(".pageNav").addClass("outofrange");
                that.paging.find(".pageNav").first().removeClass("outofrange");
                that.paging.find(".pageNav").last().removeClass("outofrange");
                that.paging.find(".pageNav.pageto"+that.options.currentPage).removeClass("outofrange");
                that.paging.find(".pageNav.pageto"+(that.options.currentPage+1)).removeClass("outofrange");
                that.paging.find(".pageNav.pageto"+(that.options.currentPage-1)).removeClass("outofrange");
                if(that.options.currentPage <= that.options.pageCount-3)that.paging.find('.range.end').removeClass('off');
                if(that.options.currentPage > that.options.pageCount-3)that.paging.find('.range.end').addClass('off');
                if(that.options.currentPage >= 4)that.paging.find('.range.start').removeClass('off');
                if(that.options.currentPage < 4)that.paging.find('.range.start').addClass('off');
              }
            if(that.options.currentPage > 1)that.paging.find('.toStart, .prev').removeClass('grayed');
            if(that.options.currentPage <= 1)that.paging.find('.toStart, .prev').addClass('grayed');
            if(that.options.currentPage < that.options.pageCount)that.paging.find('.toEnd, .next').removeClass('grayed');
            if(that.options.currentPage >= that.options.pageCount)that.paging.find('.toEnd, .next').addClass('grayed'); 
        },
        addRange: function(){
            var that = this;
            that.paging.find(".pageNav").first().after("<span class=\"range start off\">..</span>");
            that.paging.find(".pageNav").last().before("<span class=\"range end off\">..</span>");
    
        },
        randomId: function(){
            var s = "";
            while(s.length<8&&8>0){
                var r = Math.random();
                s+= String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65));
            }
            this.options.id = s;

        },
        newpageCheck: function(){
            var that = this;
             if(that.options.currentPageHeight > that.options.maxHeight ||(that.options.elementsPerPage !== null && that.options.currentPageElemCount >= that.options.elementsPerPage)){
                if(that.options.pageCount === 1 ){that.addPaging();}
                that.options.pageCount += 1;
                                that.addPage();
                that.addPaging();
                that.options.currentPageHeight = 0;
                that.options.currentPageElemCount = 0;

            }
        },
        pageDeep: function(elem){
            var that = this;
            /*break out the content of the element so that it is not too tall for the page */
            var elems = elem.childNodes;
            var count = elems.length;
            for( var i=0; i< count; i++){
                if(i<count-1)that.newpageCheck();
                if(elems[0].clientHeight == null){
                    var elem = elems[0];
                    /* the nodetype for a text node is 3 */
                    if(elem.nodeType ==3){
                       var nodeText = elem.textContent.replace("([\n\f\s\t]{2,}|[\n]|\\n)","").replace("[\r]","<br />");
                       /* check nodeText for length */
                       if(nodeText.match("[a-zA-Z]{2,}")){
                           that.newpage.append("<p>"+nodeText+"</p>");
                       }
                       elems[0].parentNode.removeChild(elems[0]);
                       continue;
                    }
                }
                if(elems[0].clientHeight < that.options.maxHeight){
            /*it is not too tall to fit on one page, add the height to the page height */
                    if($.inArray(elems[0].nodeName, that.options.wrapperNodes) < 0){
                        that.options.currentPageHeight += elems[0].clientHeight;
                        that.options.currentPageElemCount += 1;
                    }
                    that.newpage.append(elems[0]);
                }else{
                       that.pageDeep(elems[0]);
                }
                
            }
    
        },
        getURLParam:function(name){   
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+name+"=([^&#]*)", 
                regex = new RegExp( regexS ),
                results = regex.exec( window.location.href );
            if( results == null ){
              return "";
            } else{
              return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        },
        IsNumeric:function(input){
            return (input - 0) == input && (input+'').replace(/^\s+|\s+$/g, "").length > 0;
        }
        
    });
});
