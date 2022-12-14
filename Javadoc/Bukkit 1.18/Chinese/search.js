var noResult={l:"查无结果"},watermark,loading={l:"加载索引中..."},catModules="模块",catPackages="程序包",catTypes="类和接口",catMembers="成员",catSearchTags="Search Tags",highlight='<span class="result-highlight">$&</span>',searchPattern="",fallbackPattern="",RANKING_THRESHOLD=2,NO_MATCH=65535,MIN_RESULTS=3,MAX_RESULTS=500,UNNAMED="<Unnamed>";function escapeHtml(a){return a.replace(/</g,"&lt;").replace(/>/g,"&gt;")}function getHighlightedText(c,d,e){var a=escapeHtml(c),b=a.replace(d,highlight);return b===a&&(b=a.replace(e,highlight)),b}function getURLPrefix(a){var c="",b="/";return a.item.category===catModules?a.item.l+b:a.item.category===catPackages&&a.item.m?a.item.m+b:((a.item.category===catTypes||a.item.category===catMembers)&&(a.item.m?c=a.item.m+b:$.each(packageSearchIndex,function(e,d){d.m&&a.item.p===d.l&&(c=d.m+b)})),c)}function createSearchPattern(c){var a="",b=!1;return c.replace(/,\s*/g,", ").trim().split(/\s+/).forEach(function(e,g){g>0&&(a+=b&&/^\w/.test(e)?"\\s+":"\\s*");for(var f=e.split(/(?=[A-Z,.()<>[/])/),d,c=0;c<f.length;c++){if(d=f[c],d==="")continue;a+=$.ui.autocomplete.escapeRegex(d),b=/\w$/.test(d),b&&(a+="([a-z0-9_$<>\\[\\]]*?)")}}),a}function createMatcher(a,b){var c=/[A-Z]/.test(a);return new RegExp(a,b+(c?"":"i"))}watermark='Search',$(function(){var a=$("#search-input"),b=$("#reset-button");a.val(''),a.prop("disabled",!1),b.prop("disabled",!1),a.val(watermark).addClass('watermark'),a.blur(function(){$(this).val().length===0&&$(this).val(watermark).addClass('watermark')}),a.on('click keydown paste',function(){$(this).val()===watermark&&$(this).val('').removeClass('watermark')}),b.click(function(){a.val('').focus()}),a.focus()[0].setSelectionRange(0,0)}),$.widget("custom.catcomplete",$.ui.autocomplete,{_create:function(){this._super(),this.widget().menu("option","items","> :not(.ui-autocomplete-category)")},_renderMenu:function(a,d){var b=this,c="";b.menu.bindings=$(),$.each(d,function(f,d){var e;d.category&&d.category!==c&&(a.append('<li class="ui-autocomplete-category">'+d.category+"</li>"),c=d.category),e=b._renderItemData(a,d),d.category?(e.attr("aria-label",d.category+" : "+d.l),e.attr("class","result-item")):(e.attr("aria-label",d.l),e.attr("class","result-item"))})},_renderItem:function(g,a){var b="",f,e,c=createMatcher(escapeHtml(searchPattern),"g"),d=new RegExp(fallbackPattern,"gi");return a.category===catModules?b=getHighlightedText(a.l,c,d):a.category===catPackages?b=getHighlightedText(a.l,c,d):a.category===catTypes?b=a.p&&a.p!==UNNAMED?getHighlightedText(a.p+"."+a.l,c,d):getHighlightedText(a.l,c,d):a.category===catMembers?b=a.p&&a.p!==UNNAMED?getHighlightedText(a.p+"."+a.c+"."+a.l,c,d):getHighlightedText(a.c+"."+a.l,c,d):a.category===catSearchTags?b=getHighlightedText(a.l,c,d):b=a.l,f=$("<li/>").appendTo(g),e=$("<div/>").appendTo(f),a.category===catSearchTags&&a.h?a.d?e.html(b+'<span class="search-tag-holder-result"> ('+a.h+')</span><br><span class="search-tag-desc-result">'+a.d+"</span><br>"):e.html(b+'<span class="search-tag-holder-result"> ('+a.h+")</span>"):a.m?e.html(a.m+"/"+b):e.html(b),f}});function rankMatch(c,d){if(!c)return NO_MATCH;var b=c.index,j,g,k,l,e,f,a=c.input,h=2,i=0;b===0||/\W/.test(a[b-1])||"_"===a[b]?h=0:("_"===a[b-1]||a[b]===a[b].toUpperCase()&&!/^[A-Z0-9_$]+$/.test(a))&&(h=1),j=b+c[0].length,g=a.indexOf("("),k=g>-1?g:a.length,d!==catModules&&d!==catSearchTags&&(l=d===catPackages?"/":".",g>-1&&g<b?i+=2:a.lastIndexOf(l,k)>=j&&(i+=2)),e=c[0].length===k?0:1;for(f=1;f<c.length;f++)c[f]&&(e+=c[f].length);return d===catTypes&&(/[A-Z]/.test(a.substring(j))&&(e+=5),/[A-Z]/.test(a.substring(0,b))&&(e+=5)),h+i+e/200}function doSearch(a,d){var b=[],e,g;if(searchPattern=createSearchPattern(a.term),fallbackPattern=createSearchPattern(a.term.toLowerCase()),searchPattern==="")return this.close();e=createMatcher(searchPattern,""),g=new RegExp(fallbackPattern,"i");function f(b,d,c,e){if(b){var a=[];return $.each(b,function(g,b){b.category=c;var f=rankMatch(d.exec(e(b)),c);return f<RANKING_THRESHOLD&&a.push({ranking:f,item:b}),a.length<=MAX_RESULTS}),a.sort(function(a,b){return a.ranking-b.ranking}).map(function(a){return a.item})}return[]}function c(c,d,h){var a=f(c,e,d,h),i;b=b.concat(a),a.length<=MIN_RESULTS&&!e.ignoreCase&&(i=f(c,g,d,h),b=b.concat(i.filter(function(b){return a.indexOf(b)===-1})))}c(moduleSearchIndex,catModules,function(a){return a.l}),c(packageSearchIndex,catPackages,function(b){return b.m&&a.term.indexOf("/")>-1?b.m+"/"+b.l:b.l}),c(typeSearchIndex,catTypes,function(b){return a.term.indexOf(".")>-1?b.p+"."+b.l:b.l}),c(memberSearchIndex,catMembers,function(b){return a.term.indexOf(".")>-1?b.p+"."+b.c+"."+b.l:b.l}),c(tagSearchIndex,catSearchTags,function(a){return a.l}),indexFilesLoaded()?updateSearchResults=function(){}:(updateSearchResults=function(){doSearch(a,d)},b.unshift(loading)),d(b)}$(function(){$("#search-input").catcomplete({minLength:1,delay:300,source:doSearch,response:function(b,a){a.content.length?$("#search-input").empty():a.content.push(noResult)},autoFocus:!0,focus:function(){return!1},position:{collision:"flip"},select:function(c,a){if(a.item.category){var b=getURLPrefix(a);a.item.category===catModules?b+="module-summary.html":a.item.category===catPackages?a.item.u?b=a.item.u:b+=a.item.l.replace(/\./g,'/')+"/package-summary.html":a.item.category===catTypes?a.item.u?b=a.item.u:a.item.p===UNNAMED?b+=a.item.l+".html":b+=a.item.p.replace(/\./g,'/')+"/"+a.item.l+".html":a.item.category===catMembers?(a.item.p===UNNAMED?b+=a.item.c+".html"+"#":b+=a.item.p.replace(/\./g,'/')+"/"+a.item.c+".html"+"#",a.item.u?b+=a.item.u:b+=a.item.l):a.item.category===catSearchTags&&(b+=a.item.u),top!==window?parent.classFrame.location=pathtoroot+b:window.location.href=pathtoroot+b,$("#search-input").focus()}}})})