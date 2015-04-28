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
 * CuiPaginationControl shows controls for paging through results.
 *
 *  PARAMS:
 *
 *      .numItems
 *      .itemsPerPage
 *      .currentPage
 *
 *  METHODS:
 *
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
                    params.onPageChange(page, params.itemsPerPage);
                }
            }
        });
        nextButton = new CuiButton({
            cssClass: "cui_page_control cui_right " + params.cssClass,
            content: new CuiWrapper("<span>&#x25b6;</span>"),
            onClick: function() {
                page++;
                if (page > Math.floor(params.numItems / params.itemsPerPage) - 1) {
                    page = Math.floor(params.numItems / params.itemsPerPage) - 1;
                }
                self.markDirty().refresh();
                // TODO: last page
                if (params.onPageChange) {
                    params.onPageChange(page, params.itemsPerPage);
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

    this.onRefresh = function($me, dirty, live) {
        if (dirty()) {
            if (pageOption) {
                pageOption.dead();
            }
            var numPages = Math.floor(params.numItems / params.itemsPerPage);
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
                        params.onPageChange(page, params.itemsPerPage);
                    }
                }
            });
            $pageLinks.html(pageOption.get$());
        }
        cuiRefresh([prevButton, nextButton, pageOption], live);
    }
}

