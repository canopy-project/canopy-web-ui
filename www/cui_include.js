function includeJsFile(filename) {
    document.write(
        '<script src="' 
            + CUI_INCLUDE_PATH + filename + 
            '" type="text/javascript"><\/script>'
    );
}
function includeAbsCssFile(filename) {
    document.write(
        '<link href="'
            + filename + 
        '" rel="stylesheet" type="text/css">'
    );
}
function includeCssFile(filename) {
    document.write(
        '<link href="'
            + CUI_INCLUDE_PATH + filename + 
        '" rel="stylesheet" type="text/css">'
    );
}

includeJsFile("/cui_nav_state.js");
includeJsFile("/cui_node.js");
includeJsFile("/nodes/generic/cui_switcher.js");
includeJsFile("/nodes/generic/cui_toggle.js");
includeJsFile("/nodes/generic/cui_option.js");
includeJsFile("/nodes/test/cui_hello.js");
includeJsFile("/nodes/test/cui_hello_list.js");

includeJsFile ("/nodes/topbar/cui_topbar.js");
includeCssFile("/nodes/topbar/cui_topbar.css");

includeCssFile("/cui_base.css");

includeAbsCssFile("//fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700|ABeeZee|Titillium+Web:200,300,400,700");
