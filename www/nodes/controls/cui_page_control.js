/*
 * Copyright 2015 Canopy Services, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * CuiPageControl shows controls for paging through results.
 *
 *  PARAMS:
 *
 *      .numItems
 *      .itemsPerPage
 *      .currentPage
 *      .autoHide -- Hides control when there is a single page.  Default true.
 *
 *  METHODS:
 *
 *      .endIdx()
 *      .startIdx()
 *      .numPages()
 *      .numItemsPerPage()
 *      .setNumItems(numItems)
 *      .settemsPerPage(itemsPerPage)
 *      .setPage(page)
 *      .setPageByItemIdx(idx)
 *      .onPageChange(function(page, itemsPerPage))
 *
 *  CSS:
 *      params.cssClass:
 *          ""                    - no style
 *          "cui_default"         - default Canopy option style
 *          "MYCLASS"             - Your custom style
 *          "cui_default MYCLASS" - Your custom style, based on the default
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_option
 *          .MYCLASS.cui_option .cui_option.cui_toggle
 *          .MYCLASS.cui_option .cui_option.cui_toggle.cui_on
 *          .MYCLASS.cui_option .cui_option.cui_toggle.cui_off
 *
 */
function CuiPageControl(params) {
    cuiInitNode(this);
    this.markDirty();

    var self = this;
    var nextButton;
    var prevButton;
    var page = (params.currentPage !== undefined ? params.currentPage : 0);
    var $pageLinks;
    var pageOption;
    var numItems = params.numItems;
    var itemsPerPage = params.itemsPerPage;
    var autoHide = (params.autoHide ? params.autoHide : true);

    this.setNumItems = function(_numItems) {
        numItems = _numItems;
        this.markDirty();
        return this;
    }

    this.setItemsPerPage = function(_itemsPerPage) {
        itemsPerPage = _itemsPerPage;
        this.markDirty();
        return this;
    }

    // 1 past the end
    this.endIdx = function() {
        var end = itemsPerPage*(page + 1);
        if (end >= numItems) {
            return numItems;
        }
        return end;
    }


    this.startIdx = function() {
        return itemsPerPage*page;
    }

    this.numItems = function() {
        return numItems;
    }


    this.numItemsPerPage = function() {
        return itemsPerPage;
    }

    this.onConstruct = function() {
        prevButton = new CuiButton({
            cssClass: "cui_page_control cui_left " + params.cssClass,
            content: new CuiWrapper("<span>&#x25c0;</span>"),
            onClick: function() {
                page--;
                if (page < 0) {
                    page = 0
                }
                self.markDirty().refresh();
                if (params.onPageChange) {
                    params.onPageChange(page, itemsPerPage);
                }
            }
        });
        nextButton = new CuiButton({
            cssClass: "cui_page_control cui_right " + params.cssClass,
            content: new CuiWrapper("<span>&#x25b6;</span>"),
            onClick: function() {
                page++;
                if (page > self.numPages() - 1) {
                    page = self.numPages() - 1;
                }
                self.markDirty().refresh();
                // TODO: last page
                if (params.onPageChange) {
                    params.onPageChange(page, itemsPerPage);
                }
            }
        });

        $pageLinks = $("<div class='cui_page_control cui_page_links'></div>");

        return [
            "<div class='cui_page_control " + params.cssClass + "'>",
                $pageLinks,
                prevButton,
                nextButton,
            "</div>"
        ];
    }

    this.numPages = function() {
        return Math.floor((numItems + itemsPerPage -1) / itemsPerPage );
    }

    this.onRefresh = function($me, dirty, live) {
        if (dirty()) {
            if (pageOption) {
                pageOption.dead();
            }
            var numPages = this.numPages();
            if (autoHide && numPages <= 1) {
                this.get$().hide();
            } else {
                this.get$().show();
            }
            var items = [];
            for (var i = 0; i < numPages; i++) {
                items.push({
                    content: " " + (1 + i) + "&nbsp;",
                    value: i,
                });
            }
            pageOption = new CuiOption({
                items: items,
                selectedIdx: page,
                onSelect: function(idx, value) {
                    page = value;
                    if (params.onPageChange) {
                        params.onPageChange(page, itemsPerPage);
                    }
                }
            });
            $pageLinks.html(pageOption.get$());
        }
        cuiRefresh([prevButton, nextButton, pageOption], live);
    }
}

